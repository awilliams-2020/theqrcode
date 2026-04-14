import { NextRequest, NextResponse } from 'next/server'
import { dailyEngagementTasks } from '@/lib/engagement/cron-jobs'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// Daily cron job - runs at 9:00 AM
// Handles: trial ending reminders, scheduled campaigns, notification cleanup
export async function GET(req: NextRequest) {
  try {
    // Verify the request is from Vercel Cron or authorized source
    const authHeader = req.headers.get('authorization')
    
    // Check Vercel Cron secret or internal secret
    if (process.env.CRON_SECRET) {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    logger.info('CRON-JOBS', 'Running daily engagement tasks')
    await dailyEngagementTasks()

    return NextResponse.json({
      success: true,
      message: 'Daily engagement tasks completed',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.logError(error as Error, 'CRON-JOBS', 'Daily cron job failed')
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

