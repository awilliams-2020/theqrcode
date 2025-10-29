import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Logging function - outputs to stdout which can be redirected to a file
function logToFile(message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO') {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] [${level}] [BOT-DETECTION] ${message}`
  console.log(logMessage)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if this is an OAuth signin or callback request
  if (pathname.startsWith('/api/auth/signin/') || pathname.startsWith('/api/auth/callback/')) {
    logToFile(`OAuth request detected: ${pathname}`)
    
    // Bot detection logic for OAuth
    const isBot = detectBot(request)
    
    if (isBot) {
      logToFile(`Bot detected and blocked: ${pathname}`, 'WARN')
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    logToFile(`Legitimate OAuth request allowed: ${pathname}`)
  }
  
  // Check for other protected routes that bots might try to access
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    logToFile(`API request detected: ${pathname}`)
    
    // Basic bot detection for API routes
    const isBot = detectBotForApi(request)
    
    if (isBot) {
      logToFile(`Bot detected and blocked on API: ${pathname}`, 'WARN')
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }
  
  return NextResponse.next()
}

function detectBot(request: NextRequest): boolean {
  try {
    // 1. Check for Matomo cookies (legitimate users will have these)
    // This is the most reliable indicator since bots bypass the frontend
    const cookies = request.headers.get('cookie') || ''
    const hasMatomoCookies = cookies.includes('_pk_id') || cookies.includes('_pk_ses')
    
    // Only flag as bot if they have NO cookies at all (completely fresh session)
    if (!cookies || cookies.trim() === '') {
      logToFile('Bot detected: No cookies at all (completely fresh session)', 'WARN')
      return true
    }
    
    // Log if no Matomo cookies but don't block (user might be in incognito or have disabled tracking)
    if (!hasMatomoCookies) {
      logToFile('Warning: No Matomo cookies found (user might be in incognito mode)', 'INFO')
    }
    
    // 2. Check for suspicious user agents
    const userAgent = request.headers.get('user-agent') || ''
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
      'python-requests', 'postman', 'insomnia', 'headless'
    ]
    
    if (botPatterns.some(pattern => userAgent.toLowerCase().includes(pattern))) {
      logToFile(`Bot detected: Suspicious user agent - ${userAgent}`, 'WARN')
      return true
    }
    
    // 3. Check for missing or suspicious headers that real browsers always send
    const acceptLanguage = request.headers.get('accept-language')
    const accept = request.headers.get('accept')
    const acceptEncoding = request.headers.get('accept-encoding')
    
    if (!acceptLanguage || !accept || !acceptEncoding) {
      logToFile('Bot detected: Missing standard browser headers', 'WARN')
      return true
    }
    
    // 4. Check for OAuth state parameter (only check on callback, not initial signin)
    const url = new URL(request.url)
    if (request.nextUrl.pathname.startsWith('/api/auth/callback/') && !url.searchParams.has('state')) {
      logToFile('Bot detected: Missing OAuth state parameter on callback', 'WARN')
      return true
    }
    
    // 5. Check for suspicious header combinations
    // Real browsers send specific header combinations
    const secFetchDest = request.headers.get('sec-fetch-dest')
    const secFetchMode = request.headers.get('sec-fetch-mode')
    const secFetchSite = request.headers.get('sec-fetch-site')
    
    // Only flag as bot if they're missing ALL security headers (very suspicious)
    if (!secFetchDest && !secFetchMode && !secFetchSite) {
      logToFile('Bot detected: Missing all security headers (sec-fetch-*)', 'WARN')
      return true
    }
    
    // Log if some security headers are missing but don't block
    if (!secFetchDest || !secFetchMode || !secFetchSite) {
      logToFile('Warning: Some security headers missing (browser might be older)', 'INFO')
    }
    
    // 6. Check for suspicious IP patterns (if available)
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')
    
    // If we have IP info, we could add IP-based blocking here
    // For now, just log for monitoring
    if (forwarded || realIp || cfConnectingIp) {
      logToFile(`Request IP info - Forwarded: ${forwarded}, Real: ${realIp}, CF: ${cfConnectingIp}`)
    }
    
    // If we get here, it's likely a legitimate user
    return false
    
  } catch (error) {
    logToFile(`Bot detection error: ${error}`, 'ERROR')
    // If bot detection fails, err on the side of caution and block
    return true
  }
}

function detectBotForApi(request: NextRequest): boolean {
  try {
    // Basic bot detection for API routes (less strict than OAuth)
    const userAgent = request.headers.get('user-agent') || ''
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
      'python-requests', 'postman', 'insomnia', 'headless'
    ]
    
    if (botPatterns.some(pattern => userAgent.toLowerCase().includes(pattern))) {
      logToFile(`Bot detected on API: Suspicious user agent - ${userAgent}`, 'WARN')
      return true
    }
    
    // Check for missing standard headers
    const acceptLanguage = request.headers.get('accept-language')
    const accept = request.headers.get('accept')
    
    if (!acceptLanguage || !accept) {
      logToFile('Bot detected on API: Missing standard headers', 'WARN')
      return true
    }
    
    return false
    
  } catch (error) {
    logToFile(`API bot detection error: ${error}`, 'ERROR')
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