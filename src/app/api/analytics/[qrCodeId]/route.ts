import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ qrCodeId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { qrCodeId } = await params

    // Check if user has access to advanced analytics
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    const hasAdvancedAccess = subscription?.plan === 'starter' || 
                             subscription?.plan === 'pro' || 
                             subscription?.plan === 'business' ||
                             subscription?.status === 'trialing'

    if (!hasAdvancedAccess) {
      return NextResponse.json({ error: 'Advanced analytics not available for your plan' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'

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

    // Get QR code with scan data
    const qrCode = await prisma.qrCode.findFirst({
      where: {
        id: qrCodeId,
        userId: session.user.id,
        isDeleted: false // Exclude soft-deleted QR codes
      },
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
      }
    })

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
    }

    // Calculate analytics for this QR code
    const totalScans = qrCode.scans.length
    
    // Device breakdown
    const deviceBreakdown = qrCode.scans.reduce((acc, scan) => {
      const device = scan.device || 'unknown'
      acc[device] = (acc[device] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Country breakdown
    const countryBreakdown = qrCode.scans.reduce((acc, scan) => {
      const country = scan.country || 'Unknown'
      acc[country] = (acc[country] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Browser breakdown
    const browserBreakdown = qrCode.scans.reduce((acc, scan) => {
      const browser = scan.browser || 'unknown'
      acc[browser] = (acc[browser] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // OS breakdown
    const osBreakdown = qrCode.scans.reduce((acc, scan) => {
      const os = scan.os || 'unknown'
      acc[os] = (acc[os] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Daily scan counts
    const dailyScans = qrCode.scans.reduce((acc, scan) => {
      const date = scan.scannedAt.toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Convert to array and sort by date
    const dailyScansArray = Object.entries(dailyScans)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Hourly scan distribution (stored in UTC for client-side timezone conversion)
    const hourlyScans = qrCode.scans.reduce((acc, scan) => {
      const hour = scan.scannedAt.getUTCHours()
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    // Convert to array with all 24 hours
    const hourlyScansArray = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: hourlyScans[hour] || 0
    }))

    // Recent scans (last 20) - privacy compliant
    const recentScans = qrCode.scans.slice(0, 20).map(scan => ({
      id: scan.id,
      scannedAt: scan.scannedAt,
      device: scan.device,
      os: scan.os,
      browser: scan.browser,
      country: scan.country
      // Privacy note: IP addresses, user agents, referrers, and city-level data excluded
    }))

    return NextResponse.json({
      qrCode: {
        id: qrCode.id,
        name: qrCode.name,
        type: qrCode.type,
        isDynamic: qrCode.isDynamic,
        shortUrl: qrCode.shortUrl,
        createdAt: qrCode.createdAt
      },
      summary: {
        totalScans,
        timeRange,
        startDate: startDate.toISOString(),
        endDate: now.toISOString()
      },
      breakdowns: {
        devices: deviceBreakdown,
        countries: countryBreakdown,
        browsers: browserBreakdown,
        operatingSystems: osBreakdown
      },
      charts: {
        dailyScans: dailyScansArray,
        hourlyScans: hourlyScansArray
      },
      recentScans
    })
  } catch (error) {
    console.error('Error fetching QR code analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
