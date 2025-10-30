import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startRequestTiming, endRequestTiming } from '@/lib/monitoring-setup'

function extractIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIP) return realIP
  if (cfConnectingIP) return cfConnectingIP
  return 'unknown'
}

export async function GET(request: NextRequest) {
  const requestId = startRequestTiming()
  
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      endRequestTiming(requestId, request.nextUrl.pathname, request.method, 401,
        request.headers.get('user-agent') || undefined, extractIP(request))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to advanced analytics
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    const hasAdvancedAccess = subscription?.plan === 'starter' || 
                             subscription?.plan === 'pro' || 
                             subscription?.plan === 'business' ||
                             subscription?.status === 'trialing'

    if (!hasAdvancedAccess) {
      endRequestTiming(requestId, request.nextUrl.pathname, request.method, 403,
        request.headers.get('user-agent') || undefined, extractIP(request))
      return NextResponse.json({ error: 'Advanced analytics not available for your plan' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const qrCodeId = searchParams.get('qrCodeId')
    const timeRange = searchParams.get('timeRange') || '30d' // 1h, 1d, 7d, 30d, 90d, 1y

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    
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
      userId: session.user.id,
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
    
    // Unique visitors - based on unique IP addresses
    const uniqueVisitors = new Set(qrCodes.flatMap(qr => 
      qr.scans?.map(scan => scan.ipAddress).filter(Boolean) || []
    )).size
    
    // Calculate trending percentages based on timeRange
    const calculateTrendingData = () => {
      const currentPeriodScans = totalScans
      let previousPeriodScans = 0
      let comparisonPeriod = ''
      
      // Calculate previous period based on timeRange
      const previousStartDate = new Date()
      const previousEndDate = new Date()
      
      switch (timeRange) {
        case '1h':
          // Compare with previous hour
          previousStartDate.setHours(now.getHours() - 2)
          previousEndDate.setHours(now.getHours() - 1)
          comparisonPeriod = 'previous hour'
          break
        case '1d':
          // Compare with yesterday
          previousStartDate.setDate(now.getDate() - 2)
          previousEndDate.setDate(now.getDate() - 1)
          comparisonPeriod = 'yesterday'
          break
        case '7d':
          // Compare with previous 7 days
          previousStartDate.setDate(now.getDate() - 14)
          previousEndDate.setDate(now.getDate() - 7)
          comparisonPeriod = 'previous week'
          break
        case '30d':
          // Compare with previous 30 days
          previousStartDate.setDate(now.getDate() - 60)
          previousEndDate.setDate(now.getDate() - 30)
          comparisonPeriod = 'previous month'
          break
        case '90d':
          // Compare with previous 90 days
          previousStartDate.setDate(now.getDate() - 180)
          previousEndDate.setDate(now.getDate() - 90)
          comparisonPeriod = 'previous quarter'
          break
        case '1y':
          // Compare with previous year
          previousStartDate.setFullYear(now.getFullYear() - 2)
          previousEndDate.setFullYear(now.getFullYear() - 1)
          comparisonPeriod = 'previous year'
          break
        default:
          // Default to previous 30 days for 30d
          previousStartDate.setDate(now.getDate() - 60)
          previousEndDate.setDate(now.getDate() - 30)
          comparisonPeriod = 'previous month'
      }
      
      // Get scans from previous period
      const previousPeriodScansData = qrCodes.reduce((sum, qr) => {
        const previousScans = qr.scans?.filter(scan => 
          scan.scannedAt >= previousStartDate && scan.scannedAt < previousEndDate
        ) || []
        return sum + previousScans.length
      }, 0)
      
      // Calculate unique visitors for previous period (IP-based)
      const previousPeriodUniqueVisitors = new Set(qrCodes.flatMap(qr => {
        const previousScans = qr.scans?.filter(scan => 
          scan.scannedAt >= previousStartDate && scan.scannedAt < previousEndDate
        ) || []
        return previousScans.map(scan => scan.ipAddress).filter(Boolean)
      })).size
      
      // Calculate percentage changes
      const totalScansChange = previousPeriodScansData > 0 
        ? Math.round(((currentPeriodScans - previousPeriodScansData) / previousPeriodScansData) * 100)
        : currentPeriodScans > 0 ? 100 : 0
      
      const uniqueVisitorsChange = previousPeriodUniqueVisitors > 0
        ? Math.round(((uniqueVisitors - previousPeriodUniqueVisitors) / previousPeriodUniqueVisitors) * 100)
        : uniqueVisitors > 0 ? 100 : 0
      
      return {
        totalScansChange,
        uniqueVisitorsChange,
        comparisonPeriod,
        previousPeriodScans: previousPeriodScansData,
        previousPeriodUniqueVisitors
      }
    }
    
    const trendingData = calculateTrendingData()
    
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

    // City breakdown - using real city data from IP geolocation
    const cityBreakdown = qrCodes.reduce((acc, qr) => {
      qr.scans?.forEach(scan => {
        const city = scan.city || 'Unknown'
        acc[city] = (acc[city] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    // Hourly distribution (stored in UTC for client-side timezone conversion)
    const hourlyDistribution = qrCodes.reduce((acc, qr) => {
      qr.scans?.forEach(scan => {
        const hour = scan.scannedAt.getUTCHours()
        acc[hour] = (acc[hour] || 0) + 1
      })
      return acc
    }, {} as Record<number, number>)

    // Weekly distribution
    const weeklyDistribution = qrCodes.reduce((acc, qr) => {
      qr.scans?.forEach(scan => {
        const dayOfWeek = scan.scannedAt.getDay() // 0 = Sunday, 1 = Monday, etc.
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

    endRequestTiming(requestId, request.nextUrl.pathname, request.method, 200,
      request.headers.get('user-agent') || undefined, extractIP(request))

    return NextResponse.json({
      summary: {
        totalScans,
        totalQRCodes: qrCodes.length,
        timeRange,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        uniqueVisitors,
        avgScansPerQR: Math.round(avgScansPerQR * 100) / 100,
        mostActiveDay: mostActiveDay.date,
        trending: {
          totalScansChange: trendingData.totalScansChange,
          uniqueVisitorsChange: trendingData.uniqueVisitorsChange,
          comparisonPeriod: trendingData.comparisonPeriod,
          previousPeriodScans: trendingData.previousPeriodScans,
          previousPeriodUniqueVisitors: trendingData.previousPeriodUniqueVisitors
        }
      },
      breakdowns: {
        devices: deviceBreakdown,
        countries: countryBreakdown,
        browsers: browserBreakdown,
        os: osBreakdown,
        cities: cityBreakdown
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
        // Privacy note: Individual scan data excluded to prevent personal information exposure
        recentScans: qr.scans?.slice(0, 10).map(scan => ({
          id: scan.id,
          scannedAt: scan.scannedAt,
          device: scan.device,
          country: scan.country,
          browser: scan.browser,
          os: scan.os
          // Privacy note: IP addresses, user agents, referrers, and city-level data excluded
        })) || []
      }))
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    endRequestTiming(requestId, request.nextUrl.pathname, request.method, 500,
      request.headers.get('user-agent') || undefined, extractIP(request))
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
