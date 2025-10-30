import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from './lib/logger'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || 'unknown'
  const domain = hostname.split(':')[0] // Remove port if present
  
  // Check if this is an OAuth signin or callback request
  if (pathname.startsWith('/api/auth/signin/') || pathname.startsWith('/api/auth/callback/')) {
    logger.botDetection(`OAuth request detected: ${pathname}`, { domain })
    
    // Bot detection logic for OAuth
    const isBot = detectBot(request, domain)
    
    if (isBot) {
      logger.botDetection(`Bot detected and blocked: ${pathname}`, { domain, level: 'WARN' })
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    logger.botDetection(`Legitimate OAuth request allowed: ${pathname}`, { domain })
  }
  
  // Check for other protected routes that bots might try to access
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    logger.api(`API request detected: ${pathname}`, { domain })
    
    // Basic bot detection for API routes
    const isBot = detectBotForApi(request, domain)
    
    if (isBot) {
      logger.botDetection(`Bot detected and blocked on API: ${pathname}`, { domain, level: 'WARN' })
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }
  
  return NextResponse.next()
}

function detectBot(request: NextRequest, domain: string): boolean {
  try {
    // 1. Check for cookies - OAuth flows may not have Matomo cookies but should have some cookies
    const cookies = request.headers.get('cookie') || ''
    const hasMatomoCookies = cookies.includes('_pk_id') || cookies.includes('_pk_ses')
    const hasAnyCookies = cookies.trim() !== ''
    
    // For OAuth flows, we're more lenient about Matomo cookies but still check for any cookies
    if (!hasAnyCookies) {
      logger.botDetection('Bot detected: No cookies at all (completely fresh session)', { domain, level: 'WARN' })
      return true
    }
    
    // Log if no Matomo cookies but don't block (OAuth flows naturally don't have these)
    if (!hasMatomoCookies) {
      logger.botDetection('Warning: No Matomo cookies found (OAuth flow or incognito mode)', { domain })
    }
    
    // 2. Check for suspicious user agents
    const userAgent = request.headers.get('user-agent') || ''
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
      'python-requests', 'postman', 'insomnia', 'headless'
    ]
    
    if (botPatterns.some(pattern => userAgent.toLowerCase().includes(pattern))) {
      logger.botDetection(`Bot detected: Suspicious user agent - ${userAgent}`, { domain, level: 'WARN' })
      return true
    }
    
    // 2.5. Check for suspicious user agent patterns (more sophisticated)
    const suspiciousUserAgentPatterns = [
      /^Mozilla\/5\.0 \(X11; Linux x86_64\) AppleWebKit\/537\.36.*HeadlessChrome/, // Headless Chrome
      /^Mozilla\/5\.0 \(compatible; .*\)$/, // Generic compatible browsers
    ]
    
    if (suspiciousUserAgentPatterns.some(pattern => pattern.test(userAgent))) {
      logger.botDetection(`Bot detected: Suspicious user agent pattern - ${userAgent}`, { domain, level: 'WARN' })
      return true
    }
    
    // 3. Check for missing or suspicious headers that real browsers always send
    const acceptLanguage = request.headers.get('accept-language')
    const accept = request.headers.get('accept')
    const acceptEncoding = request.headers.get('accept-encoding')
    
    if (!acceptLanguage || !accept || !acceptEncoding) {
      logger.botDetection('Bot detected: Missing standard browser headers', { domain, level: 'WARN' })
      return true
    }
    
    // 3.5. Check for suspicious header combinations that indicate automation
    const referer = request.headers.get('referer')
    const origin = request.headers.get('origin')
    const secFetchDest = request.headers.get('sec-fetch-dest')
    const secFetchMode = request.headers.get('sec-fetch-mode')
    const secFetchSite = request.headers.get('sec-fetch-site')
    
    // Real browsers send specific header combinations for OAuth flows
    if (request.nextUrl.pathname.startsWith('/api/auth/signin/')) {
      // OAuth signin should have some security headers (but not all are required)
      if (!secFetchDest && !secFetchMode && !secFetchSite) {
        logger.botDetection('Bot detected: Missing all OAuth flow security headers (sec-fetch-*)', { domain, level: 'WARN' })
        return true
      }
      
      // OAuth signin should come from your domain (but allow empty referer for some cases)
      if (referer && !referer.includes(domain) && !referer.includes('theqrcode.io')) {
        logger.botDetection(`Bot detected: Suspicious referer for OAuth signin - ${referer}`, { domain, level: 'WARN' })
        return true
      }
    }
    
    if (request.nextUrl.pathname.startsWith('/api/auth/callback/')) {
      // OAuth callback should have some security headers (but not all are required)
      if (!secFetchDest && !secFetchMode && !secFetchSite) {
        logger.botDetection('Bot detected: Missing all OAuth callback security headers', { domain, level: 'WARN' })
        return true
      }
      
      // OAuth callback should come from OAuth provider or be empty (some browsers don't send referer)
      if (referer && !referer.includes('google.com') && !referer.includes('github.com') && !referer.includes(domain)) {
        logger.botDetection(`Bot detected: Suspicious referer for OAuth callback - ${referer}`, { domain, level: 'WARN' })
        return true
      }
    }
    
    // 4. Check for OAuth state parameter (only check on callback, not initial signin)
    const url = new URL(request.url)
    if (request.nextUrl.pathname.startsWith('/api/auth/callback/') && !url.searchParams.has('state')) {
      logger.botDetection('Bot detected: Missing OAuth state parameter on callback', { domain, level: 'WARN' })
      return true
    }
    
    // 5. Check for suspicious header combinations
    // Real browsers send specific header combinations
    // (secFetchDest, secFetchMode, secFetchSite already declared above)
    
    // Only flag as bot if they're missing ALL security headers (very suspicious)
    if (!secFetchDest && !secFetchMode && !secFetchSite) {
      logger.botDetection('Bot detected: Missing all security headers (sec-fetch-*)', { domain, level: 'WARN' })
      return true
    }
    
    // Log if some security headers are missing but don't block
    if (!secFetchDest || !secFetchMode || !secFetchSite) {
      logger.botDetection('Warning: Some security headers missing (browser might be older)', { domain })
    }
    
    // 5.5. Check for suspicious timing patterns (rapid requests)
    const now = Date.now()
    const requestTime = request.headers.get('x-request-time') ? parseInt(request.headers.get('x-request-time')!) : now
    
    // This would need to be implemented with a rate limiting mechanism
    // For now, just log the timing for analysis
    logger.botDetection(`Request timing - Current: ${now}, Request: ${requestTime}`, { domain })
    
    // 6. Check for suspicious IP patterns (if available)
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')
    
    // If we have IP info, we could add IP-based blocking here
    // For now, just log for monitoring
    if (forwarded || realIp || cfConnectingIp) {
      logger.botDetection(`Request IP info - Forwarded: ${forwarded}, Real: ${realIp}, CF: ${cfConnectingIp}`, { domain })
    }
    
    // If we get here, it's likely a legitimate user
    return false
    
  } catch (error) {
    logger.logError(error, 'BOT-DETECTION', 'Bot detection error', { domain })
    // If bot detection fails, err on the side of caution and block
    return true
  }
}

function detectBotForApi(request: NextRequest, domain: string): boolean {
  try {
    // Basic bot detection for API routes (less strict than OAuth)
    const userAgent = request.headers.get('user-agent') || ''
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
      'python-requests', 'postman', 'insomnia', 'headless'
    ]
    
    if (botPatterns.some(pattern => userAgent.toLowerCase().includes(pattern))) {
      logger.botDetection(`Bot detected on API: Suspicious user agent - ${userAgent}`, { domain, level: 'WARN' })
      return true
    }
    
    // Check for missing standard headers
    const acceptLanguage = request.headers.get('accept-language')
    const accept = request.headers.get('accept')
    
    if (!acceptLanguage || !accept) {
      logger.botDetection('Bot detected on API: Missing standard headers', { domain, level: 'WARN' })
      return true
    }
    
    return false
    
  } catch (error) {
    logger.logError(error, 'BOT-DETECTION', 'API bot detection error', { domain })
    return true
  }
}

export const config = {
  matcher: [
    // Match OAuth API routes
    '/api/auth/signin/:path*',
    '/api/auth/callback/:path*',
  ],
}