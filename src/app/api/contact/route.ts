import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail, ContactFormData } from '@/lib/email'

// Validation helper functions
const validateContactForm = (data: any): { valid: boolean; errors: string[]; data?: ContactFormData } => {
  const errors: string[] = []

  if (!data.firstName || typeof data.firstName !== 'string' || data.firstName.trim().length === 0) {
    errors.push('First name is required')
  } else if (data.firstName.length > 100) {
    errors.push('First name must be less than 100 characters')
  }

  if (!data.lastName || typeof data.lastName !== 'string' || data.lastName.trim().length === 0) {
    errors.push('Last name is required')
  } else if (data.lastName.length > 100) {
    errors.push('Last name must be less than 100 characters')
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email address')
  }

  const validSubjects = ['general', 'technical', 'billing', 'feature', 'bug', 'partnership']
  if (!data.subject || !validSubjects.includes(data.subject)) {
    errors.push('Invalid subject selection')
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters')
  } else if (data.message.length > 5000) {
    errors.push('Message must be less than 5000 characters')
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    data: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      subject: data.subject,
      message: data.message.trim(),
      newsletter: Boolean(data.newsletter),
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    
    // Validate data
    const validation = validateContactForm(body)
    
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error',
          errors: validation.errors
        },
        { status: 400 }
      )
    }

    // Send email
    await sendContactEmail(validation.data!)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Your message has been sent successfully. We\'ll get back to you soon!' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form submission error:', error)

    // Handle email sending errors
    if (error instanceof Error && error.message.includes('SMTP')) {
      console.error('SMTP Error:', error)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unable to send email. Please try again later or contact us directly at support@theqrcode.io.' 
        },
        { status: 500 }
      )
    }

    // Generic error
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while sending your message. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

// OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

