// Sentry has been removed - these functions are now no-ops to maintain compatibility

export function captureException(error: any, context?: Record<string, any>) {
  // No-op: Sentry has been removed
  if (process.env.NODE_ENV === 'development') {
    console.error('Error (Sentry disabled):', error, context)
  }
}

export function setUser(user: { id: string; email: string; plan?: string }) {
  // No-op: Sentry has been removed
}
