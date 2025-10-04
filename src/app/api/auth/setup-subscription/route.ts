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

    // Check if user has previously been soft-deleted (no trial for returning users)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isDeleted: true } as any
    })

    const hasBeenDeleted = (user as any)?.isDeleted === true

    // Check if user already has a subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    let subscription

    if (existingSubscription) {
      // Update existing subscription with selected plan
      // No trial for users who have been soft-deleted before
      const trialEndsAt = (plan !== 'free' && !hasBeenDeleted) ? calculateTrialEndDate() : null
      
      // Determine status based on plan and trial availability
      let status: 'active' | 'trialing'
      if (plan === 'free') {
        // Free plan users get trialing status if they haven't been deleted before
        status = hasBeenDeleted ? 'active' : 'trialing'
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
        trialEndsAt ? `Trial ends: ${trialEndsAt?.toISOString()}` : 'No trial (returning user or free plan)')
    } else {
      // Create new subscription with selected plan
      // No trial for users who have been soft-deleted before
      const trialEndsAt = (plan !== 'free' && !hasBeenDeleted) ? calculateTrialEndDate() : null
      
      // Determine status based on plan and trial availability
      let status: 'active' | 'trialing'
      if (plan === 'free') {
        // Free plan users get trialing status if they haven't been deleted before
        status = hasBeenDeleted ? 'active' : 'trialing'
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
        trialEndsAt ? `Trial ends: ${trialEndsAt?.toISOString()}` : 'No trial (returning user or free plan)')
    }

    return NextResponse.json({ 
      message: existingSubscription ? 'Subscription updated successfully' : 'Subscription created successfully',
      subscription 
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
