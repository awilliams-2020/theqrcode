import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateTrialEndDate } from '@/lib/trial'

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
    if (!['free', 'starter', 'pro', 'business'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Check if user has previously used a trial (prevent trial abuse)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true }
    })

    // Check trial abuse prevention table (same logic as createUser event)
    const crypto = require('crypto')
    const emailHash = crypto.createHash('sha256').update(user?.email || '').digest('hex')
    const hasDeletedAccount = await prisma.trialAbusePrevention.findUnique({
      where: { emailHash: emailHash }
    })

    // Check if user already has a subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    let subscription
    let shouldRedirectToCheckout = false
    let requestedPlan = plan

    if (existingSubscription) {
      // Update existing subscription with selected plan
      // No trial for users who have previously deleted account (prevent trial abuse)
      const trialEndsAt = (plan !== 'free' && !hasDeletedAccount) ? calculateTrialEndDate() : null
      
      // If user had deleted account before and is trying to sign up with paid plan,
      // default them to free and redirect to checkout
      if (hasDeletedAccount && plan !== 'free') {
        console.log(`User ${session.user.id} had previous trial, defaulting to free plan and redirecting to checkout for ${plan}`)
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
            plan: plan as 'free' | 'starter' | 'pro' | 'business',
            status: status,
            trialEndsAt: trialEndsAt
          }
        })
        console.log(`Updated subscription to plan ${plan} for user:`, session.user.id, 
          trialEndsAt ? `Trial ends: ${trialEndsAt?.toISOString()}` : 'No trial (previous deletion or free plan)')
      }
    } else {
      // Create new subscription with selected plan
      // No trial for users who have previously deleted account (prevent trial abuse)
      const trialEndsAt = (plan !== 'free' && !hasDeletedAccount) ? calculateTrialEndDate() : null
      
      // If user had deleted account before and is trying to sign up with paid plan,
      // default them to free and redirect to checkout
      if (hasDeletedAccount && plan !== 'free') {
        console.log(`User ${session.user.id} had previous trial, defaulting to free plan and redirecting to checkout for ${plan}`)
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
            plan: plan as 'free' | 'starter' | 'pro' | 'business',
            status: status,
            trialEndsAt: trialEndsAt
          }
        })
        console.log(`Created subscription with plan ${plan} for user:`, session.user.id, 
          trialEndsAt ? `Trial ends: ${trialEndsAt?.toISOString()}` : 'No trial (previous deletion or free plan)')
      }
    }

    return NextResponse.json({ 
      message: existingSubscription ? 'Subscription updated successfully' : 'Subscription created successfully',
      subscription,
      shouldRedirectToCheckout,
      requestedPlan: shouldRedirectToCheckout ? requestedPlan : undefined
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
