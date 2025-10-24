import * as Sentry from '@sentry/nextjs'

export function captureException(error: any, context?: Record<string, any>) {
  if (context) {
    Sentry.setContext('error_context', context)
  }
  Sentry.captureException(error)
}

export function setUser(user: { id: string; email: string; plan?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    plan: user.plan
  })
}

