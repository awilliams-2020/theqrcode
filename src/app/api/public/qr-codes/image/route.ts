import { NextRequest, NextResponse } from 'next/server'
import { QRGeneratorServer } from '@/lib/qr-generator-server'
import { PublicRateLimiter } from '@/lib/public-rate-limiter'
import { QRCache } from '@/lib/qr-cache'
import { logger } from '@/lib/logger'

/**
 * Extract IP address from request
 */
function extractIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIP) return realIP
  if (cfConnectingIP) return cfConnectingIP
  return 'unknown'
}

/**
 * POST /api/public/qr-codes/image
 * Generate QR code and return a public URL to the image (for AI assistants)
 * 
 * This endpoint creates a shareable URL that AI assistants can provide to users
 * instead of trying to render the data URL directly.
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ipAddress = extractIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  try {
    // Check rate limit (100 requests per hour per IP)
    const rateLimitResult = PublicRateLimiter.checkRateLimit(ipAddress, 100, 60 * 60 * 1000)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again in ${rateLimitResult.retryAfter} seconds.`,
          retryAfter: rateLimitResult.retryAfter
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': rateLimitResult.retryAfter?.toString() || '3600'
          }
        }
      )
    }

    // Parse request body
    const body = await request.json()
    const { type, content, settings } = body

    // Validate required fields
    if (!type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'type and content are required' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['url', 'wifi', 'contact', 'text', 'email']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type', message: `type must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Generate QR code
    const frameSettings = settings?.frame || { style: 'square', color: '#000000', size: 20 }
    if (!frameSettings.size) {
      frameSettings.size = 20
    }

    const qrImage = await QRGeneratorServer.generateQRCode({
      type,
      content,
      size: settings?.size || 256,
      color: settings?.color || { dark: '#000000', light: '#FFFFFF' },
      frame: frameSettings,
      logo: (settings?.logo as any)?.enabled ? {
        dataUrl: (settings.logo as any).dataUrl,
        size: (settings.logo as any).size
      } : undefined
    })

    // Create shareable image URL using short code (avoids URL length issues)
    const base64Data = qrImage.split(',')[1]
    const shortCode = await QRCache.store(base64Data, type, content)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'
    const imageUrl = `${baseUrl}/api/public/qr-codes/view/${shortCode}`

    const responseTime = Date.now() - startTime
    logger.info('PUBLIC-API', 'QR code image URL generated via public API', {
      endpoint: '/api/public/qr-codes/image',
      ipAddress,
      type,
      userAgent,
      responseTime: `${responseTime}ms`,
      rateLimitRemaining: rateLimitResult.remaining
    })

    return NextResponse.json(
      {
        imageUrl,
        qrImage, // Also include data URL for direct use
        type,
        content,
        settings: settings || undefined,
        _meta: {
          apiVersion: '1.0.0',
          generatedAt: new Date().toISOString(),
          documentation: `${baseUrl}/api/public/qr-codes`
        }
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          'X-API-Version': '1.0.0',
          'X-AI-Assistant-Friendly': 'true'
        }
      }
    )
  } catch (error) {
    const responseTime = Date.now() - startTime
    logger.logError(error, 'PUBLIC-API', 'Error generating QR code image URL via public API', {
      endpoint: '/api/public/qr-codes/image',
      method: 'POST',
      ipAddress,
      userAgent,
      responseTime: `${responseTime}ms`
    })

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to generate QR code'
      },
      { status: 500 }
    )
  }
}
