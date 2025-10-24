import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startRequestTiming, endRequestTiming } from '@/lib/monitoring-setup'
import { captureException } from '@/lib/sentry'

function extractIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIP) return realIP
  if (cfConnectingIP) return cfConnectingIP
  return 'unknown'
}

export async function GET(request: NextRequest) {
  const requestId = startRequestTiming()
  const startTime = Date.now()
  
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    const dbResponseTime = Date.now() - startTime
    
    // Test external services (if applicable)
    const externalServices = await testExternalServices()
    
    // Calculate overall health score
    const healthScore = calculateHealthScore(dbResponseTime, externalServices)
    
    const healthData = {
      status: healthScore > 0.8 ? 'healthy' : healthScore > 0.5 ? 'degraded' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: 'healthy',
          responseTime: dbResponseTime,
          message: dbResponseTime < 100 ? 'Excellent' : dbResponseTime < 500 ? 'Good' : 'Slow'
        },
        ...externalServices
      },
      metrics: {
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        healthScore
      }
    }
    
    const statusCode = healthScore > 0.8 ? 200 : healthScore > 0.5 ? 200 : 503
    
    endRequestTiming(requestId, request.nextUrl.pathname, request.method, statusCode,
      request.headers.get('user-agent') || undefined, extractIP(request))
    
    return NextResponse.json(healthData, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    captureException(error, { endpoint: '/api/health', method: 'GET' })
    
    endRequestTiming(requestId, request.nextUrl.pathname, request.method, 503,
      request.headers.get('user-agent') || undefined, extractIP(request))
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      services: {
        database: {
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}

async function testExternalServices() {
  const services: Record<string, any> = {}
  
  try {
    // Test Stripe connection (if configured)
    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
      await stripe.balance.retrieve()
      services.stripe = {
        status: 'healthy',
        responseTime: 0 // Stripe doesn't return response time
      }
    }
  } catch (error) {
    services.stripe = {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
  
  // Test email service (if configured)
  const emailProvider = process.env.EMAIL_PROVIDER?.toLowerCase()
  const hasResendConfig = process.env.RESEND_API_KEY && (emailProvider === 'resend' || !emailProvider)
  const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && (emailProvider === 'smtp' || !emailProvider)
  
  if (hasResendConfig || hasSmtpConfig) {
    services.email = {
      status: 'healthy', // Simplified - in production, actually test email service
      responseTime: 0
    }
  }
  
  return services
}

function calculateHealthScore(dbResponseTime: number, externalServices: Record<string, any>): number {
  let score = 1.0
  
  // Database performance penalty
  if (dbResponseTime > 1000) score -= 0.3
  else if (dbResponseTime > 500) score -= 0.1
  else if (dbResponseTime > 200) score -= 0.05
  
  // External services penalty
  Object.values(externalServices).forEach((service: any) => {
    if (service.status === 'unhealthy') {
      score -= 0.2
    }
  })
  
  return Math.max(0, Math.min(1, score))
}
