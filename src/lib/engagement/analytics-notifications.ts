import { PrismaClient } from '@prisma/client'
import { createNotification } from './notifications'

const prisma = new PrismaClient()

// Helper function to get the appropriate action URL based on user's plan
async function getAnalyticsActionUrl(userId: string, qrCodeId?: string): Promise<string | undefined> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { plan: true }
  })
  
  const plan = subscription?.plan || 'free'
  const hasAnalyticsAccess = ['starter', 'pro', 'business'].includes(plan)
  
  // Free plan users don't get a redirect - just show the notification info
  if (!hasAnalyticsAccess) {
    return undefined
  }
  
  // Paid plan users go to analytics or specific QR code page
  return qrCodeId ? `/dashboard/qr-codes/${qrCodeId}` : '/analytics'
}

// Types for analytics events
export interface AnalyticsEvent {
  userId: string
  qrCodeId?: string
  qrCodeName?: string
  eventType: 'scan_spike' | 'new_location' | 'device_trend' | 'hourly_summary' | 'performance_alert'
  data: any
}

// ============================================
// Real-Time Analytics Notifications
// ============================================

/**
 * Detect and notify on scan spikes
 * Compares recent scan activity to historical averages
 */
export async function detectScanSpike(userId: string, qrCodeId?: string) {
  try {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get scans from last hour
    const recentScans = await prisma.scan.count({
      where: {
        qrCode: {
          userId,
          ...(qrCodeId ? { id: qrCodeId } : {})
        },
        scannedAt: { gte: oneHourAgo }
      }
    })

    // Get average hourly scans from last week
    const weeklyScans = await prisma.scan.count({
      where: {
        qrCode: {
          userId,
          ...(qrCodeId ? { id: qrCodeId } : {})
        },
        scannedAt: { gte: oneWeekAgo }
      }
    })

    const averageHourlyScans = weeklyScans / (7 * 24)

    // Detect spike: if recent scans are 3x or more than average (minimum 10 scans to avoid false positives)
    if (recentScans >= 10 && recentScans >= averageHourlyScans * 3) {
      const percentageIncrease = Math.round(((recentScans - averageHourlyScans) / averageHourlyScans) * 100)
      
      let qrCodeName = 'your QR codes'
      if (qrCodeId) {
        const qrCode = await prisma.qrCode.findUnique({
          where: { id: qrCodeId },
          select: { name: true }
        })
        qrCodeName = qrCode?.name || 'your QR code'
      }

      const actionUrl = await getAnalyticsActionUrl(userId, qrCodeId)
      
      await createNotification({
        userId,
        type: 'analytics_spike',
        title: '🚀 Traffic Spike Detected!',
        message: `${qrCodeName} received ${recentScans} scans in the last hour (${percentageIncrease}% above average). Great job!`,
        actionUrl,
        priority: 'high',
      })

      return { spikeDetected: true, recentScans, averageHourlyScans, percentageIncrease }
    }

    return { spikeDetected: false, recentScans, averageHourlyScans }
  } catch (error) {
    console.error('Error detecting scan spike:', error)
    return { spikeDetected: false, error }
  }
}

/**
 * Notify when QR code is scanned from a new country
 */
export async function notifyNewLocation(userId: string, qrCodeId: string, country: string, city: string) {
  try {
    // Check if this country has been seen before for this QR code
    const existingScansInCountry = await prisma.scan.count({
      where: {
        qrCodeId,
        country,
        scannedAt: {
          lt: new Date(Date.now() - 5 * 60 * 1000) // Exclude last 5 minutes to get "previous" scans
        }
      }
    })

    if (existingScansInCountry === 0) {
      // This is a new country!
      const qrCode = await prisma.qrCode.findUnique({
        where: { id: qrCodeId },
        select: { name: true }
      })

      // Count total unique countries for this QR code
      const uniqueCountries = await prisma.scan.groupBy({
        by: ['country'],
        where: {
          qrCodeId,
          country: { not: null }
        }
      })

      const countryCount = uniqueCountries.length

      const actionUrl = await getAnalyticsActionUrl(userId, qrCodeId)
      
      await createNotification({
        userId,
        type: 'analytics_location',
        title: '🌍 New Location Detected!',
        message: `${qrCode?.name || 'Your QR code'} was just scanned in ${city}, ${country}! That's country #${countryCount} for this QR code.`,
        actionUrl,
        priority: 'normal',
      })

      return { isNewLocation: true, countryCount }
    }

    return { isNewLocation: false }
  } catch (error) {
    console.error('Error checking new location:', error)
    return { isNewLocation: false, error }
  }
}

