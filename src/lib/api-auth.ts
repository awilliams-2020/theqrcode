import { NextRequest, NextResponse } from 'next/server'
import { ApiKeyManager } from './api-key-utils'
import { RateLimiter } from './rate-limiter'

export interface ApiAuthResult {
  userId: string
  permissions: string[]
  rateLimit: number
  apiKeyId: string
}

export interface ApiAuthOptions {
  requiredPermissions?: string[]
  skipRateLimit?: boolean
}

/**
 * Extract API key from request headers
 */
function extractApiKey(req: NextRequest): string | null {
  // Check Authorization header (Bearer token)
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Check X-API-Key header
  const apiKeyHeader = req.headers.get('x-api-key')
  if (apiKeyHeader) {
    return apiKeyHeader
  }

  return null
}

/**
 * Authenticate API request and check permissions
 */
export async function authenticateApiRequest(
  req: NextRequest,
  options: ApiAuthOptions = {}
): Promise<{
  success: boolean
  data?: ApiAuthResult
  error?: string
  statusCode?: number
}> {
  try {
    // Extract API key
    const apiKey = extractApiKey(req)
    if (!apiKey) {
      return {
        success: false,
        error: 'API key required. Provide via Authorization header (Bearer token) or X-API-Key header.',
        statusCode: 401
      }
    }

    // Validate API key
    const keyData = await ApiKeyManager.validateApiKey(apiKey)
    if (!keyData) {
      return {
        success: false,
        error: 'Invalid or expired API key.',
        statusCode: 401
      }
    }

    // Check required permissions
    if (options.requiredPermissions) {
      const hasPermission = options.requiredPermissions.every(permission =>
        ApiKeyManager.hasPermission(keyData.permissions, permission)
      )

      if (!hasPermission) {
        return {
          success: false,
          error: 'Insufficient permissions for this operation.',
          statusCode: 403
        }
      }
    }

    // Check rate limiting (unless skipped)
    if (!options.skipRateLimit) {
      const rateLimitResult = await RateLimiter.checkRateLimit(req, {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: keyData.rateLimit,
        keyGenerator: () => apiKey // Use API key as rate limit key
      })

      if (!rateLimitResult.allowed) {
        return {
          success: false,
          error: `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.`,
          statusCode: 429
        }
      }
    }

    return {
      success: true,
      data: {
        userId: keyData.userId,
        permissions: keyData.permissions,
        rateLimit: keyData.rateLimit,
        apiKeyId: apiKey // We'll need to get the actual ID from the database
      }
    }
  } catch (error) {
    console.error('API authentication error:', error)
    return {
      success: false,
      error: 'Internal server error during authentication.',
      statusCode: 500
    }
  }
}

/**
 * Middleware wrapper for API authentication
 */
export function withApiAuth(
  handler: (req: NextRequest, auth: ApiAuthResult, params?: any) => Promise<NextResponse>,
  options: ApiAuthOptions = {}
) {
  return async (req: NextRequest, context?: { params?: any }): Promise<NextResponse> => {
    const authResult = await authenticateApiRequest(req, options)
    
    if (!authResult.success) {
      return NextResponse.json(
        { 
          error: authResult.error,
          code: 'AUTH_ERROR'
        },
        { status: authResult.statusCode || 401 }
      )
    }

    try {
      return await handler(req, authResult.data!, context?.params)
    } catch (error) {
      console.error('API handler error:', error)
      return NextResponse.json(
        { 
          error: 'Internal server error',
          code: 'HANDLER_ERROR'
        },
        { status: 500 }
      )
    }
  }
}

/**
 * Record API usage for analytics and rate limiting
 */
export async function recordApiUsage(
  req: NextRequest,
  auth: ApiAuthResult,
  statusCode: number,
  responseTime: number
): Promise<void> {
  try {
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = req.headers.get('user-agent')

    await RateLimiter.recordUsage(
      auth.apiKeyId,
      req.nextUrl.pathname,
      req.method,
      statusCode,
      responseTime,
      ipAddress || undefined,
      userAgent || undefined
    )
  } catch (error) {
    console.error('Failed to record API usage:', error)
    // Don't throw - usage recording failure shouldn't break the API
  }
}

/**
 * Create standardized API response
 */
export function createApiResponse(
  data: any,
  statusCode: number = 200,
  meta?: {
    rateLimit?: {
      remaining: number
      resetTime: number
    }
  }
): NextResponse {
  // Handle 204 No Content responses
  if (statusCode === 204) {
    const response = new NextResponse(null, { status: 204 })
    
    if (meta?.rateLimit) {
      response.headers.set('X-RateLimit-Remaining', meta.rateLimit.remaining.toString())
      response.headers.set('X-RateLimit-Reset', meta.rateLimit.resetTime.toString())
    }
    
    return response
  }
  
  const response = NextResponse.json(data, { status: statusCode })
  
  if (meta?.rateLimit) {
    response.headers.set('X-RateLimit-Remaining', meta.rateLimit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', meta.rateLimit.resetTime.toString())
  }

  return response
}

/**
 * Create error response
 */
export function createErrorResponse(
  error: string,
  statusCode: number = 400,
  code?: string
): NextResponse {
  return NextResponse.json(
    { 
      error,
      code: code || 'API_ERROR'
    },
    { status: statusCode }
  )
}
