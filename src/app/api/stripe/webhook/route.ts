import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import * as crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { constructWebhookEvent } from '@/lib/stripe'
import Stripe from 'stripe'
import { trackSubscription } from '@/lib/matomo-tracking'
import { captureException } from '@/lib/sentry'
import { uploadClickConversion } from '@/lib/google-ads'
import { logger } from '@/lib/logger'
import { calculateTrialEndDate } from '@/lib/trial'

// Disable body parsing, need raw body for webhook signature verification
export const runtime = 'nodejs'

// GET endpoint for webhook health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Stripe webhook endpoint is active',
    endpoint: '/api/stripe/webhook',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
    logger.info('WEBHOOK', 'Received webhook request', { at: new Date().toISOString() })
  
  try {
    // Get raw body as Buffer to preserve exact bytes for signature verification
    // This is critical - Stripe signature verification requires the exact raw bytes
    const arrayBuffer = await request.arrayBuffer()
    const body = Buffer.from(arrayBuffer)
    
    logger.info('WEBHOOK', 'Webhook body received', { bodySize: body.length })
    
    // Get Stripe signature from headers
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      logger.error('WEBHOOK', 'No Stripe signature found in headers', { headers: JSON.stringify(Object.fromEntries(headersList.entries())) })
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }

    logger.info('WEBHOOK', 'Signature found, verifying')

    // Verify webhook signature and construct event
    // Pass body as Buffer directly to preserve exact bytes for signature verification
    let event: Stripe.Event
    try {
      event = constructWebhookEvent(body, signature)
      const mode = event.livemode ? 'LIVE' : 'TEST'
      logger.info('WEBHOOK', 'Signature verified', { mode, eventType: event.type, eventId: event.id })
    } catch (err) {
      logger.logError(err as Error, 'WEBHOOK', 'Signature verification failed')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice)
        break
      }

      default:
        logger.info('WEBHOOK', 'Unhandled event type', { eventType: event.type })
    }

    const duration = Date.now() - startTime
    logger.info('WEBHOOK', 'Event processed', { eventType: event.type, durationMs: duration })
    
    return NextResponse.json({ received: true, eventId: event.id, eventType: event.type })
  } catch (error) {
    const duration = Date.now() - startTime
    logger.logError(error as Error, 'WEBHOOK', 'Error processing webhook', { durationMs: duration })
    captureException(error, { endpoint: '/api/stripe/webhook', method: 'POST' })
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Handle successful checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const plan = session.metadata?.plan

  if (!userId || !plan) {
    logger.error('WEBHOOK', 'Missing userId or plan in checkout session metadata')
    return
  }

  try {
    // Get subscription details to ensure we have the price ID and period end
    let stripePriceId = session.line_items?.data[0]?.price?.id
    let stripeCurrentPeriodEnd = null

    if (session.subscription) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
      const subscription = await stripe.subscriptions.retrieve(session.subscription)
      stripePriceId = subscription.items.data[0]?.price?.id
      
      // Safely handle current_period_end
      if ((subscription as any).current_period_end) {
        const periodEnd = new Date(((subscription as any).current_period_end as number) * 1000)
        if (!isNaN(periodEnd.getTime())) {
          stripeCurrentPeriodEnd = periodEnd
        }
      }
    }

    // Get previous subscription to check if this is an upgrade and trial eligibility
    const previousSubscription = await prisma.subscription.findUnique({
      where: { userId }
    })

    const isUpgrade = Boolean(previousSubscription && previousSubscription.plan !== 'free' && previousSubscription.plan !== plan)

    // Free-plan users upgrading via checkout get a trial if they haven't already had one (TrialAbusePrevention)
    let status: 'active' | 'trialing' = 'active'
    let trialEndsAt: Date | null = null
    if (previousSubscription?.plan === 'free') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      })
      const normalizedEmail = (user?.email ?? '').toLowerCase().trim()
      const emailHash = crypto.createHash('sha256').update(normalizedEmail).digest('hex')
      const hasDeletedAccount = await prisma.trialAbusePrevention.findUnique({
        where: { emailHash },
      })
      const neverHadTrial = previousSubscription.trialEndsAt == null
      if (!hasDeletedAccount && neverHadTrial) {
        status = 'trialing'
        trialEndsAt = calculateTrialEndDate()
        logger.info('WEBHOOK', 'Free user upgrading — granting trial', { userId, plan })
      }
    }

    // Update or create subscription record
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        stripePriceId,
        plan,
        status,
        trialEndsAt,
        stripeCurrentPeriodEnd,
      },
      update: {
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        stripePriceId,
        plan,
        status,
        trialEndsAt,
        stripeCurrentPeriodEnd,
      },
    })

    logger.info('WEBHOOK', 'Subscription created/updated', { userId, plan, status })

    // Google Ads: only purchase conversion here (trial/signup conversion is sent from verify-email and save-gclid)
    const revenue = session.amount_total ? session.amount_total / 100 : 0
    const purchaseActionId = process.env.GOOGLE_ADS_CONVERSION_ACTION_ID
    prisma.user.findUnique({ where: { id: userId }, select: { gclid: true } })
      .then(async user => {
        if (!user?.gclid) {
          logger.info('GOOGLE-ADS', 'Conversion skipped — user has no gclid', { userId })
          return
        }
        if (!purchaseActionId) {
          logger.info('GOOGLE-ADS', 'Conversion skipped — GOOGLE_ADS_CONVERSION_ACTION_ID not set', { userId })
          return
        }
        try {
          await uploadClickConversion({
            gclid: user.gclid,
            conversionDateTime: new Date(),
            conversionValue: revenue,
            conversionActionId: purchaseActionId,
          })
          logger.info('GOOGLE-ADS', 'Conversion upload succeeded', { userId, gclid: user.gclid })
        } catch (err) {
          logger.logError(err as Error, 'GOOGLE-ADS', 'Conversion upload failed', { userId })
        }
      })
      .catch(err => logger.logError(err as Error, 'GOOGLE-ADS', 'Conversion upload failed', { userId }))

    // Track subscription purchase in Matomo (async, don't block)
    trackSubscription.purchase(
      userId,
      plan,
      revenue,
      session.id,
      {
        isUpgrade,
        previousPlan: previousSubscription?.plan,
      }
    ).catch(err => logger.logError(err as Error, 'PAYMENT', 'Failed to track subscription purchase in Matomo'))
  } catch (error) {
    logger.logError(error as Error, 'WEBHOOK', 'Error handling checkout completed')
    throw error
  }
}

