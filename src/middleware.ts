import { withAuth } from 'next-auth/middleware'
import { NextRequest } from 'next/server'

export default withAuth(
  function middleware(req: NextRequest) {
    // Middleware executed for protected routes
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow all - session validation handled by individual pages
        return true
      }
    },
  }
)

function getClientIP(request: NextRequest): string {
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

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/qr-codes/:path*',
    '/api/monitoring/:path*',
    '/api/health'
  ]
}