/**
 * Notify about interesting device trends
 */
export async function notifyDeviceTrend(userId: string, qrCodeId?: string) {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    // Get device distribution from last 24 hours
    const deviceScans = await prisma.scan.groupBy({
      by: ['device'],
      where: {
        qrCode: {
          userId,
          ...(qrCodeId ? { id: qrCodeId } : {})
        },
        scannedAt: { gte: oneDayAgo }
      },
      _count: true
    })

    const totalScans = deviceScans.reduce((sum, d) => sum + d._count, 0)
    
    if (totalScans >= 20) { // Minimum threshold for meaningful trends
      const mobileScans = deviceScans.find(d => d.device === 'mobile')?._count || 0
      const desktopScans = deviceScans.find(d => d.device === 'desktop')?._count || 0
      const tabletScans = deviceScans.find(d => d.device === 'tablet')?._count || 0

      const mobilePercentage = Math.round((mobileScans / totalScans) * 100)
      const desktopPercentage = Math.round((desktopScans / totalScans) * 100)
      const tabletPercentage = Math.round((tabletScans / totalScans) * 100)

      // Notify if there's a strong trend (>70% from one device type)
      let trendMessage = ''
      if (mobilePercentage >= 70) {
        trendMessage = `📱 ${mobilePercentage}% of your scans are from mobile devices! Your QR codes are perfect for on-the-go users.`
      } else if (desktopPercentage >= 70) {
        trendMessage = `💻 ${desktopPercentage}% of your scans are from desktop devices! Consider optimizing for larger screens.`
      } else if (tabletPercentage >= 30) {
        trendMessage = `📲 ${tabletPercentage}% of your scans are from tablets! You have a diverse audience.`
      }

      if (trendMessage) {
        const actionUrl = await getAnalyticsActionUrl(userId, qrCodeId)
        
        await createNotification({
          userId,
          type: 'analytics_trend',
          title: '📊 Device Trend Insight',
          message: trendMessage,
          actionUrl,
          priority: 'low',
        })

        return { 
          trendDetected: true, 
          distribution: { mobile: mobilePercentage, desktop: desktopPercentage, tablet: tabletPercentage }
        }
      }
    }

    return { trendDetected: false }
  } catch (error) {
    console.error('Error detecting device trend:', error)
    return { trendDetected: false, error }
  }
}

/**
 * Send hourly analytics summary for active periods
 */
export async function sendHourlyAnalyticsSummary(userId: string) {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    
    // Get scans from last hour
    const recentScans = await prisma.scan.findMany({
      where: {
        qrCode: { userId },
        scannedAt: { gte: oneHourAgo }
      },
      include: {
        qrCode: {
          select: { id: true, name: true }
        }
      }
    })

    if (recentScans.length >= 5) { // Only send if there's meaningful activity
      // Group by QR code
      const scansByQRCode = recentScans.reduce((acc, scan) => {
        const qrCodeId = scan.qrCode.id
        if (!acc[qrCodeId]) {
          acc[qrCodeId] = {
            name: scan.qrCode.name,
            count: 0,
            countries: new Set<string>()
          }
        }
        acc[qrCodeId].count++
        if (scan.country) {
          acc[qrCodeId].countries.add(scan.country)
        }
        return acc
      }, {} as Record<string, { name: string, count: number, countries: Set<string> }>)

      // Find top performing QR code
      const topQRCode = Object.entries(scansByQRCode).sort((a, b) => b[1].count - a[1].count)[0]
      
      const uniqueCountries = new Set(recentScans.map(s => s.country).filter(Boolean)).size

      const actionUrl = await getAnalyticsActionUrl(userId)
      
      await createNotification({
        userId,
        type: 'analytics_summary',
        title: '⏱️ Hourly Analytics Summary',
        message: `You received ${recentScans.length} scans in the last hour from ${uniqueCountries} ${uniqueCountries === 1 ? 'country' : 'countries'}. Top performer: ${topQRCode[1].name} (${topQRCode[1].count} scans)`,
        actionUrl,
        priority: 'normal',
      })

      return { sent: true, scanCount: recentScans.length }
    }

    return { sent: false, reason: 'Not enough activity' }
  } catch (error) {
    console.error('Error sending hourly summary:', error)
    return { sent: false, error }
  }
}