// When downgrading to free, add to TrialAbusePrevention if they had a trial (prevents re-trial by upgrading again)
async function addToTrialAbusePreventionIfHadTrial(userId: string): Promise<void> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { status: true, trialEndsAt: true },
  })
  if (!sub || (sub.status !== 'trialing' && !sub.trialEndsAt)) return
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })
  if (!user?.email) return
  const emailHash = crypto.createHash('sha256').update(user.email.toLowerCase().trim()).digest('hex')
  await prisma.trialAbusePrevention.upsert({
    where: { emailHash },
    create: { emailHash, deletedAt: new Date() },
    update: { deletedAt: new Date() },
  })
  logger.info('WEBHOOK', 'Added to TrialAbusePrevention (had trial)', { userId })
}

// Handle subscription updates
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    logger.error('WEBHOOK', 'Missing userId in subscription metadata')
    return
  }

  try {
    // Safely handle current_period_end - it might be null or undefined
    const currentPeriodEnd = (subscription as any).current_period_end 
      ? new Date(((subscription as any).current_period_end as number) * 1000)
      : null

    // Only include stripeCurrentPeriodEnd if it's a valid date
    const updateData: any = {
      status: subscription.status,
      stripePriceId: subscription.items.data[0]?.price?.id,
    }

    if (currentPeriodEnd && !isNaN(currentPeriodEnd.getTime())) {
      updateData.stripeCurrentPeriodEnd = currentPeriodEnd
    }

    // Handle cancellation scenarios
    if (subscription.status === 'canceled') {
      if (subscription.cancel_at_period_end) {
        // Cancel at period end - keep current plan until period ends
        logger.info('WEBHOOK', 'Subscription set to cancel at period end', { userId })
      } else {
        // Immediate cancellation - downgrade to free; prevent re-trial abuse
        await addToTrialAbusePreventionIfHadTrial(userId)
        updateData.plan = 'free'
        updateData.trialEndsAt = null
        updateData.stripeCurrentPeriodEnd = null
        logger.info('WEBHOOK', 'Subscription immediately canceled, downgraded to free', { userId })
      }
    }

    await prisma.subscription.update({
      where: { userId },
      data: updateData,
    })

    logger.info('WEBHOOK', 'Subscription updated', { userId, status: subscription.status })
  } catch (error) {
    logger.logError(error as Error, 'WEBHOOK', 'Error handling subscription update')
    throw error
  }
}

