import { NextRequest, NextResponse } from 'next/server'
import { verifyOTPToken, incrementOTPAttempts } from '@/lib/otp'

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

    if (!body.token || typeof body.token !== 'string' || body.token.length !== 6) {
      return NextResponse.json(
        { error: 'Code must be 6 digits' },
        { status: 400 }
      )
    }

    const { email, token } = body
    const normalizedEmail = email.toLowerCase().trim()

    // Verify the OTP
    const result = await verifyOTPToken(normalizedEmail, token)

    if (!result.success) {
      // Increment attempts on failure
      await incrementOTPAttempts(normalizedEmail, token)
      
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: result.message,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json(
      { error: 'Failed to verify code. Please try again.' },
      { status: 500 }
    )
  }
}

