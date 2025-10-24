import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth, createApiResponse, createErrorResponse, recordApiUsage } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/v1/scans
 * List all scans for the authenticated user's QR codes
 * This endpoint is used by Zapier to poll for new scans
 */
async function getScans(req: NextRequest, auth: any): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 100)
    const qrCodeId = searchParams.get('qrCodeId') // Optional filter
    const since = searchParams.get('since') // Optional timestamp filter for Zapier polling

    // Build where clause
    const where: any = {
      qrCode: {
        userId: auth.userId,
        isDeleted: false
      }
    }

    if (qrCodeId) {
      where.qrCodeId = qrCodeId
    }

    // For Zapier polling - only get scans after a certain time
    if (since) {
      const sinceDate = new Date(since)
      if (!isNaN(sinceDate.getTime())) {
        where.scannedAt = {
          gt: sinceDate
        }
      }
    }

    const [scans, total] = await Promise.all([
      prisma.scan.findMany({
        where,
        include: {
          qrCode: {
            select: {
              id: true,
              name: true,
              type: true,
              shortUrl: true
            }
          }
        },
        orderBy: { scannedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.scan.count({ where })
    ])

    const response = {
      data: scans.map(scan => ({
        id: scan.id,
        qrCodeId: scan.qrCodeId,
        qrCodeName: scan.qrCode.name,
        qrCodeType: scan.qrCode.type,
        shortUrl: scan.qrCode.shortUrl,
        scannedAt: scan.scannedAt,
        device: scan.device,
        os: scan.os,
        browser: scan.browser,
        country: scan.country,
        city: scan.city,
        ip: scan.ipAddress || null,
        userAgent: scan.userAgent,
        latitude: null, // Not available in current schema
        longitude: null // Not available in current schema
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
    console.error('Error fetching scans:', error)
    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 500, responseTime)
    return createErrorResponse('Failed to fetch scans', 500)
  }
}

// Export handler with authentication
export const GET = withApiAuth(getScans, {
  requiredPermissions: ['analytics:read']
})

