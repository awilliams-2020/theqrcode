import { NextRequest, NextResponse } from 'next/server'
import { QRCache } from '@/lib/qr-cache'
import { logger } from '@/lib/logger'
import { recordPerformanceMetric } from '@/lib/monitoring'
import { trackAPI } from '@/lib/matomo-tracking'

/**
 * GET /api/public/qr-codes/view/[shortCode]
 * Display QR code image from short code (for shareable URLs)
 * 
 * This endpoint allows AI assistants to provide users with a clickable URL
 * that displays the QR code image directly. Uses short codes to avoid URL length limits.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const startTime = Date.now()
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                    request.headers.get('x-real-ip') || 
                    request.headers.get('cf-connecting-ip') || 
                    'unknown'

  try {
    const { shortCode } = await params

    if (!shortCode) {
      const responseTime = Date.now() - startTime
      recordPerformanceMetric({
        endpoint: '/api/public/qr-codes/view',
        method: 'GET',
        responseTime,
        statusCode: 400,
        timestamp: new Date(),
        userAgent,
        ip: ipAddress
      })
      
      return NextResponse.json(
        { error: 'Missing short code' },
        { status: 400 }
      )
    }

    // Retrieve QR code from cache
    const cached = await QRCache.get(shortCode)

    if (!cached) {
      const responseTime = Date.now() - startTime
      recordPerformanceMetric({
        endpoint: '/api/public/qr-codes/view',
        method: 'GET',
        responseTime,
        statusCode: 404,
        timestamp: new Date(),
        userAgent,
        ip: ipAddress
      })

      trackAPI.request(
        '/api/public/qr-codes/view',
        'GET',
        undefined,
        {
          ip: ipAddress,
          userAgent,
          statusCode: 404,
          responseTime,
        }
      ).catch(err => logger.logError(err, 'PUBLIC-API', 'Failed to track view request in Matomo'))

      return NextResponse.json(
        { 
          error: 'QR code not found or expired',
          message: 'This QR code has expired (expires after 24 hours) or was not found.',
          hint: 'Generate a new QR code at https://theqrcode.io/api/public/qr-codes',
          apiEndpoint: 'https://theqrcode.io/api/public/qr-codes'
        },
        { 
          status: 404,
          headers: {
            'X-QR-Code-Expired': 'true',
            'X-Regenerate-At': 'https://theqrcode.io/api/public/qr-codes'
          }
        }
      )
    }

    // Decode base64 to get image buffer
    const imageBuffer = Buffer.from(cached.imageData, 'base64')
    const responseTime = Date.now() - startTime

    // Record performance metric
    recordPerformanceMetric({
      endpoint: '/api/public/qr-codes/view',
      method: 'GET',
      responseTime,
      statusCode: 200,
      timestamp: new Date(),
      userAgent,
      ip: ipAddress
    })

    // Track in Matomo (async, don't block response)
    trackAPI.request(
      '/api/public/qr-codes/view',
      'GET',
      undefined,
      {
        ip: ipAddress,
        userAgent,
        statusCode: 200,
        responseTime,
      }
    ).catch(err => logger.logError(err, 'PUBLIC-API', 'Failed to track view request in Matomo'))

    // Return image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours (matches TTL)
        'X-Content-Type-Options': 'nosniff',
        'X-QR-Type': cached.type,
        'X-QR-Content': cached.content.substring(0, 100) // Truncate for header
      }
    })
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    recordPerformanceMetric({
      endpoint: '/api/public/qr-codes/view',
      method: 'GET',
      responseTime,
      statusCode: 500,
      timestamp: new Date(),
      userAgent,
      ip: ipAddress
    })

    trackAPI.request(
      '/api/public/qr-codes/view',
      'GET',
      undefined,
      {
        ip: ipAddress,
        userAgent,
        statusCode: 500,
        responseTime,
      }
    ).catch(err => logger.logError(err, 'PUBLIC-API', 'Failed to track error in Matomo'))

    logger.logError(error, 'PUBLIC-API', 'Error displaying QR code image', {
      endpoint: '/api/public/qr-codes/view',
      method: 'GET'
    })

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to display QR code image'
      },
      { status: 500 }
    )
  }
}
