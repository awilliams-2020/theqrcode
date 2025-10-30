import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Verify webhook signature using HMAC-SHA256
 * Uses constant-time comparison to prevent timing attacks
 */
function verifySignature(payload: string, signature: string, secret: string): boolean {
  if (!secret) {
    return false
  }

  // Generate expected signature
  const expectedSignature = createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  // Use constant-time comparison to prevent timing attacks
  if (signature.length !== expectedSignature.length) {
    return false
  }

  try {
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

/**
 * POST /api/webhook-test
 * Test endpoint for webhook signature verification
 */
export async function POST(request: NextRequest) {
  try {
    // Get the signature from headers
    const signature = request.headers.get('x-webhook-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing x-webhook-signature header' },
        { status: 400 }
      )
    }

    // Get the webhook secret from environment
    const secret = process.env.WEBHOOK_TEST_SECRET

    if (!secret) {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Get raw body as string for signature verification
    const payload = await request.text()

    if (!payload) {
      return NextResponse.json(
        { error: 'Empty payload' },
        { status: 400 }
      )
    }

    // Verify signature
    const isValid = verifySignature(payload, signature, secret)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse JSON payload
    let event
    try {
      event = JSON.parse(payload)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    // Validate event structure
    if (!event.type) {
      return NextResponse.json(
        { error: 'Missing event type' },
        { status: 400 }
      )
    }

    // Return success response
    return NextResponse.json({
      received: true,
      verified: true,
      eventType: event.type,
      data: event.data || {}
    }, { status: 200 })

  } catch (error) {
    console.error('Webhook test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
