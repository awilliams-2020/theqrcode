import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyEmailVerificationToken, markEmailVerificationTokenUsed } from '@/lib/email-verification'
import { sendWelcomeEmail } from '@/lib/engagement/email-automation'
import { trackUser } from '@/lib/matomo-tracking'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate token
    if (!body.token || typeof body.token !== 'string') {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Verify token
    const verification = await verifyEmailVerificationToken(body.token)
    
    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.message || 'Invalid verification token' },
        { status: 400 }
      )
    }

    // Mark token as used
    await markEmailVerificationTokenUsed(body.token)

    // Update user's emailVerified field
    const user = await prisma.user.update({
      where: { email: verification.email! },
      data: { emailVerified: new Date() },
    })

    // Send welcome email now that email is verified
    sendWelcomeEmail(user.id).catch((error) => {
      console.error('Failed to send welcome email:', error)
      // Don't fail the verification if welcome email fails
    })

    // Track email verification in Matomo (async, don't block response)
    trackUser.verifyEmail(user.id, {
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    }).catch(err => console.error('Failed to track email verification:', err))

    return NextResponse.json(
      { 
        success: true,
        message: 'Email verified successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error verifying email:', error)
    return NextResponse.json(
      { error: 'Failed to verify email. Please try again.' },
      { status: 500 }
    )
  }
}

