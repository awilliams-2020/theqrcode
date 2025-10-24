import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

/**
 * POST /api/webhook-test
 * TEST ENDPOINT ONLY - For webhook signature verification testing
 * This endpoint demonstrates how to verify webhook signatures
 * DO NOT USE IN PRODUCTION - This is for testing purposes only
 */
export async function POST(request: NextRequest) {
  try {
    // Get the raw body as text for signature verification
    const body = await request.text()
    
    // Get the signature from headers
    const signature = request.headers.get('x-webhook-signature')
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing x-webhook-signature header' },
        { status: 400 }
      )
    }

    // In a real implementation, you'd look up the webhook secret by some identifier
    // For testing purposes, we'll use a hardcoded secret
    const webhookSecret = process.env.WEBHOOK_TEST_SECRET || 'test-secret-key-123'

    // Verify the signature
    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    // Use constant-time comparison to prevent timing attacks
    if (!secureCompare(signature, expectedSignature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse the verified payload
    let eventData
    try {
      eventData = JSON.parse(body)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    // Process the webhook event
    return NextResponse.json({
      received: true,
      eventType: eventData.type,
      data: eventData.data,
      verified: true
    })

  } catch (error) {
    console.error('Webhook verification error:', error)
    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 500 }
    )
  }
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}
