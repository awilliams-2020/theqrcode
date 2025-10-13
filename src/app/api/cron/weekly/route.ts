import { NextRequest, NextResponse } from 'next/server'
import { weeklyEngagementTasks } from '@/lib/engagement/cron-jobs'

export const dynamic = 'force-dynamic'

// Weekly cron job - runs Monday at 10:00 AM
// Handles: re-engagement emails for inactive users
export async function GET(req: NextRequest) {
  try {
    // Verify the request is from Vercel Cron or authorized source
    const authHeader = req.headers.get('authorization')
    
    if (process.env.CRON_SECRET) {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    console.log('Running weekly engagement tasks...')
    await weeklyEngagementTasks()

    return NextResponse.json({
      success: true,
      message: 'Weekly engagement tasks completed',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Weekly cron job failed:', error)
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

