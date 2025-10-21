import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTransporter, createEmailOptions } from '@/lib/email'
import { emailTemplates } from '@/lib/engagement/email-templates'
import { sendVerificationEmail } from '@/lib/email-verification'
import { sendPasswordResetEmail } from '@/lib/password'
import { sendOTPEmail } from '@/lib/otp'

interface EmailTestRequest {
  template: string
  email: string
  name?: string
  additionalData?: any
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body: EmailTestRequest = await request.json()
    
    if (!body.template || !body.email) {
      return NextResponse.json(
        { error: 'Template and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const transporter = createTransporter()
    let emailSent = false
    let errorMessage = ''

    try {
      switch (body.template) {
        case 'welcome': {
          const data = {
            name: body.name || 'Test User',
            trialDays: body.additionalData?.trialDays || 14,
            isOnTrial: body.additionalData?.isOnTrial ?? true
          }
          
          const emailOptions = createEmailOptions({
            to: body.email,
            subject: emailTemplates.welcome.subject,
            html: emailTemplates.welcome.html(data),
            text: emailTemplates.welcome.text(data),
          })
          
          await transporter.sendMail(emailOptions)
          emailSent = true
          break
        }

        case 'trialEnding': {
          const data = {
            name: body.name || 'Test User',
            daysLeft: body.additionalData?.daysLeft || 3,
            qrCodeCount: body.additionalData?.qrCodeCount || 5,
            scanCount: body.additionalData?.scanCount || 125
          }
          
          const subject = emailTemplates.trialEnding.subject.replace('{days}', data.daysLeft.toString())
          const emailOptions = createEmailOptions({
            to: body.email,
            subject,
            html: emailTemplates.trialEnding.html(data),
            text: emailTemplates.trialEnding.text(data),
          })
          
          await transporter.sendMail(emailOptions)
          emailSent = true
          break
        }

        case 'trialExpired': {
          const data = {
            name: body.name || 'Test User',
            previousPlan: body.additionalData?.previousPlan || 'Pro',
            qrCodeCount: body.additionalData?.qrCodeCount || 8,
            scanCount: body.additionalData?.scanCount || 450
          }
          
          const emailOptions = createEmailOptions({
            to: body.email,
            subject: emailTemplates.trialExpired.subject,
            html: emailTemplates.trialExpired.html(data),
            text: emailTemplates.trialExpired.text(data),
          })
          
          await transporter.sendMail(emailOptions)
          emailSent = true
          break
        }

        case 'usageInsights': {
          const data = {
            name: body.name || 'Test User',
            month: body.additionalData?.month || 'January',
            qrCodeCount: body.additionalData?.qrCodeCount || 12,
            scanCount: body.additionalData?.scanCount || 850,
            topQrCode: body.additionalData?.topQrCode || 'My Website QR Code',
            scanGrowth: body.additionalData?.scanGrowth || 15
          }
          
          const emailOptions = createEmailOptions({
            to: body.email,
            subject: emailTemplates.usageInsights.subject,
            html: emailTemplates.usageInsights.html(data),
            text: emailTemplates.usageInsights.text(data),
          })
          
          await transporter.sendMail(emailOptions)
          emailSent = true
          break
        }

        case 'featureAnnouncement': {
          const data = {
            name: body.name || 'Test User',
            featureName: body.additionalData?.featureName || 'Custom Branding',
            featureDescription: body.additionalData?.featureDescription || 'Add your logo and brand colors to your QR codes for a professional look.',
            ctaUrl: body.additionalData?.ctaUrl || 'https://theqrcode.io/dashboard'
          }
          
          const subject = emailTemplates.featureAnnouncement.subject.replace('{featureName}', data.featureName)
          const emailOptions = createEmailOptions({
            to: body.email,
            subject,
            html: emailTemplates.featureAnnouncement.html(data),
            text: emailTemplates.featureAnnouncement.text(data),
          })
          
          await transporter.sendMail(emailOptions)
          emailSent = true
          break
        }

        case 'reEngagement': {
          const data = {
            name: body.name || 'Test User',
            daysSinceLastLogin: body.additionalData?.daysSinceLastLogin || 30
          }
          
          const emailOptions = createEmailOptions({
            to: body.email,
            subject: emailTemplates.reEngagement.subject,
            html: emailTemplates.reEngagement.html(data),
            text: emailTemplates.reEngagement.text(data),
          })
          
          await transporter.sendMail(emailOptions)
          emailSent = true
          break
        }

        case 'emailVerification': {
          // For verification emails, we need a real token but we'll create a dummy one
          const crypto = require('crypto')
          const dummyToken = crypto.randomBytes(32).toString('hex')
          
          // Use the existing sendVerificationEmail function but override the URL
          const originalUrl = process.env.NEXTAUTH_URL
          process.env.NEXTAUTH_URL = 'https://theqrcode.io' // Use a fixed URL for testing
          
          await sendVerificationEmail(body.email, dummyToken)
          emailSent = true
          
          // Restore original URL
          process.env.NEXTAUTH_URL = originalUrl
          break
        }

        case 'passwordReset': {
          // Similar to verification, we'll create a dummy token
          const crypto = require('crypto')
          const dummyToken = crypto.randomBytes(32).toString('hex')
          
          const originalUrl = process.env.NEXTAUTH_URL
          process.env.NEXTAUTH_URL = 'https://theqrcode.io'
          
          await sendPasswordResetEmail(body.email, dummyToken)
          emailSent = true
          
          process.env.NEXTAUTH_URL = originalUrl
          break
        }

        case 'otp': {
          // Use the existing OTP function with a dummy token
          const dummyToken = '123456'
          await sendOTPEmail(body.email, dummyToken)
          emailSent = true
          break
        }

        default:
          return NextResponse.json(
            { error: 'Unknown template type' },
            { status: 400 }
          )
      }
    } catch (error) {
      console.error('Failed to send test email:', error)
      errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    }

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${body.email}`,
        template: body.template
      })
    } else {
      return NextResponse.json({
        success: false,
        error: errorMessage || 'Failed to send email'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Email test API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
