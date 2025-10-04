import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { constructWebhookEvent } from '@/lib/stripe'
import Stripe from 'stripe'

// Disable body parsing, need raw body for webhook signature verification
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Get raw body as text
    const body = await request.text()
    
    // Get Stripe signature from headers
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('No Stripe signature found')
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature and construct event
    let event: Stripe.Event
    try {
      event = constructWebhookEvent(body, signature)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
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
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
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
      if (subscription.current_period_end) {
        const periodEnd = new Date(subscription.current_period_end * 1000)
        if (!isNaN(periodEnd.getTime())) {
          stripeCurrentPeriodEnd = periodEnd
        }
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
    const currentPeriodEnd = subscription.current_period_end 
      ? new Date(subscription.current_period_end * 1000)
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
      if (subscription.current_period_end) {
        const periodEnd = new Date(subscription.current_period_end * 1000)
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
  const subscriptionId = invoice.subscription as string

  if (!subscriptionId) {
    return
  }

  try {
    // Update subscription status to active
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: 'active',
      },
    })

    console.log(`Invoice payment succeeded for subscription ${subscriptionId}`)
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error)
    throw error
  }
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string

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

