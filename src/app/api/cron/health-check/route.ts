import { NextRequest, NextResponse } from 'next/server'
import { recordHealthCheck } from '@/lib/uptime-tracker'
import { prisma } from '@/lib/prisma'

/**
 * Internal cron endpoint for performing health checks
 * This should be called every 1-5 minutes by a cron service
 * 
 * To secure this endpoint, you can:
 * 1. Use Vercel Cron with authorization header
 * 2. Use a secret token in query params
 * 3. Call from external service like UptimeRobot
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  // Optional: Verify authorization
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || process.env.API_SECRET
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    // Perform comprehensive health checks
    const [dbCheck, memCheck] = await Promise.all([
      checkDatabaseHealth(),
      checkMemoryHealth()
    ])
    
    const responseTime = Date.now() - startTime
    const allHealthy = dbCheck.healthy && memCheck.healthy
    
    const status: 'up' | 'down' | 'degraded' = allHealthy 
      ? 'up' 
      : (dbCheck.healthy ? 'degraded' : 'down')
    
    // Determine appropriate HTTP status code
    const httpStatusCode = status === 'up' ? 200 : status === 'degraded' ? 206 : 503
    
    // Record health check
    await recordHealthCheck(
      status,
      responseTime,
      httpStatusCode,
      allHealthy ? undefined : `DB: ${dbCheck.message}, Memory: ${memCheck.message}`
    )
    
    return NextResponse.json({
      status,
      timestamp: new Date().toISOString(),
      checks: {
        database: dbCheck,
        memory: memCheck
      },
      responseTime: responseTime + 'ms'
    })
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    await recordHealthCheck('down', responseTime, 500, errorMessage)
    
    return NextResponse.json({
      status: 'down',
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

async function checkDatabaseHealth() {
  try {
    const start = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const duration = Date.now() - start
    
    return {
      healthy: duration < 1000,
      message: duration < 1000 ? 'OK' : 'Slow response',
      responseTime: duration
    }
  } catch (error) {
    return {
      healthy: false,
      message: error instanceof Error ? error.message : 'Connection failed',
      responseTime: -1
    }
  }
}

function checkMemoryHealth() {
  const memUsage = process.memoryUsage()
  const heapUsedGB = memUsage.heapUsed / 1024 / 1024 / 1024
  const heapTotalGB = memUsage.heapTotal / 1024 / 1024 / 1024
  const percentUsed = (heapUsedGB / heapTotalGB) * 100
  
  return {
    healthy: heapUsedGB < 4 && percentUsed < 95,
    message: heapUsedGB >= 4 
      ? `High memory usage: ${heapUsedGB.toFixed(2)}GB` 
      : percentUsed >= 95 
      ? `High memory percentage: ${percentUsed.toFixed(1)}%`
      : 'OK',
    heapUsed: heapUsedGB.toFixed(2) + 'GB',
    heapTotal: heapTotalGB.toFixed(2) + 'GB',
    percentUsed: percentUsed.toFixed(1) + '%'
  }
}

