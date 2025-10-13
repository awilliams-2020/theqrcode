// Sentry configuration for error tracking
// This is a free/low-cost monitoring solution

export function initSentry() {
  // Only initialize Sentry in production or when SENTRY_DSN is provided
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    try {
      const Sentry = require('@sentry/nextjs')
      
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 0.1, // 10% of transactions for performance monitoring
        profilesSampleRate: 0.1, // 10% of profiles for performance monitoring
        
        // Configure what gets sent to Sentry
        beforeSend(event: any, hint: any) {
          // Filter out certain errors in development
          if (process.env.NODE_ENV === 'development') {
            // Don't send console errors in development
            if (event.exception?.values?.[0]?.value?.includes('console.error')) {
              return null
            }
          }
          
          // Add custom tags
          event.tags = {
            ...event.tags,
            component: 'qr-analytics-saas',
            version: process.env.npm_package_version || '1.0.0'
          }
          
          return event
        },
        
        // Configure integrations
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
          new Sentry.Integrations.Prisma({ client: require('@prisma/client').PrismaClient })
        ]
      })
      
      console.log('Sentry initialized successfully')
      return Sentry
    } catch (error) {
      console.error('Failed to initialize Sentry:', error)
      return null
    }
  }
  
  // Return a mock Sentry object for development
  return {
    captureException: (error: any) => {
      console.error('Sentry mock - Error captured:', error)
    },
    captureMessage: (message: string, level: any = 'info') => {
      console.log(`Sentry mock - Message captured [${level}]:`, message)
    },
    addBreadcrumb: (breadcrumb: any) => {
      console.log('Sentry mock - Breadcrumb added:', breadcrumb)
    },
    setUser: (user: any) => {
      console.log('Sentry mock - User set:', user)
    },
    setTag: (key: string, value: string) => {
      console.log(`Sentry mock - Tag set: ${key} = ${value}`)
    },
    setContext: (key: string, context: any) => {
      console.log(`Sentry mock - Context set: ${key} =`, context)
    }
  }
}

// Initialize Sentry
export const Sentry = initSentry()

// Helper functions for error tracking
export function captureException(error: any, context?: any) {
  if (context) {
    Sentry.setContext('error_context', context)
  }
  Sentry.captureException(error)
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level)
}

export function setUser(user: { id: string; email: string; plan?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    plan: user.plan
  })
}

export function addBreadcrumb(message: string, category: string, data?: any) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info'
  })
}

// Performance monitoring
export function startTransaction(name: string, op: string) {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    return Sentry.startTransaction({ name, op })
  }
  return null
}

export function finishTransaction(transaction: any) {
  if (transaction) {
    transaction.finish()
  }
}
