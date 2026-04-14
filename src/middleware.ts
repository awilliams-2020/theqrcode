import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from './lib/logger'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Extract IP address from request
  const ipAddress = getClientIP(request)
  
  // Check for Server Action requests
  // Next.js Server Actions are POST requests with specific headers/content-type
  const contentType = request.headers.get('content-type') || ''
  const isServerAction = request.method === 'POST' && (
    pathname.startsWith('/_next/action') || 
    contentType.includes('text/plain') || // Server Actions use text/plain
    contentType.includes('application/x-www-form-urlencoded') || // Form submissions
    request.headers.get('next-action') !== null // Next.js Server Action header
  )
  
  if (isServerAction) {
    // Log Server Action request for monitoring
    logger.serverAction('Server Action request', {
      ipAddress,
      userAgent: request.headers.get('user-agent') || 'unknown',
      pathname,
    })
  }
  
  // Log API requests for monitoring
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    logger.api(`API request detected: ${pathname}`, {
      ipAddress,
      userAgent: request.headers.get('user-agent') || 'unknown'
    })
    
    if (pathname.startsWith('/api/cron/')) {
      const authHeader = request.headers.get('authorization')
      const hasValidAuth = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`
      
      logger.info('CRON-JOBS', `Cron job request: ${pathname}`, {
        ipAddress,
        userAgent: request.headers.get('user-agent') || 'unknown',
        authenticated: hasValidAuth || !process.env.CRON_SECRET ? 'yes' : 'no'
      })
    }
    
    if (pathname.startsWith('/api/public/')) {
      logger.info('PUBLIC-API', `Public API request: ${pathname}`, {
        ipAddress,
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    }
  }
  
  return NextResponse.next()
}

/**
 * Extract client IP address from request
 * Handles various proxy headers (X-Forwarded-For, X-Real-IP, etc.)
 */
function getClientIP(request: NextRequest): string {
  // Check X-Forwarded-For header (most common proxy header)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    const ips = forwardedFor.split(',').map(ip => ip.trim())
    if (ips.length > 0 && ips[0]) {
      return ips[0]
    }
  }
  
  // Check X-Real-IP header
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  // Check CF-Connecting-IP (Cloudflare)
  const cfIP = request.headers.get('cf-connecting-ip')
  if (cfIP) {
    return cfIP
  }
  
  // Fallback to request IP (may be proxy IP in production)
  return request.ip || 'unknown'
}

export const config = {
  matcher: [
    // Match OAuth API routes
    '/api/auth/signin/:path*',
    '/api/auth/callback/:path*',
    // Match Server Action routes
    '/_next/action/:path*',
    // Match all API routes for monitoring
    '/api/:path*',
  ],
}