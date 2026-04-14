import { NextRequest, NextResponse } from 'next/server'
import * as crypto from 'crypto'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCheckoutSession, StripePlan, STRIPE_PLANS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { calculateTrialEndDate } from '@/lib/trial'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { plan } = body

    if (!plan || !STRIPE_PLANS[plan as StripePlan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    // Free-plan user upgrading: grant trial when eligible instead of sending to checkout
    if (subscription?.plan === 'free' && plan !== 'free') {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true },
      })
      const normalizedEmail = (user?.email ?? '').toLowerCase().trim()
      const emailHash = crypto.createHash('sha256').update(normalizedEmail).digest('hex')
      const hasDeletedAccount = await prisma.trialAbusePrevention.findUnique({
        where: { emailHash },
      })
      const neverHadTrial = subscription.trialEndsAt == null
      if (!hasDeletedAccount && neverHadTrial) {
        await prisma.subscription.update({
          where: { userId: session.user.id },
          data: {
            plan: plan as 'starter' | 'pro',
            status: 'trialing',
            trialEndsAt: calculateTrialEndDate(),
          },
        })
        // No trial conversion here — paid conversion fires from webhook when they pay
        return NextResponse.json({ startTrial: true, plan })
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'
    const successUrl = `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/dashboard?canceled=true`
    const gclid = request.cookies.get('gclid')?.value
    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      userEmail: session.user.email,
      plan: plan as StripePlan,
      successUrl,
      cancelUrl,
      customerId: subscription?.stripeCustomerId || undefined,
      gclid,
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

