import { NextRequest, NextResponse } from 'next/server'
import { recordPerformanceMetric, logError, logSecurityEvent } from './monitoring'

export function withMonitoring<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    const request = args[0] as NextRequest
    const startTime = Date.now()
    
    try {
      const response = await handler(...args)
      const responseTime = Date.now() - startTime
      
      // Record performance metric
      recordPerformanceMetric({
        endpoint: request.nextUrl.pathname,
        method: request.method,
        responseTime,
        statusCode: response.status,
        timestamp: new Date(),
        userAgent: request.headers.get('user-agent') || undefined,
        ip: getClientIP(request)
      })
      
      // Log security events for suspicious activity
      if (response.status === 429) {
        logSecurityEvent({
          type: 'rate_limit',
          ip: getClientIP(request),
          userAgent: request.headers.get('user-agent') || undefined,
          endpoint: request.nextUrl.pathname,
          severity: 'medium',
          details: {
            statusCode: response.status,
            responseTime
          }
        })
      }
      
      return response
    } catch (error) {
      const responseTime = Date.now() - startTime
      
      // Log the error
      logError({
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        endpoint: request.nextUrl.pathname,
        method: request.method,
        severity: 'high'
      })
      
      // Record failed performance metric
      recordPerformanceMetric({
        endpoint: request.nextUrl.pathname,
        method: request.method,
        responseTime,
        statusCode: 500,
        timestamp: new Date(),
        userAgent: request.headers.get('user-agent') || undefined,
        ip: getClientIP(request)
      })
      
      // Return error response
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

function getClientIP(request: NextRequest): string {
  // Try various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return 'unknown'
}

// Rate limiting with monitoring
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60 * 1000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = identifier
  const windowStart = Math.floor(now / windowMs) * windowMs
  
  const current = rateLimitMap.get(key)
  
  if (!current || current.resetTime < windowStart) {
    // New window or no existing data
    rateLimitMap.set(key, {
      count: 1,
      resetTime: windowStart + windowMs
    })
    
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: windowStart + windowMs
    }
  }
  
  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime
    }
  }
  
  current.count++
  rateLimitMap.set(key, current)
  
  return {
    allowed: true,
    remaining: limit - current.count,
    resetTime: current.resetTime
  }
}

// API key monitoring
export function monitorAPIKeyUsage(
  apiKey: string,
  endpoint: string,
  request: NextRequest
) {
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent')
  
  // Log API usage for analytics
  recordPerformanceMetric({
    endpoint: `/api/${endpoint}`,
    method: request.method,
    responseTime: 0, // Will be updated by withMonitoring
    statusCode: 200,
    timestamp: new Date(),
    userAgent: userAgent || undefined,
    ip
  })
  
  // Check for suspicious patterns
  // In a real implementation, you'd analyze usage patterns
  // and flag unusual activity
}