/**
 * Send daily analytics digest
 */
export async function sendDailyAnalyticsDigest(userId: string) {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)
    
    // Get today's scans
    const todayScans = await prisma.scan.count({
      where: {
        qrCode: { userId },
        scannedAt: { gte: oneDayAgo }
      }
    })

    // Get yesterday's scans for comparison
    const yesterdayScans = await prisma.scan.count({
      where: {
        qrCode: { userId },
        scannedAt: { gte: twoDaysAgo, lt: oneDayAgo }
      }
    })

    if (todayScans > 0) {
      const percentageChange = yesterdayScans > 0 
        ? Math.round(((todayScans - yesterdayScans) / yesterdayScans) * 100)
        : 100

      const trend = percentageChange > 0 ? '📈' : percentageChange < 0 ? '📉' : '➡️'
      const changeText = percentageChange !== 0 
        ? `${Math.abs(percentageChange)}% ${percentageChange > 0 ? 'increase' : 'decrease'} from yesterday`
        : 'Same as yesterday'

      // Get unique countries
      const uniqueCountries = await prisma.scan.groupBy({
        by: ['country'],
        where: {
          qrCode: { userId },
          scannedAt: { gte: oneDayAgo },
          country: { not: null }
        }
      })

      const actionUrl = await getAnalyticsActionUrl(userId)
      
      await createNotification({
        userId,
        type: 'analytics_summary',
        title: '📊 Daily Analytics Digest',
        message: `${trend} ${todayScans} scans today from ${uniqueCountries.length} ${uniqueCountries.length === 1 ? 'country' : 'countries'}. ${changeText}.`,
        actionUrl,
        priority: 'normal',
      })

      return { sent: true, todayScans, percentageChange }
    }

    return { sent: false, reason: 'No scans today' }
  } catch (error) {
    console.error('Error sending daily digest:', error)
    return { sent: false, error }
  }
}

/**
 * Notify on performance milestones (scans per hour/day records)
 */
export async function notifyPerformanceRecord(userId: string, qrCodeId: string, metric: 'hourly' | 'daily') {
  try {
    const qrCode = await prisma.qrCode.findUnique({
      where: { id: qrCodeId },
      select: { name: true, createdAt: true }
    })

    if (!qrCode) return { isRecord: false }

    const timeWindow = metric === 'hourly' 
      ? 60 * 60 * 1000 
      : 24 * 60 * 60 * 1000

    const now = Date.now()
    const windowStart = new Date(now - timeWindow)

    // Get current period scans
    const currentScans = await prisma.scan.count({
      where: {
        qrCodeId,
        scannedAt: { gte: windowStart }
      }
    })

    // Get historical maximum for this QR code
    const allScans = await prisma.scan.findMany({
      where: { qrCodeId },
      select: { scannedAt: true },
      orderBy: { scannedAt: 'asc' }
    })

    // Calculate historical max by sliding window
    let historicalMax = 0
    for (let i = 0; i < allScans.length; i++) {
      const windowEnd = new Date(allScans[i].scannedAt.getTime() + timeWindow)
      const windowScans = allScans.filter(
        s => s.scannedAt >= allScans[i].scannedAt && s.scannedAt <= windowEnd
      ).length
      historicalMax = Math.max(historicalMax, windowScans)
    }

    // Check if current is a new record
    if (currentScans > historicalMax && currentScans >= 10) {
      const timeLabel = metric === 'hourly' ? 'hour' : 'day'
      
      const actionUrl = await getAnalyticsActionUrl(userId, qrCodeId)
      
      await createNotification({
        userId,
        type: 'analytics_record',
        title: '🏆 New Performance Record!',
        message: `${qrCode.name} just hit a new record: ${currentScans} scans in the last ${timeLabel}! Your best performance yet.`,
        actionUrl,
        priority: 'high',
      })

      return { isRecord: true, currentScans, previousRecord: historicalMax }
    }

    return { isRecord: false, currentScans, historicalMax }
  } catch (error) {
    console.error('Error checking performance record:', error)
    return { isRecord: false, error }
  }
}

