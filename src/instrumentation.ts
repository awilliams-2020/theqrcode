/**
 * Next.js Instrumentation Hook
 * Runs once when the server starts
 * Used to set up global error handlers and monitoring
 */

import { logServerActionError } from './lib/server-action-error-handler'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Set up global error handler for Server Action errors
    const originalConsoleError = console.error

    console.error = (...args: any[]) => {
      // Check if this is a Server Action error
      const errorMessage = args[0]?.toString() || ''

      if (errorMessage.includes('Failed to find Server Action')) {
        // Extract action ID from error message
        const actionIdMatch = errorMessage.match(/Server Action "([^"]+)"/)
        const actionId = actionIdMatch ? actionIdMatch[1] : 'unknown'

        // Log with enhanced context
        // Note: IP address will be captured by middleware for actual requests
        // This is a fallback for errors that occur outside of middleware
        logServerActionError(errorMessage, {
          actionId,
          errorMessage
        })
      }

      // Call original console.error
      originalConsoleError.apply(console, args)
    }
  }
}
