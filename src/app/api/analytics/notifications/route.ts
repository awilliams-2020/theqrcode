import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  detectScanSpike,
  notifyDeviceTrend,
  sendHourlyAnalyticsSummary,
  sendDailyAnalyticsDigest,
  runAnalyticsChecks
} from '@/lib/engagement/analytics-notifications'

/**
 * GET /api/analytics/notifications
 * Trigger analytics checks and notifications for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { searchParams } = new URL(request.url)
    const checkType = searchParams.get('type') || 'all'

    const results: any = {}

    switch (checkType) {
      case 'spike':
        results.spikeDetection = await detectScanSpike(userId)
        break
      
      case 'trend':
        results.deviceTrend = await notifyDeviceTrend(userId)
        break
      
      case 'hourly':
        results.hourlySummary = await sendHourlyAnalyticsSummary(userId)
        break
      
      case 'daily':
        results.dailyDigest = await sendDailyAnalyticsDigest(userId)
        break
      
      case 'all':
      default:
        // Run all available checks
        const [spike, trend] = await Promise.all([
          detectScanSpike(userId),
          notifyDeviceTrend(userId)
        ])
        results.spikeDetection = spike
        results.deviceTrend = trend
        break
    }

    return NextResponse.json({
      success: true,
      results
    })
  } catch (error) {
    console.error('Error in analytics notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/analytics/notifications
 * Manually trigger specific analytics notifications
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await request.json()
    const { action, qrCodeId } = body

    let result: any = {}

    switch (action) {
      case 'check_spike':
        result = await detectScanSpike(userId, qrCodeId)
        break
      
      case 'check_trend':
        result = await notifyDeviceTrend(userId, qrCodeId)
        break
      
      case 'send_hourly_summary':
        result = await sendHourlyAnalyticsSummary(userId)
        break
      
      case 'send_daily_digest':
        result = await sendDailyAnalyticsDigest(userId)
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      result
    })
  } catch (error) {
    console.error('Error processing analytics notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

