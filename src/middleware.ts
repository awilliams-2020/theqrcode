import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from './lib/logger'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || 'unknown'
  const domain = hostname.split(':')[0] // Remove port if present
  
  // Check if this is an OAuth signin or callback request
  if (pathname.startsWith('/api/auth/signin/') || pathname.startsWith('/api/auth/callback/')) {
    // Bot detection logic for OAuth
    const isBot = detectBot(request, domain)
    
    if (isBot) {
      logger.warn('BOT-DETECTION', `Bot detected and blocked: ${pathname}`)
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }
  
  // Check for other protected routes that bots might try to access
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    logger.api(`API request detected: ${pathname}`)
    
    // Basic bot detection for API routes
    const isBot = detectBotForApi(request, domain)
    
    if (isBot) {
      logger.warn('BOT-DETECTION', `Bot detected and blocked on API: ${pathname}`)
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
      logger.warn('BOT-DETECTION', 'Bot detected: No cookies at all (completely fresh session)')
      return true
    }
    
    // No Matomo cookies is normal for OAuth flows, don't log
    
    // 2. Check for suspicious user agents
    const userAgent = request.headers.get('user-agent') || ''
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
      'python-requests', 'postman', 'insomnia', 'headless'
    ]
    
    if (botPatterns.some(pattern => userAgent.toLowerCase().includes(pattern))) {
      logger.warn('BOT-DETECTION', `Bot detected: Suspicious user agent - ${userAgent}`)
      return true
    }
    
    // 2.5. Check for suspicious user agent patterns (more sophisticated)
    const suspiciousUserAgentPatterns = [
      /^Mozilla\/5\.0 \(X11; Linux x86_64\) AppleWebKit\/537\.36.*HeadlessChrome/, // Headless Chrome
      /^Mozilla\/5\.0 \(compatible; .*\)$/, // Generic compatible browsers
    ]
    
    if (suspiciousUserAgentPatterns.some(pattern => pattern.test(userAgent))) {
      logger.warn('BOT-DETECTION', `Bot detected: Suspicious user agent pattern - ${userAgent}`)
      return true
    }
    
    // 3. Check for missing or suspicious headers that real browsers always send
    const acceptLanguage = request.headers.get('accept-language')
    const accept = request.headers.get('accept')
    const acceptEncoding = request.headers.get('accept-encoding')
    
    if (!acceptLanguage || !accept || !acceptEncoding) {
      logger.warn('BOT-DETECTION', 'Bot detected: Missing standard browser headers')
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
        logger.warn('BOT-DETECTION', 'Bot detected: Missing all OAuth flow security headers (sec-fetch-*)')
        return true
      }
      
      // OAuth signin should come from your domain (but allow empty referer for some cases)
      if (referer && !referer.includes(domain) && !referer.includes('theqrcode.io')) {
        logger.warn('BOT-DETECTION', `Bot detected: Suspicious referer for OAuth signin - ${referer}`)
        return true
      }
    }
    
    if (request.nextUrl.pathname.startsWith('/api/auth/callback/')) {
      // OAuth callback should have some security headers (but not all are required)
      if (!secFetchDest && !secFetchMode && !secFetchSite) {
        logger.warn('BOT-DETECTION', 'Bot detected: Missing all OAuth callback security headers')
        return true
      }
      
      // OAuth callback should come from OAuth provider or be empty (some browsers don't send referer)
      if (referer && !referer.includes('google.com') && !referer.includes('github.com') && !referer.includes(domain)) {
        logger.warn('BOT-DETECTION', `Bot detected: Suspicious referer for OAuth callback - ${referer}`)
        return true
      }
    }
    
    // 4. Check for OAuth state parameter (only check on callback, not initial signin)
    const url = new URL(request.url)
    if (request.nextUrl.pathname.startsWith('/api/auth/callback/') && !url.searchParams.has('state')) {
      logger.warn('BOT-DETECTION', 'Bot detected: Missing OAuth state parameter on callback')
      return true
    }
    
    // 5. Check for suspicious header combinations
    // Real browsers send specific header combinations
    // (secFetchDest, secFetchMode, secFetchSite already declared above)
    
    // Only flag as bot if they're missing ALL security headers (very suspicious)
    if (!secFetchDest && !secFetchMode && !secFetchSite) {
      logger.warn('BOT-DETECTION', 'Bot detected: Missing all security headers (sec-fetch-*)')
      return true
    }
    
    // Some security headers missing is normal for older browsers, don't log
    
    // 5.5. Check for suspicious timing patterns (rapid requests)
    // Timing analysis would need rate limiting mechanism - not logging for now
    
    // 6. Check for suspicious IP patterns (if available)
    // IP-based blocking could be added here - not logging for now
    
    // If we get here, it's likely a legitimate user
    return false
    
  } catch (error) {
    logger.logError(error, 'BOT-DETECTION', 'Bot detection error')
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
      logger.warn('BOT-DETECTION', `Bot detected on API: Suspicious user agent - ${userAgent}`)
      return true
    }
    
    // Check for missing standard headers
    const acceptLanguage = request.headers.get('accept-language')
    const accept = request.headers.get('accept')
    
    if (!acceptLanguage || !accept) {
      logger.warn('BOT-DETECTION', 'Bot detected on API: Missing standard headers')
      return true
    }
    
    return false
    
  } catch (error) {
    logger.logError(error, 'BOT-DETECTION', 'API bot detection error')
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