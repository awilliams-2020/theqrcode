import { NextRequest } from 'next/server'
import { prisma } from './prisma'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator: (req: NextRequest) => string // Function to generate rate limit key
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

export class RateLimiter {
  private static readonly DEFAULT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
  private static readonly CLEANUP_INTERVAL = 5 * 60 * 1000 // 5 minutes

  /**
   * Check if request is within rate limit
   */
  static async checkRateLimit(
    req: NextRequest,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const now = Date.now()
    const windowStart = now - config.windowMs
    const key = config.keyGenerator(req)

    try {
      // Get current usage for this key
      const usage = await prisma.apiUsage.findMany({
        where: {
          apiKeyId: key,
          createdAt: {
            gte: new Date(windowStart)
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      const currentUsage = usage.length
      const remaining = Math.max(0, config.maxRequests - currentUsage)
      const resetTime = now + config.windowMs

      if (currentUsage >= config.maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetTime,
          retryAfter: Math.ceil((usage[0]?.createdAt.getTime() + config.windowMs - now) / 1000)
        }
      }

      return {
        allowed: true,
        remaining,
        resetTime
      }
    } catch (error) {
      console.error('Rate limit check failed:', error)
      // Fail open - allow request if rate limiting fails
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetTime: now + config.windowMs
      }
    }
  }

  /**
   * Record API usage for rate limiting
   */
  static async recordUsage(
    apiKeyId: string,
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await prisma.apiUsage.create({
        data: {
          apiKeyId,
          endpoint,
          method,
          statusCode,
          responseTime,
          ipAddress,
          userAgent
        }
      })
    } catch (error) {
      console.error('Failed to record API usage:', error)
      // Don't throw - usage recording failure shouldn't break the API
    }
  }

  /**
   * Get rate limit status for an API key
   */
  static async getRateLimitStatus(apiKeyId: string): Promise<{
    current: number
    limit: number
    resetTime: number
    windowMs: number
  }> {
    const now = Date.now()
    const windowStart = now - this.DEFAULT_WINDOW_MS

    const usage = await prisma.apiUsage.count({
      where: {
        apiKeyId,
        createdAt: {
          gte: new Date(windowStart)
        }
      }
    })

    // Get the API key to determine the rate limit
    const apiKey = await prisma.apiKey.findUnique({
      where: { id: apiKeyId }
    })

    const limit = apiKey?.rateLimit || 1000

    return {
      current: usage,
      limit,
      resetTime: now + this.DEFAULT_WINDOW_MS,
      windowMs: this.DEFAULT_WINDOW_MS
    }
  }

  /**
   * Clean up old usage records
   */
  static async cleanup(): Promise<void> {
    const cutoffTime = new Date(Date.now() - (24 * 60 * 60 * 1000)) // 24 hours ago

    try {
      await prisma.apiUsage.deleteMany({
        where: {
          createdAt: {
            lt: cutoffTime
          }
        }
      })
    } catch (error) {
      console.error('Failed to cleanup old usage records:', error)
    }
  }

  /**
   * Get usage statistics for an API key
   */
  static async getUsageStats(
    apiKeyId: string,
    timeRange: '1h' | '24h' | '7d' | '30d' = '24h'
  ): Promise<{
    totalRequests: number
    successfulRequests: number
    failedRequests: number
    averageResponseTime: number
    topEndpoints: Array<{ endpoint: string; count: number }>
  }> {
    const now = new Date()
    let startTime: Date

    switch (timeRange) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
    }

    const usage = await prisma.apiUsage.findMany({
      where: {
        apiKeyId,
        createdAt: {
          gte: startTime
        }
      }
    })

    const totalRequests = usage.length
    const successfulRequests = usage.filter(u => u.statusCode >= 200 && u.statusCode < 300).length
    const failedRequests = totalRequests - successfulRequests
    const averageResponseTime = usage.length > 0 
      ? usage.reduce((sum, u) => sum + u.responseTime, 0) / usage.length 
      : 0

    // Top endpoints
    const endpointCounts = usage.reduce((acc, u) => {
      acc[u.endpoint] = (acc[u.endpoint] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topEndpoints = Object.entries(endpointCounts)
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime: Math.round(averageResponseTime),
      topEndpoints
    }
  }
}

// Start cleanup interval
if (typeof window === 'undefined') {
  setInterval(() => {
    RateLimiter.cleanup().catch(console.error)
  }, 60000) // 1 minute cleanup interval
}
