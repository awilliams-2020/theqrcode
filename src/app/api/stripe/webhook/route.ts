import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { constructWebhookEvent } from '@/lib/stripe'
import Stripe from 'stripe'
import { trackSubscription } from '@/lib/matomo-tracking'
import { captureException } from '@/lib/sentry'

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
  console.log('[WEBHOOK] Received webhook request at', new Date().toISOString())
  
  try {
    // Get raw body as Buffer to preserve exact bytes for signature verification
    // This is critical - Stripe signature verification requires the exact raw bytes
    const arrayBuffer = await request.arrayBuffer()
    const body = Buffer.from(arrayBuffer)
    
    console.log('[WEBHOOK] Body size:', body.length, 'bytes')
    
    // Get Stripe signature from headers
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('[WEBHOOK] No Stripe signature found in headers')
      console.log('[WEBHOOK] Available headers:', Object.fromEntries(headersList.entries()))
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }

    console.log('[WEBHOOK] Signature found, verifying...')

    // Verify webhook signature and construct event
    // Pass body as Buffer directly to preserve exact bytes for signature verification
    let event: Stripe.Event
    try {
      event = constructWebhookEvent(body, signature)
      const mode = event.livemode ? 'LIVE' : 'TEST'
      console.log(`[WEBHOOK] Signature verified successfully. Mode: ${mode}, Event type: ${event.type}, Event ID: ${event.id}`)
    } catch (err) {
      console.error('[WEBHOOK] Signature verification failed:', err)
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
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`)
    }

    const duration = Date.now() - startTime
    console.log(`[WEBHOOK] Successfully processed event ${event.type} in ${duration}ms`)
    
    return NextResponse.json({ received: true, eventId: event.id, eventType: event.type })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('[WEBHOOK] Error processing webhook after', duration, 'ms:', error)
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
    console.error('Missing userId or plan in checkout session metadata')
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

    // Get previous subscription to check if this is an upgrade
    const previousSubscription = await prisma.subscription.findUnique({
      where: { userId }
    })

    const isUpgrade = Boolean(previousSubscription && previousSubscription.plan !== 'free' && previousSubscription.plan !== plan)

    // Update or create subscription record
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        stripePriceId,
        plan,
        status: 'active',
        trialEndsAt: null, // End trial when paid subscription starts
        stripeCurrentPeriodEnd,
      },
      update: {
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        stripePriceId,
        plan,
        status: 'active',
        trialEndsAt: null, // End trial when upgrading from trial
        stripeCurrentPeriodEnd,
      },
    })

    console.log(`Subscription created/updated for user ${userId} - Plan: ${plan}, Status: active, Trial ended`)

    // Track subscription purchase in Matomo (async, don't block)
    const revenue = session.amount_total ? session.amount_total / 100 : 0 // Convert cents to dollars
    trackSubscription.purchase(
      userId,
      plan,
      revenue,
      session.id,
      {
        isUpgrade,
        previousPlan: previousSubscription?.plan,
      }
    ).catch(err => console.error('Failed to track subscription purchase:', err))
  } catch (error) {
    console.error('Error handling checkout completed:', error)
    throw error
  }
}

// Handle subscription updates
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('Missing userId in subscription metadata')
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
        console.log(`Subscription set to cancel at period end for user ${userId}`)
      } else {
        // Immediate cancellation - downgrade to free
        updateData.plan = 'free'
        updateData.stripeCurrentPeriodEnd = null
        console.log(`Subscription immediately canceled for user ${userId} - downgraded to free`)
      }
    }

    await prisma.subscription.update({
      where: { userId },
      data: updateData,
    })

    console.log(`Subscription updated for user ${userId} - Status: ${subscription.status}`)
  } catch (error) {
    console.error('Error handling subscription update:', error)
    throw error
  }
}

// Handle subscription deletion/cancellation
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('Missing userId in subscription metadata')
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
      // Immediate cancellation - downgrade to free
      updateData.plan = 'free'
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

    console.log(`Subscription canceled for user ${userId} - Cancel at period end: ${subscription.cancel_at_period_end}`)

    // Track subscription cancellation in Matomo (async, don't block)
    if (currentSubscription) {
      trackSubscription.cancel(
        userId,
        currentSubscription.plan
      ).catch(err => console.error('Failed to track subscription cancellation:', err))
    }
  } catch (error) {
    console.error('Error handling subscription deletion:', error)
    throw error
  }
}

// Handle subscription ended (after grace period)
async function handleSubscriptionEnded(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('Missing userId in subscription metadata')
    return
  }

  try {
    // When subscription actually ends, downgrade to free plan
    await prisma.subscription.update({
      where: { userId },
      data: {
        status: 'canceled',
        plan: 'free',
        stripeCurrentPeriodEnd: null,
      },
    })

    console.log(`Subscription ended for user ${userId} - downgraded to free plan`)
  } catch (error) {
    console.error('Error handling subscription ended:', error)
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

      console.log(`Invoice payment succeeded for subscription ${subscriptionId}`)

      // Track subscription renewal in Matomo if this is a recurring payment (async, don't block)
      // Invoices for new subscriptions are already tracked in handleCheckoutCompleted
      if (invoice.billing_reason === 'subscription_cycle') {
        const revenue = invoice.amount_paid ? invoice.amount_paid / 100 : 0
        trackSubscription.renew(
          subscription.userId,
          subscription.plan,
          revenue
        ).catch(err => console.error('Failed to track subscription renewal:', err))
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
    console.error('Error handling invoice payment succeeded:', error)
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

    console.log(`Invoice payment failed for subscription ${subscriptionId}`)
  } catch (error) {
    console.error('Error handling invoice payment failed:', error)
    throw error
  }
}

