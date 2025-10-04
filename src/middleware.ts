import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    console.log('Middleware check:', { pathname: req.nextUrl.pathname, hasToken: !!req.nextauth.token })
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log('Middleware authorized check:', { token: !!token, pathname: req.nextUrl.pathname })
        // For database sessions, the token might be null but session exists
        // Let the page handle the session check instead of middleware
        return true
      }
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/qr-codes/:path*'
  ]
}
