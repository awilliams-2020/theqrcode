import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { recordHealthCheck } from '@/lib/uptime-tracker'

/**
 * Health check endpoint that:
 * 1. Checks database connectivity
 * 2. Checks system resources
 * 3. Records the result for uptime tracking
 */
export async function GET() {
  const startTime = Date.now()
  
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`
    
    // Check memory usage
    const memUsage = process.memoryUsage()
    const memUsageGB = memUsage.heapUsed / 1024 / 1024 / 1024
    
    const responseTime = Date.now() - startTime
    
    // Determine status based on health metrics
    let status: 'up' | 'down' | 'degraded' = 'up'
    
    // If response time is slow or memory is high, mark as degraded
    if (responseTime > 1000 || memUsageGB > 4) {
      status = 'degraded'
    }
    
    // Record health check in background (don't wait)
    recordHealthCheck(status, responseTime, 200).catch(err => {
      console.error('Failed to record health check:', err)
    })
    
    return NextResponse.json({
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: memUsageGB.toFixed(2) + ' GB',
        total: (memUsage.heapTotal / 1024 / 1024 / 1024).toFixed(2) + ' GB'
      },
      database: 'connected',
      responseTime: responseTime + 'ms'
    }, { status: 200 })
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Record failed health check
    recordHealthCheck('down', responseTime, 500, errorMessage).catch(err => {
      console.error('Failed to record health check:', err)
    })
    
    return NextResponse.json({
      status: 'down',
      timestamp: new Date().toISOString(),
      error: errorMessage,
      responseTime: responseTime + 'ms'
    }, { status: 500 })
  }
}

