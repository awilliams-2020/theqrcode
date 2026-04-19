import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateTrialEndDate } from '@/lib/trial'
import { logger } from '@/lib/logger'
import { sendWelcomeEmail, hasReceivedWelcomeEmail } from '@/lib/engagement/email-automation'

/**
 * Setup subscription (plan + trial). Called from SubscriptionSetup when user lands on /auth/setup.
 * That happens for: OAuth signup with trial (Google/GitHub → callbackUrl /auth/setup?plan=pro).
 * NOT called when returning from Stripe checkout (Stripe success_url is /dashboard).
 * See docs/WELCOME_EMAIL_FLOWS.md for full flow summary.
 */

// Extend the session type to include user id
interface ExtendedSession {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession | null
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await request.json()
    
    // Validate plan
    if (!['free', 'starter', 'pro'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Check if user has previously used a trial (prevent trial abuse)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true }
    })

    // Check trial abuse prevention table (same logic as createUser event)
    // Normalize email to prevent duplicate hashes from case/whitespace differences
    const crypto = require('crypto')
    const normalizedEmail = (user?.email || '').toLowerCase().trim()
    const emailHash = crypto.createHash('sha256').update(normalizedEmail).digest('hex')
    const hasDeletedAccount = await prisma.trialAbusePrevention.findUnique({
      where: { emailHash: emailHash }
    })

    // Check if user already has a subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    let subscription
    let shouldRedirectToCheckout = false
    const requestedPlan = plan

    if (existingSubscription) {
      // Update existing subscription with selected plan
      // No trial for users who have previously deleted account (prevent trial abuse)
      const trialEndsAt = (plan !== 'free' && !hasDeletedAccount) ? calculateTrialEndDate() : null
      
      // If user had deleted account before and is trying to sign up with paid plan,
      // default them to free and redirect to checkout
      if (hasDeletedAccount && plan !== 'free') {
        logger.info('AUTH', 'User had previous trial, defaulting to free plan and redirecting to checkout', { userId: session.user.id, plan })
        subscription = await prisma.subscription.update({
          where: { userId: session.user.id },
          data: {
            plan: 'free',
            status: 'active',
            trialEndsAt: null
          }
        })
        shouldRedirectToCheckout = true
      } else {
        // Normal flow - assign requested plan
        // Determine status based on plan and trial availability
        let status: 'active' | 'trialing'
        if (plan === 'free') {
          // Free plan users are always active (no trial for free plan)
          status = 'active'
        } else {
          // Paid plan users get trialing status if trial is available
          status = trialEndsAt ? 'trialing' : 'active'
        }
        
        subscription = await prisma.subscription.update({
          where: { userId: session.user.id },
          data: {
            plan: plan as 'free' | 'starter' | 'pro',
            status: status,
            trialEndsAt: trialEndsAt
          }
        })
        logger.info('AUTH', `Updated subscription to plan ${plan}`, {
          userId: session.user.id,
          trialEndsAt: trialEndsAt?.toISOString() ?? null
        })
      }
      // Send welcome email for OAuth signups (plan now set) if not already sent
      if (!shouldRedirectToCheckout && !(await hasReceivedWelcomeEmail(session.user.id))) {
        const sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } })
        if (sub) {
          const trialEndsAt = sub.trialEndsAt
          const isOnTrial = !!(trialEndsAt && trialEndsAt > new Date())
          const trialDays = isOnTrial && trialEndsAt
            ? Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : undefined
          const qrCodeLimit = (plan === 'pro' || plan === 'developer') ? '500' : plan === 'starter' ? '100' : undefined
          sendWelcomeEmail(session.user.id, {
            plan: sub.plan,
            isOnTrial,
            trialDays,
            qrCodeLimit,
          }).catch(err => logger.logError(err as Error, 'AUTH', 'Failed to send welcome email after setup'))
        }
      }
    } else {
      // Create new subscription with selected plan
      // No trial for users who have previously deleted account (prevent trial abuse)
      const trialEndsAt = (plan !== 'free' && !hasDeletedAccount) ? calculateTrialEndDate() : null
      
      // If user had deleted account before and is trying to sign up with paid plan,
      // default them to free and redirect to checkout
      if (hasDeletedAccount && plan !== 'free') {
        logger.info('AUTH', 'User had previous trial, defaulting to free plan and redirecting to checkout', { userId: session.user.id, plan })
        subscription = await prisma.subscription.create({
          data: {
            userId: session.user.id,
            plan: 'free',
            status: 'active',
            trialEndsAt: null
          }
        })
        shouldRedirectToCheckout = true
      } else {
        // Normal flow - assign requested plan
        // Determine status based on plan and trial availability
        let status: 'active' | 'trialing'
        if (plan === 'free') {
          // Free plan users are always active (no trial for free plan)
          status = 'active'
        } else {
          // Paid plan users get trialing status if trial is available
          status = trialEndsAt ? 'trialing' : 'active'
        }
        
        subscription = await prisma.subscription.create({
          data: {
            userId: session.user.id,
            plan: plan as 'free' | 'starter' | 'pro',
            status: status,
            trialEndsAt: trialEndsAt
          }
        })
        logger.info('AUTH', `Created subscription with plan ${plan}`, {
          userId: session.user.id,
          trialEndsAt: trialEndsAt?.toISOString() ?? null
        })
      }
      // Send welcome email for OAuth signups (plan now set) if not already sent
      if (!shouldRedirectToCheckout && !(await hasReceivedWelcomeEmail(session.user.id))) {
        const sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } })
        if (sub) {
          const trialEndsAt = sub.trialEndsAt
          const isOnTrial = !!(trialEndsAt && trialEndsAt > new Date())
          const trialDays = isOnTrial && trialEndsAt
            ? Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : undefined
          const qrCodeLimit = (plan === 'pro' || plan === 'developer') ? '500' : plan === 'starter' ? '100' : undefined
          sendWelcomeEmail(session.user.id, {
            plan: sub.plan,
            isOnTrial,
            trialDays,
            qrCodeLimit,
          }).catch(err => logger.logError(err as Error, 'AUTH', 'Failed to send welcome email after setup'))
        }
      }
    }

    return NextResponse.json({ 
      message: existingSubscription ? 'Subscription updated successfully' : 'Subscription created successfully',
      subscription,
      shouldRedirectToCheckout,
      requestedPlan: shouldRedirectToCheckout ? requestedPlan : undefined
    })
  } catch (error) {
    logger.logError(error as Error, 'AUTH', 'Error creating subscription')
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
