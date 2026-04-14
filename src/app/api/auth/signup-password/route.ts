import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, validatePassword } from '@/lib/password'
import { createStripeCustomer } from '@/lib/stripe'
import { createEmailVerificationToken, sendVerificationEmail } from '@/lib/email-verification'
import { trackUser } from '@/lib/matomo-tracking'

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    if (!body.email || typeof body.email !== 'string' || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (!body.password || typeof body.password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const email = body.email.toLowerCase().trim()
    const name = body.name?.trim() || null

    // Optional plan (starter, pro) — stored in verification link so trialing is applied after email verification
    const requestedPlan = body.plan && ['starter', 'pro'].includes(body.plan) ? body.plan : null

    // Validate password strength
    const passwordValidation = validatePassword(body.password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password)

    // Capture gclid cookie at signup time for later Google Ads conversion attribution
    const gclid = request.cookies.get('gclid')?.value || null

    // Create user (email NOT verified yet)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        emailVerified: null, // Email verification required
        ...(gclid && { gclid }),
        ...(requestedPlan && { signupRequestedPlan: requestedPlan }),
      },
    })

    // Create subscription as free by default; trialing plan is applied after email verification (verify-email API)
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'free',
        status: 'active',
        trialEndsAt: null,
      },
    })

    // Create Stripe customer when Stripe is configured (use test key in dev for sandbox)
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const stripeCustomer = await createStripeCustomer({
          userId: user.id,
          userEmail: user.email!,
          userName: user.name || undefined,
        })

        await prisma.subscription.update({
          where: { userId: user.id },
          data: { stripeCustomerId: stripeCustomer.id },
        })
      } catch (stripeError) {
        console.error('Error creating Stripe customer:', stripeError)
      }
    }

    // Send verification email (include plan in link so verify-email can apply trialing after verification)
    try {
      const verificationToken = await createEmailVerificationToken(email)
      await sendVerificationEmail(email, verificationToken, requestedPlan ? { plan: requestedPlan } : undefined)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail the signup if email fails - they can request a new one
    }

    // Track user signup in Matomo (async, don't block response)
    trackUser.signup(user.id, {
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
      referrer: request.headers.get('referer') || undefined,
    }).catch(err => console.error('Failed to track signup:', err))

    return NextResponse.json(
      { 
        success: true,
        message: 'Account created successfully. Please check your email to verify your account.',
        requiresVerification: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}

