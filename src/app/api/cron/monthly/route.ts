import { NextRequest, NextResponse } from 'next/server'
import { monthlyEngagementTasks } from '@/lib/engagement/cron-jobs'

export const dynamic = 'force-dynamic'

// Monthly cron job - runs on the 1st at 10:00 AM
// Handles: monthly usage insights for all active users
export async function GET(req: NextRequest) {
  try {
    // Verify the request is from Vercel Cron or authorized source
    const authHeader = req.headers.get('authorization')
    
    if (process.env.CRON_SECRET) {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    console.log('Running monthly engagement tasks...')
    await monthlyEngagementTasks()

    return NextResponse.json({
      success: true,
      message: 'Monthly engagement tasks completed',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Monthly cron job failed:', error)
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

