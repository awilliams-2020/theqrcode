import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  verifyPasswordResetToken,
  markPasswordResetTokenUsed,
  hashPassword,
  validatePassword,
} from '@/lib/password'
import { trackUser } from '@/lib/matomo-tracking'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    if (!body.token || typeof body.token !== 'string') {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      )
    }

    if (!body.password || typeof body.password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(body.password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      )
    }

    // Verify token
    const tokenVerification = await verifyPasswordResetToken(body.token)
    if (!tokenVerification.valid || !tokenVerification.email) {
      return NextResponse.json(
        { error: tokenVerification.message || 'Invalid reset token' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(body.password)

    // Update user password
    const user = await prisma.user.update({
      where: { email: tokenVerification.email },
      data: {
        password: hashedPassword,
        emailVerified: new Date(), // Ensure email is verified
      },
    })

    // Mark token as used
    await markPasswordResetTokenUsed(body.token)

    // Track password reset in Matomo (async, don't block response)
    trackUser.resetPassword(user.id, {
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    }).catch(err => console.error('Failed to track password reset:', err))

    return NextResponse.json(
      { 
        success: true,
        message: 'Password reset successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'Failed to reset password. Please try again.' },
      { status: 500 }
    )
  }
}

