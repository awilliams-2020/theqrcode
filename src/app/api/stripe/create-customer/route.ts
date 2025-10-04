import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createStripeCustomer } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already has a Stripe customer ID
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (subscription?.stripeCustomerId) {
      return NextResponse.json({ 
        message: 'User already has Stripe customer',
        customerId: subscription.stripeCustomerId 
      })
    }

    // Create Stripe customer
    const stripeCustomer = await createStripeCustomer({
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name || undefined,
    })

    // Update subscription with Stripe customer ID
    await prisma.subscription.update({
      where: { userId: session.user.id },
      data: { stripeCustomerId: stripeCustomer.id }
    })

    return NextResponse.json({ 
      message: 'Stripe customer created successfully',
      customerId: stripeCustomer.id 
    })
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    return NextResponse.json(
      { error: 'Failed to create Stripe customer' },
      { status: 500 }
    )
  }
}
