import { NextRequest, NextResponse } from 'next/server'
import { dailyEngagementTasks } from '@/lib/engagement/cron-jobs'

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

    console.log('Running daily engagement tasks...')
    await dailyEngagementTasks()

    return NextResponse.json({
      success: true,
      message: 'Daily engagement tasks completed',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Daily cron job failed:', error)
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

