import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createOTPToken, sendOTPEmail } from '@/lib/otp'

// Rate limiting: Store attempts in memory (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(email: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(email)

  if (!limit || now > limit.resetAt) {
    // Reset or create new limit
    rateLimitMap.set(email, {
      count: 1,
      resetAt: now + 60 * 60 * 1000, // 1 hour
    })
    return true
  }

  if (limit.count >= 5) {
    return false
  }

  limit.count++
  return true
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate email
    if (!body.email || typeof body.email !== 'string' || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const email = body.email
    const normalizedEmail = email.toLowerCase().trim()

    // Check rate limit
    if (!checkRateLimit(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    // Always return success even if user doesn't exist (security)
    // This prevents email enumeration attacks
    if (user && !user.isDeleted) {
      // Only send OTP if user exists and is not deleted
      const token = await createOTPToken(normalizedEmail)
      await sendOTPEmail(normalizedEmail, token)
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Code sent to your email',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json(
      { error: 'Failed to send code. Please try again.' },
      { status: 500 }
    )
  }
}

