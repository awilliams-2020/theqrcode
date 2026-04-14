import Stripe from 'stripe'

// Initialize Stripe with the secret key (only if available)
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
      typescript: true,
    })
  : null

// Stripe price IDs for each plan (set these in your Stripe dashboard)
export const STRIPE_PLANS = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
    name: 'Starter',
    price: 9,
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    name: 'Pro',
    price: 29,
  },
} as const

export type StripePlan = keyof typeof STRIPE_PLANS

/**
 * Create a Stripe customer for a user
 */
export async function createStripeCustomer({
  userId,
  userEmail,
  userName,
}: {
  userId: string
  userEmail: string
  userName?: string
}) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your STRIPE_SECRET_KEY environment variable.')
  }

  try {
    const customer = await stripe.customers.create({
      email: userEmail,
      name: userName,
      metadata: {
        userId,
      },
    })

    return customer
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    throw error
  }
}

/**
 * Delete a Stripe customer. No-op if Stripe is not configured or customerId is empty.
 * Ignores 404 (customer already deleted or not found).
 */
export async function deleteStripeCustomer(customerId: string | null | undefined): Promise<void> {
  if (!customerId?.trim()) return
  if (!stripe) return

  try {
    await stripe.customers.del(customerId)
  } catch (error: unknown) {
    const err = error as { code?: string }
    if (err?.code === 'resource_missing_no_such_customer') {
      return // Already deleted or never existed
    }
    console.error('Error deleting Stripe customer:', error)
    throw error
  }
}

/**
 * Create a Stripe checkout session for subscription
 */
export async function createCheckoutSession({
  userId,
  userEmail,
  plan,
  successUrl,
  cancelUrl,
  customerId,
  gclid,
}: {
  userId: string
  userEmail: string
  plan: StripePlan
  successUrl: string
  cancelUrl: string
  customerId?: string
  gclid?: string
}) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your STRIPE_SECRET_KEY environment variable.')
  }

  const planDetails = STRIPE_PLANS[plan]

  if (!planDetails) {
    throw new Error(`Invalid plan: ${plan}`)
  }

  try {
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: planDetails.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        plan,
        ...(gclid && { gclid }),
      },
      subscription_data: {
        metadata: {
          userId,
          plan,
        },
      },
    }

    // Use existing customer ID if available, otherwise use email
    if (customerId) {
      sessionConfig.customer = customerId
    } else {
      sessionConfig.customer_email = userEmail
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

/**
 * Create a Stripe customer portal session for managing subscriptions
 */
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your STRIPE_SECRET_KEY environment variable.')
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return session
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw error
  }
}

/**
 * Get subscription details from Stripe
 */
export async function getSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your STRIPE_SECRET_KEY environment variable.')
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error retrieving subscription:', error)
    throw error
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your STRIPE_SECRET_KEY environment variable.')
  }

  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

/**
 * Update subscription to a different plan
 */
export async function updateSubscription({
  subscriptionId,
  newPlan,
}: {
  subscriptionId: string
  newPlan: StripePlan
}) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your STRIPE_SECRET_KEY environment variable.')
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const planDetails = STRIPE_PLANS[newPlan]

    const updated = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: planDetails.priceId,
        },
      ],
      metadata: {
        plan: newPlan,
      },
    })

    return updated
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}

/**
 * Verify webhook signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your STRIPE_SECRET_KEY environment variable.')
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET')
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    throw error
  }
}

