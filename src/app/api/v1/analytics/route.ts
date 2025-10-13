import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth, createApiResponse, createErrorResponse, recordApiUsage } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/v1/analytics
 * Get analytics data for the authenticated user
 */
async function getAnalytics(req: NextRequest, auth: any): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(req.url)
    const qrCodeId = searchParams.get('qrCodeId')
    const timeRange = searchParams.get('timeRange') || '30d' // 1h, 1d, 7d, 30d, 90d, 1y
    const includeScans = searchParams.get('includeScans') === 'true'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case '1h':
        startDate.setHours(now.getHours() - 1)
        break
      case '1d':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Build where clause
    const whereClause: any = {
      userId: auth.userId,
      isDeleted: false, // Exclude soft-deleted QR codes
      scans: {
        some: {
          scannedAt: {
            gte: startDate
          }
        }
      }
    }

    if (qrCodeId) {
      whereClause.id = qrCodeId
    }

    // Get QR codes with scan data
    const qrCodes = await prisma.qrCode.findMany({
      where: whereClause,
      include: {
        scans: {
          where: {
            scannedAt: {
              gte: startDate
            }
          },
          orderBy: {
            scannedAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate analytics
    const totalScans = qrCodes.reduce((sum, qr) => sum + (qr.scans?.length || 0), 0)
    
    // Device breakdown
    const deviceBreakdown = qrCodes.reduce((acc, qr) => {
      qr.scans?.forEach(scan => {
        const device = scan.device || 'unknown'
        acc[device] = (acc[device] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    // Country breakdown
    const countryBreakdown = qrCodes.reduce((acc, qr) => {
      qr.scans?.forEach(scan => {
        const country = scan.country || 'Unknown'
        acc[country] = (acc[country] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    // Browser breakdown
    const browserBreakdown = qrCodes.reduce((acc, qr) => {
      qr.scans?.forEach(scan => {
        const browser = scan.browser || 'unknown'
        acc[browser] = (acc[browser] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    // OS breakdown
    const osBreakdown = qrCodes.reduce((acc, qr) => {
      qr.scans?.forEach(scan => {
        const os = scan.os || 'unknown'
        acc[os] = (acc[os] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    // Hourly distribution
    const hourlyDistribution = qrCodes.reduce((acc, qr) => {
      qr.scans?.forEach(scan => {
        const hour = scan.scannedAt.getHours()
        acc[hour] = (acc[hour] || 0) + 1
      })
      return acc
    }, {} as Record<number, number>)

    // Weekly distribution
    const weeklyDistribution = qrCodes.reduce((acc, qr) => {
      qr.scans?.forEach(scan => {
        const dayOfWeek = scan.scannedAt.getDay()
        acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1
      })
      return acc
    }, {} as Record<number, number>)

    // Daily scan counts for the time range
    const dailyScans = qrCodes.reduce((acc, qr) => {
      qr.scans?.forEach(scan => {
        const date = scan.scannedAt.toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    // Unique visitors estimation
    const uniqueVisitors = new Set(qrCodes.flatMap(qr => qr.scans?.map(scan => 
      `${scan.country || 'Unknown'}-${scan.device || 'Unknown'}-${scan.browser || 'Unknown'}`
    ) || [])).size

    // Average scans per QR code
    const avgScansPerQR = qrCodes.length > 0 ? totalScans / qrCodes.length : 0

    // Most active day
    const mostActiveDay = Object.entries(dailyScans).reduce((max, [date, count]) => 
      count > max.count ? { date, count } : max, 
      { date: '', count: 0 }
    )

    // Convert to array and sort by date
    const dailyScansArray = Object.entries(dailyScans)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Top performing QR codes
    const topQRCodes = qrCodes
      .map(qr => ({
        id: qr.id,
        name: qr.name,
        type: qr.type,
        scanCount: qr.scans?.length || 0,
        isDynamic: qr.isDynamic
      }))
      .sort((a, b) => b.scanCount - a.scanCount)
      .slice(0, 10)

    const response = {
      summary: {
        totalScans,
        totalQRCodes: qrCodes.length,
        timeRange,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        uniqueVisitors,
        avgScansPerQR: Math.round(avgScansPerQR * 100) / 100,
        mostActiveDay: mostActiveDay.date
      },
      breakdowns: {
        devices: deviceBreakdown,
        countries: countryBreakdown,
        browsers: browserBreakdown,
        os: osBreakdown
      },
      distributions: {
        hourly: Object.entries(hourlyDistribution)
          .map(([hour, count]) => ({ hour: parseInt(hour), count }))
          .sort((a, b) => a.hour - b.hour),
        weekly: Object.entries(weeklyDistribution)
          .map(([day, count]) => ({ day: parseInt(day), count }))
          .sort((a, b) => a.day - b.day)
      },
      dailyScans: dailyScansArray,
      topQRCodes,
      qrCodes: qrCodes.map(qr => ({
        id: qr.id,
        name: qr.name,
        type: qr.type,
        isDynamic: qr.isDynamic,
        scanCount: qr.scans?.length || 0,
        lastScanned: qr.scans?.[0]?.scannedAt || null,
        recentScans: includeScans ? (qr.scans?.slice(0, 10).map(scan => ({
          id: scan.id,
          scannedAt: scan.scannedAt,
          device: scan.device,
          country: scan.country,
          browser: scan.browser,
          os: scan.os
        })) || []) : undefined
      }))
    }

    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 200, responseTime)

    return createApiResponse(response)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 500, responseTime)
    return createErrorResponse('Failed to fetch analytics', 500)
  }
}

// Export handler with authentication
export const GET = withApiAuth(getAnalytics, {
  requiredPermissions: ['analytics:read']
})
