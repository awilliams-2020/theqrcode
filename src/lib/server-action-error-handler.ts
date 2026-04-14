/**
 * Server Action Error Handler
 * Intercepts and logs Server Action errors with IP address and request context
 */

import { logger } from './logger'

interface ServerActionErrorContext {
  ipAddress?: string
  userAgent?: string
  actionId?: string
  pathname?: string
  errorMessage?: string
}

/**
 * Log Server Action error with enhanced context
 */
export function logServerActionError(
  error: Error | string,
  context: ServerActionErrorContext = {}
): void {
  const errorMessage = typeof error === 'string' ? error : error.message
  
  // Extract action ID from error message if not provided
  let actionId = context.actionId
  if (!actionId && errorMessage.includes('Server Action')) {
    const match = errorMessage.match(/Server Action "([^"]+)"/)
    actionId = match ? match[1] : 'unknown'
  }
  
  // Determine if this is a probing attempt (invalid action ID)
  const isProbing = actionId === 'x' || actionId === 'unknown' || !actionId || actionId.length < 8
  
  // Log the error with full context
  logger.error('SERVER-ACTION', `Server Action error: ${errorMessage}`, {
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    actionId: actionId || 'unknown',
    pathname: context.pathname,
    isProbing,
    error: errorMessage
  })
  
  // If this is a probing attempt, log additional warning
  if (isProbing && context.ipAddress) {
    logger.warn('SERVER-ACTION', 'Potential Server Action probing detected', {
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      actionId: actionId || 'unknown',
      pathname: context.pathname
    })
  }
}

/**
 * Check if an action ID looks suspicious (probing attempt)
 */
export function isSuspiciousActionId(actionId: string): boolean {
  // Very short action IDs are suspicious
  if (actionId.length < 8) return true
  
  // Single character action IDs are definitely probing
  if (actionId.length === 1) return true
  
  // Non-hexadecimal action IDs are suspicious (Next.js uses hex)
  if (!/^[0-9a-f]+$/i.test(actionId)) return true
  
  return false
}

