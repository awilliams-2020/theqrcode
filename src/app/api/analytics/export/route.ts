import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') as 'csv' | 'pdf'
    const timeRange = searchParams.get('timeRange') || '30d'
    const qrCodeId = searchParams.get('qrCodeId')

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

    if (format === 'csv') {
      return exportAsCSV(qrCodes, timeRange)
    } else if (format === 'pdf') {
      return exportAsPDF(qrCodes, timeRange)
    } else {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error exporting analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function exportAsCSV(qrCodes: any[], timeRange: string) {
  const headers = [
    'QR Code Name',
    'QR Code Type',
    'Scan Date',
    'Device',
    'Browser',
    'OS',
    'Country'
    // Privacy note: IP addresses, user agents, referrers, and city-level data excluded
  ]

  const csvData = qrCodes.flatMap(qr => 
    qr.scans.map((scan: any) => [
      qr.name,
      qr.type,
      scan.scannedAt.toISOString(),
      scan.device || 'Unknown',
      scan.browser || 'Unknown',
      scan.os || 'Unknown',
      scan.country || 'Unknown'
      // Privacy note: IP addresses and city-level data excluded for privacy compliance
    ])
  )

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map((field: any) => `"${field}"`).join(','))
  ].join('\n')

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv"`
    }
  })
}

async function exportAsPDF(qrCodes: any[], timeRange: string) {
  // For now, return a simple text-based report
  // In a real implementation, you'd use a PDF library like puppeteer or jsPDF
  const reportData = {
    title: `Analytics Report - ${timeRange}`,
    generatedAt: new Date().toISOString(),
    summary: {
      totalQRCodes: qrCodes.length,
      totalScans: qrCodes.reduce((sum, qr) => sum + qr.scans.length, 0)
    },
    qrCodes: qrCodes.map(qr => ({
      name: qr.name,
      type: qr.type,
      scanCount: qr.scans.length,
      lastScanned: qr.scans[0]?.scannedAt || null
    }))
  }

  const pdfContent = `
ANALYTICS REPORT
================
Period: ${timeRange}
Generated: ${reportData.generatedAt}

SUMMARY
-------
Total QR Codes: ${reportData.summary.totalQRCodes}
Total Scans: ${reportData.summary.totalScans}

QR CODE PERFORMANCE
-------------------
${reportData.qrCodes.map(qr => 
  `${qr.name} (${qr.type}): ${qr.scanCount} scans, Last: ${qr.lastScanned ? new Date(qr.lastScanned).toISOString() : 'Never'}`
).join('\n')}
  `

  return new NextResponse(pdfContent, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.pdf"`
    }
  })
}
