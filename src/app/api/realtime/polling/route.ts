import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    const userId = session.user.id

    // Get current time and calculate time ranges
    const now = new Date()
    
    // Today start (beginning of current day)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    // This hour = last 60 minutes (to match Advanced Analytics)
    const thisHourStart = new Date(now.getTime() - 60 * 60 * 1000)

    // Get user's QR codes with recent scans
    const qrCodes = await prisma.qrCode.findMany({
      where: { 
        userId,
        isDeleted: false // Exclude soft-deleted QR codes
      },
      include: {
        scans: {
          where: {
            scannedAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          },
          orderBy: {
            scannedAt: 'desc'
          },
          take: 100 // Limit for performance
        }
      }
    })

    // Calculate real-time metrics
    const allScans = qrCodes.flatMap(qr => qr.scans)
    
    // Total scans (all time)
    const totalScansResult = await prisma.scan.count({
      where: {
        qrCode: { 
          userId,
          isDeleted: false // Exclude scans from deleted QR codes
        }
      }
    })

    // Scans today
    const scansToday = await prisma.scan.count({
      where: {
        qrCode: { 
          userId,
          isDeleted: false // Exclude scans from deleted QR codes
        },
        scannedAt: { gte: todayStart }
      }
    })

    // Scans this hour
    const scansThisHour = await prisma.scan.count({
      where: {
        qrCode: { 
          userId,
          isDeleted: false // Exclude scans from deleted QR codes
        },
        scannedAt: { gte: thisHourStart }
      }
    })

    // Recent scans from last 24 hours (increased limit for better chart visualization)
    const recentScans = await prisma.scan.findMany({
      where: {
        qrCode: { 
          userId,
          isDeleted: false // Exclude scans from deleted QR codes
        },
        scannedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      include: {
        qrCode: {
          select: { name: true, type: true }
        }
      },
      orderBy: { scannedAt: 'desc' },
      take: 100 // Increased from 10 to 100 for better hourly distribution visualization
    })

    // Calculate top countries from recent scans
    const countryCounts = allScans.reduce((acc, scan) => {
      const country = scan.country || 'Unknown'
      acc[country] = (acc[country] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Calculate top devices from recent scans
    const deviceCounts = allScans.reduce((acc, scan) => {
      const device = scan.device || 'Unknown'
      acc[device] = (acc[device] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topDevices = Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Estimate unique visitors (privacy-compliant)
    const uniqueVisitors = new Set(
      allScans.map(scan => `${scan.country || 'Unknown'}-${scan.device || 'Unknown'}`)
    ).size

    // Return real-time data
    const realtimeData = {
      type: 'realtime_data',
      data: {
        totalScans: totalScansResult,
        scansToday,
        scansThisHour,
        uniqueVisitors,
        topCountries,
        topDevices,
        recentScans: recentScans.map(scan => ({
          id: scan.id,
          qrCodeName: scan.qrCode.name,
          qrCodeType: scan.qrCode.type,
          scannedAt: scan.scannedAt,
          device: scan.device || 'Unknown',
          country: scan.country || 'Unknown',
          city: scan.city || 'Unknown',
          browser: scan.browser || 'Unknown',
          os: scan.os || 'Unknown'
        }))
      },
      timestamp: new Date().toISOString()
    }

    return new Response(JSON.stringify(realtimeData), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': 'https://theqrcode.io',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Cache-Control'
      }
    })

  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}
