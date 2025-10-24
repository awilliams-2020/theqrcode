import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth, createApiResponse, createErrorResponse, recordApiUsage } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { QRGeneratorServer } from '@/lib/qr-generator-server'
import { URLShortener } from '@/lib/url-shortener'

/**
 * GET /api/v1/qr-codes
 * List all QR codes for the authenticated user
 */
async function getQRCodes(req: NextRequest, auth: any): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // Max 100 per page
    const type = searchParams.get('type')
    const isDynamic = searchParams.get('isDynamic')

    const where: any = { 
      userId: auth.userId,
      isDeleted: false, // Exclude soft-deleted QR codes
      isSandbox: auth.environment === 'sandbox' // Filter by environment
    }
    
    if (type) {
      where.type = type
    }
    
    if (isDynamic !== null) {
      where.isDynamic = isDynamic === 'true'
    }

    const [qrCodes, total] = await Promise.all([
      prisma.qrCode.findMany({
        where,
        include: {
          scans: {
            select: {
              id: true,
              scannedAt: true,
              device: true,
              country: true
            },
            orderBy: { scannedAt: 'desc' },
            take: 5 // Only include recent scans
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.qrCode.count({ where })
    ])

    const response = {
      data: qrCodes.map(qr => ({
        id: qr.id,
        name: qr.name,
        type: qr.type,
        content: qr.content,
        shortUrl: qr.shortUrl,
        settings: qr.settings,
        isDynamic: qr.isDynamic,
        isSandbox: qr.isSandbox,
        scanCount: qr.scans.length,
        lastScanned: qr.scans[0]?.scannedAt || null,
        createdAt: qr.createdAt,
        updatedAt: qr.updatedAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }

    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 200, responseTime)

    return createApiResponse(response)
  } catch (error) {
    console.error('Error fetching QR codes:', error)
    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 500, responseTime)
    return createErrorResponse('Failed to fetch QR codes', 500)
  }
}

/**
 * POST /api/v1/qr-codes
 * Create a new QR code
 */
async function createQRCode(req: NextRequest, auth: any): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    const body = await req.json()
    const { name, type, content, settings, isDynamic } = body

    // Validate required fields
    if (!name || !type || !content) {
      const responseTime = Date.now() - startTime
      await recordApiUsage(req, auth, 400, responseTime)
      return createErrorResponse('Missing required fields: name, type, content', 400)
    }

    // Check user's plan limits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: auth.userId }
    })

    const planLimits = {
      free: { qrCodes: 10 },
      starter: { qrCodes: 100 },
      pro: { qrCodes: 500 },
      business: { qrCodes: -1 }
    }

    const currentPlan = subscription?.plan || 'free'
    const limits = planLimits[currentPlan as keyof typeof planLimits]

    if (limits.qrCodes !== -1 && auth.environment === 'production') {
      // Only check limits for production environment
      // Sandbox QR codes don't count towards plan limits
      const currentCount = await prisma.qrCode.count({
        where: { 
          userId: auth.userId,
          isDeleted: false,
          isSandbox: false // Only count production QR codes towards limits
        }
      })

      if (currentCount >= limits.qrCodes) {
        const responseTime = Date.now() - startTime
        await recordApiUsage(req, auth, 403, responseTime)
        return createErrorResponse('QR code limit reached for your plan', 403)
      }
    }

    // Create QR code
    const qrCode = await prisma.qrCode.create({
      data: {
        userId: auth.userId,
        name,
        type,
        content,
        shortUrl: null,
        settings: settings || {},
        isDynamic: isDynamic || false,
        isSandbox: auth.environment === 'sandbox'
      }
    })

    // Generate short URL for dynamic QR codes
    let shortUrl = null
    if (isDynamic) {
      shortUrl = await URLShortener.generateShortUrl(qrCode.id)
      await prisma.qrCode.update({
        where: { id: qrCode.id },
        data: { shortUrl }
      })
    }

    // Generate QR code image
    const qrContent = (isDynamic && shortUrl && type !== 'contact') ? shortUrl : content
    const frameSettings = settings?.frame || { style: 'square', color: '#000000', size: 20 }
    if (!frameSettings.size) {
      frameSettings.size = 20
    }

    const qrImage = await QRGeneratorServer.generateQRCode({
      type,
      content: qrContent,
      size: settings?.size || 256,
      color: settings?.color || { dark: '#000000', light: '#FFFFFF' },
      frame: frameSettings
    })

    const response = {
      id: qrCode.id,
      name: qrCode.name,
      type: qrCode.type,
      content: qrCode.content,
      shortUrl: qrCode.shortUrl,
      settings: qrCode.settings,
      isDynamic: qrCode.isDynamic,
      isSandbox: qrCode.isSandbox,
      qrImage,
      createdAt: qrCode.createdAt,
      updatedAt: qrCode.updatedAt
    }

    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 201, responseTime)

    return createApiResponse(response, 201)
  } catch (error) {
    console.error('Error creating QR code:', error)
    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 500, responseTime)
    return createErrorResponse('Failed to create QR code', 500)
  }
}

// Export handlers with authentication
export const GET = withApiAuth(getQRCodes, {
  requiredPermissions: ['qr:read']
})

export const POST = withApiAuth(createQRCode, {
  requiredPermissions: ['qr:write']
})
