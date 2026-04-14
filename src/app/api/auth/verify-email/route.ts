import { NextRequest, NextResponse } from 'next/server'
import * as crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { verifyEmailVerificationToken, markEmailVerificationTokenUsed } from '@/lib/email-verification'
import { sendWelcomeEmail } from '@/lib/engagement/email-automation'
import { trackUser } from '@/lib/matomo-tracking'
import { calculateTrialEndDate } from '@/lib/trial'
import { uploadClickConversion } from '@/lib/google-ads'
import { logger } from '@/lib/logger'

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

    // If verification link included a plan (password signup with free trial), apply trialing after verification
    const plan = body.plan && ['starter', 'pro'].includes(body.plan) ? body.plan : null
    let appliedTrialEndsAt: Date | null = null
    if (plan) {
      const normalizedEmail = (user.email ?? '').toLowerCase().trim()
      const emailHash = crypto.createHash('sha256').update(normalizedEmail).digest('hex')
      const hasDeletedAccount = await prisma.trialAbusePrevention.findUnique({
        where: { emailHash },
      })
      appliedTrialEndsAt = !hasDeletedAccount ? calculateTrialEndDate() : null
      const status = appliedTrialEndsAt ? 'trialing' : 'active'

      if (hasDeletedAccount) {
        // Keep on free; they can upgrade via checkout
        await prisma.subscription.update({
          where: { userId: user.id },
          data: { plan: 'free', status: 'active', trialEndsAt: null },
        })
      } else {
        await prisma.subscription.update({
          where: { userId: user.id },
          data: {
            plan: plan as 'starter' | 'pro',
            status,
            trialEndsAt: appliedTrialEndsAt,
          },
        })
      }
      // Clear so resend links don't keep re-using it
      await prisma.user.update({
        where: { id: user.id },
        data: { signupRequestedPlan: null },
      })
    }

    // Google Ads: send trial conversion for all signups (campaign) when user has gclid
    const trialActionId = process.env.GOOGLE_ADS_TRIAL_CONVERSION_ACTION_ID
    if (trialActionId) {
      const userWithGclid = await prisma.user.findUnique({
        where: { id: user.id },
        select: { gclid: true },
      })
      if (userWithGclid?.gclid) {
        uploadClickConversion({
          gclid: userWithGclid.gclid,
          conversionDateTime: new Date(),
          conversionValue: 0,
          conversionActionId: trialActionId,
        }).catch(err =>
          logger.logError(err as Error, 'GOOGLE-ADS', 'Trial conversion upload failed (verify-email)', { userId: user.id })
        )
      }
    }

    // Send welcome email now that email is verified (use applied plan/trial so pro-trial gets correct content)
    const welcomeOverrides = plan
      ? {
          plan,
          isOnTrial: !!appliedTrialEndsAt,
          trialDays: appliedTrialEndsAt ? Math.ceil((appliedTrialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : undefined,
          qrCodeLimit: plan === 'pro' ? '500' : plan === 'starter' ? '100' : undefined,
        }
      : undefined
    try {
      await sendWelcomeEmail(user.id, welcomeOverrides)
    } catch (error) {
      console.error('Failed to send welcome email:', error)
      // Don't fail the verification if welcome email fails
    }

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