/**
 * Notify when approaching or exceeding scan velocity thresholds
 */
export async function notifyScanVelocity(userId: string) {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    
    // Get scans from last 5 minutes
    const recentScans = await prisma.scan.count({
      where: {
        qrCode: { userId },
        scannedAt: { gte: fiveMinutesAgo }
      }
    })

    // Thresholds for velocity notifications
    const velocityThresholds = [
      { scans: 50, message: '⚡ Incredible! 50+ scans in 5 minutes!' },
      { scans: 100, message: '🔥 Amazing! 100+ scans in 5 minutes!' },
      { scans: 200, message: '🚀 Phenomenal! 200+ scans in 5 minutes! You\'re trending!' }
    ]

    for (const threshold of velocityThresholds.reverse()) {
      if (recentScans >= threshold.scans) {
        // Check if we haven't sent this notification recently (avoid spam)
        const recentVelocityNotification = await prisma.notification.findFirst({
          where: {
            userId,
            type: 'usage_alert',
            title: { contains: 'scans in 5 minutes' },
            createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) } // Last 10 minutes
          }
        })

        if (!recentVelocityNotification) {
          const actionUrl = await getAnalyticsActionUrl(userId)
          
          await createNotification({
            userId,
            type: 'analytics_spike',
            title: '⚡ High-Speed Scanning Detected!',
            message: threshold.message,
            actionUrl,
            priority: 'urgent',
          })

          return { velocityAlert: true, scansPerFiveMinutes: recentScans }
        }
      }
    }

    return { velocityAlert: false, scansPerFiveMinutes: recentScans }
  } catch (error) {
    console.error('Error checking scan velocity:', error)
    return { velocityAlert: false, error }
  }
}

/**
 * Comprehensive analytics check - run this after each scan
 */
export async function runAnalyticsChecks(userId: string, qrCodeId: string, scanData: any) {
  const results = {
    spikeDetection: null as any,
    newLocation: null as any,
    velocity: null as any,
    performanceRecord: null as any,
  }

  try {
    // Run all checks in parallel for performance
    const [spikeResult, locationResult, velocityResult] = await Promise.all([
      detectScanSpike(userId, qrCodeId),
      scanData.country ? notifyNewLocation(userId, qrCodeId, scanData.country, scanData.city || 'Unknown') : Promise.resolve({ isNewLocation: false }),
      notifyScanVelocity(userId),
    ])

    results.spikeDetection = spikeResult
    results.newLocation = locationResult
    results.velocity = velocityResult

    // Check for hourly record (less frequent check)
    const hourlyRecordResult = await notifyPerformanceRecord(userId, qrCodeId, 'hourly')
    results.performanceRecord = hourlyRecordResult

    return results
  } catch (error) {
    console.error('Error running analytics checks:', error)
    return results
  }
}

/**
 * Background job to send periodic analytics summaries
 */
export async function sendPeriodicAnalyticsSummaries() {
  try {
    // Get all users who have had activity in the last 24 hours
    const activeScans = await prisma.scan.groupBy({
      by: ['qrCodeId'],
      where: {
        scannedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      },
      _count: true
    })

    const userIds = new Set<string>()
    
    for (const scan of activeScans) {
      const qrCode = await prisma.qrCode.findUnique({
        where: { id: scan.qrCodeId },
        select: { userId: true }
      })
      if (qrCode) {
        userIds.add(qrCode.userId)
      }
    }

    // Send daily digest to active users
    const userIdArray = Array.from(userIds)
    for (const userId of userIdArray) {
      await sendDailyAnalyticsDigest(userId)
      // Small delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return { success: true, userCount: userIdArray.length }
  } catch (error) {
    console.error('Error sending periodic summaries:', error)
    return { success: false, error }
  }
}

