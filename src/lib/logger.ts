/**
 * Centralized logging utility for the application
 * Provides consistent log formatting with domain and category support
 */

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
export type LogCategory = 'BOT-DETECTION' | 'API' | 'AUTH' | 'QR-CODE' | 'ANALYTICS' | 'NOTIFICATION' | 'PAYMENT' | 'SYSTEM' | 'MATOMO' | 'ERROR'

interface LogContext {
  domain?: string
  userId?: string
  requestId?: string
  component?: string
  action?: string
  [key: string]: any
}

class Logger {
  private getDomainFromRequest(request?: Request): string | undefined {
    if (!request) return undefined
    
    try {
      const url = new URL(request.url)
      return url.hostname
    } catch {
      return undefined
    }
  }

  private formatLogMessage(
    level: LogLevel,
    category: LogCategory,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString()
    const domainTag = context?.domain ? `[${context.domain}]` : '[UNKNOWN-DOMAIN]'
    const categoryTag = `[${category}]`
    const levelTag = `[${level}]`
    
    let logMessage = `[${timestamp}] ${levelTag} ${categoryTag} ${domainTag} ${message}`
    
    // Add additional context if provided
    if (context) {
      const contextParts: string[] = []
      
      if (context.userId) contextParts.push(`user:${context.userId}`)
      if (context.requestId) contextParts.push(`req:${context.requestId}`)
      if (context.component) contextParts.push(`comp:${context.component}`)
      if (context.action) contextParts.push(`action:${context.action}`)
      
      // Add any other custom context
      Object.entries(context).forEach(([key, value]) => {
        if (!['domain', 'userId', 'requestId', 'component', 'action'].includes(key)) {
          contextParts.push(`${key}:${value}`)
        }
      })
      
      if (contextParts.length > 0) {
        logMessage += ` | ${contextParts.join(', ')}`
      }
    }
    
    return logMessage
  }

  private log(level: LogLevel, category: LogCategory, message: string, context?: LogContext): void {
    const logMessage = this.formatLogMessage(level, category, message, context)
    console.log(logMessage)
  }

  // Public logging methods
  info(category: LogCategory, message: string, context?: LogContext): void {
    this.log('INFO', category, message, context)
  }

  warn(category: LogCategory, message: string, context?: LogContext): void {
    this.log('WARN', category, message, context)
  }

  error(category: LogCategory, message: string, context?: LogContext): void {
    this.log('ERROR', category, message, context)
  }

  debug(category: LogCategory, message: string, context?: LogContext): void {
    this.log('DEBUG', category, message, context)
  }

  // Convenience methods for common use cases
  api(message: string, context?: LogContext): void {
    this.info('API', message, context)
  }

  auth(message: string, context?: LogContext): void {
    this.info('AUTH', message, context)
  }

  qrCode(message: string, context?: LogContext): void {
    this.info('QR-CODE', message, context)
  }

  analytics(message: string, context?: LogContext): void {
    this.info('ANALYTICS', message, context)
  }

  notification(message: string, context?: LogContext): void {
    this.info('NOTIFICATION', message, context)
  }

  payment(message: string, context?: LogContext): void {
    this.info('PAYMENT', message, context)
  }

  system(message: string, context?: LogContext): void {
    this.info('SYSTEM', message, context)
  }

  matomo(message: string, context?: LogContext): void {
    this.info('MATOMO', message, context)
  }

  botDetection(message: string, context?: LogContext): void {
    this.info('BOT-DETECTION', message, context)
  }

  // Error logging with automatic context extraction
  logError(error: Error | unknown, category: LogCategory, message: string, context?: LogContext): void {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const fullMessage = `${message}: ${errorMessage}`
    
    this.error(category, fullMessage, {
      ...context,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    })
  }

  // Request-based logging (extracts domain from request)
  logRequest(
    level: LogLevel,
    category: LogCategory,
    message: string,
    request: Request,
    additionalContext?: Omit<LogContext, 'domain'>
  ): void {
    const domain = this.getDomainFromRequest(request)
    this.log(level, category, message, { ...additionalContext, domain })
  }
}

// Export singleton instance
export const logger = new Logger()

// Export types for use in other files
export type { LogContext, LogCategory, LogLevel }