// Handle subscription deletion/cancellation
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    logger.error('WEBHOOK', 'Missing userId in subscription metadata')
    return
  }

  try {
    // Get current subscription info before update
    const currentSubscription = await prisma.subscription.findUnique({
      where: { userId }
    })

    // Handle different cancellation scenarios
    const updateData: any = {
      status: 'canceled',
    }

    // If subscription was canceled immediately (not at period end)
    if (subscription.cancel_at_period_end === false) {
      // Immediate cancellation - downgrade to free; prevent re-trial abuse
      await addToTrialAbusePreventionIfHadTrial(userId)
      updateData.plan = 'free'
      updateData.trialEndsAt = null
      updateData.stripeCurrentPeriodEnd = null
    } else {
      // Cancel at period end - keep current plan until period ends
      // The subscription will remain active until the period ends
      if ((subscription as any).current_period_end) {
        const periodEnd = new Date(((subscription as any).current_period_end as number) * 1000)
        if (!isNaN(periodEnd.getTime())) {
          updateData.stripeCurrentPeriodEnd = periodEnd
        }
      }
    }

    await prisma.subscription.update({
      where: { userId },
      data: updateData,
    })

    logger.info('WEBHOOK', 'Subscription canceled', { userId, cancelAtPeriodEnd: subscription.cancel_at_period_end })

    // Track subscription cancellation in Matomo (async, don't block)
    if (currentSubscription) {
      trackSubscription.cancel(
        userId,
        currentSubscription.plan
      ).catch(err => logger.logError(err as Error, 'PAYMENT', 'Failed to track subscription cancellation in Matomo'))
    }
  } catch (error) {
    logger.logError(error as Error, 'WEBHOOK', 'Error handling subscription deletion')
    throw error
  }
}

// Handle subscription ended (after grace period)
async function handleSubscriptionEnded(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    logger.error('WEBHOOK', 'Missing userId in subscription metadata')
    return
  }

  try {
    await addToTrialAbusePreventionIfHadTrial(userId)
    // When subscription actually ends, downgrade to free plan
    await prisma.subscription.update({
      where: { userId },
      data: {
        status: 'canceled',
        plan: 'free',
        trialEndsAt: null,
        stripeCurrentPeriodEnd: null,
      },
    })

    logger.info('WEBHOOK', 'Subscription ended, downgraded to free', { userId })
  } catch (error) {
    logger.logError(error as Error, 'WEBHOOK', 'Error handling subscription ended')
    throw error
  }
}

// Handle successful invoice payment
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = typeof (invoice as any).subscription === 'string' ? (invoice as any).subscription : null

  if (!subscriptionId) {
    return
  }

  try {
    // Get subscription to find user and check if this is a renewal
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscriptionId }
    })

    if (subscription && subscription.userId) {
      // Update subscription status to active
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscriptionId },
        data: {
          status: 'active',
        },
      })

      logger.info('WEBHOOK', 'Invoice payment succeeded', { subscriptionId })

      // Track subscription renewal in Matomo if this is a recurring payment (async, don't block)
      // Invoices for new subscriptions are already tracked in handleCheckoutCompleted
      if (invoice.billing_reason === 'subscription_cycle') {
        const revenue = invoice.amount_paid ? invoice.amount_paid / 100 : 0
        trackSubscription.renew(
          subscription.userId,
          subscription.plan,
          revenue
        ).catch(err => logger.logError(err as Error, 'PAYMENT', 'Failed to track subscription renewal in Matomo'))
      }
    } else {
      // Just update status if we can't find the user
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscriptionId },
        data: {
          status: 'active',
        },
      })
    }
  } catch (error) {
    logger.logError(error as Error, 'WEBHOOK', 'Error handling invoice payment succeeded')
    throw error
  }
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = typeof (invoice as any).subscription === 'string' ? (invoice as any).subscription : null

  if (!subscriptionId) {
    return
  }

  try {
    // Update subscription status to past_due
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: 'past_due',
      },
    })

    logger.info('WEBHOOK', 'Invoice payment failed', { subscriptionId })
  } catch (error) {
    logger.logError(error as Error, 'WEBHOOK', 'Error handling invoice payment failed')
    throw error
  }
}

