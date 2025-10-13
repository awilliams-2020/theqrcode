// Global monitoring setup for capturing HTTP performance metrics
import { recordPerformanceMetric } from './monitoring'

// Track ongoing requests to calculate response times
const requestTimings = new Map<string, number>()

// Generate a unique request ID
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function setupGlobalMonitoring() {
  console.log('Setting up global monitoring...')
  
  // In a production environment, you might want to use:
  // - OpenTelemetry for distributed tracing
  // - Sentry for error tracking
  // - DataDog or New Relic for APM
  
  // For now, we'll use Next.js middleware and route-level monitoring
  console.log('Global monitoring setup complete')
}

// Helper function to be called at the start of API routes
export function startRequestTiming(requestId?: string): string {
  const id = requestId || generateRequestId()
  requestTimings.set(id, Date.now())
  return id
}

// Helper function to be called at the end of API routes
export function endRequestTiming(
  requestId: string,
  endpoint: string,
  method: string,
  statusCode: number,
  userAgent?: string,
  ip?: string
): number {
  const startTime = requestTimings.get(requestId)
  if (!startTime) {
    console.warn(`No start time found for request ${requestId}`)
    return 0
  }
  
  const responseTime = Date.now() - startTime
  requestTimings.delete(requestId)
  
  // Record the performance metric
  recordPerformanceMetric({
    endpoint,
    method,
    responseTime,
    statusCode,
    timestamp: new Date(),
    userAgent,
    ip
  })
  
  // Clean up old timings (older than 5 minutes)
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
  for (const [id, time] of requestTimings.entries()) {
    if (time < fiveMinutesAgo) {
      requestTimings.delete(id)
    }
  }
  
  return responseTime
}

// Wrapper for API route handlers that automatically tracks performance
export function withPerformanceTracking<T extends any[]>(
  handler: (...args: T) => Promise<Response>
): (...args: T) => Promise<Response> {
  return async (...args: T): Promise<Response> => {
    const request = args[0] as Request
    const requestId = startRequestTiming()
    
    try {
      const response = await handler(...args)
      
      // Extract request details
      const url = new URL(request.url)
      const endpoint = url.pathname
      const method = request.method
      
      endRequestTiming(
        requestId,
        endpoint,
        method,
        response.status,
        request.headers.get('user-agent') || undefined,
        extractIP(request)
      )
      
      return response
    } catch (error) {
      // Record error response
      const url = new URL(request.url)
      endRequestTiming(
        requestId,
        url.pathname,
        request.method,
        500,
        request.headers.get('user-agent') || undefined,
        extractIP(request)
      )
      throw error
    }
  }
}

function extractIP(request: Request): string {
  // Try to extract IP from various headers
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

