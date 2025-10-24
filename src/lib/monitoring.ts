// Performance monitoring utilities
interface PerformanceMetric {
  endpoint: string
  method: string
  responseTime: number
  statusCode: number
  timestamp: Date
  userAgent?: string
  ip?: string
}

interface SystemStats {
  startTime: number
  totalRequests: number
  totalErrors: number
  lastHealthCheck: number
}

// In-memory storage for demo purposes
// In production, you'd want to use Redis or a proper database
const performanceMetrics: PerformanceMetric[] = []
const MAX_METRICS = 10000 // Keep only last 10k metrics

// System statistics tracking
const systemStats: SystemStats = {
  startTime: Date.now(),
  totalRequests: 0,
  totalErrors: 0,
  lastHealthCheck: Date.now()
}

export function recordPerformanceMetric(metric: PerformanceMetric) {
  performanceMetrics.push(metric)
  
  // Update system stats
  systemStats.totalRequests++
  if (metric.statusCode >= 400) {
    systemStats.totalErrors++
  }
  
  // Keep only recent metrics to prevent memory leaks
  if (performanceMetrics.length > MAX_METRICS) {
    performanceMetrics.splice(0, performanceMetrics.length - MAX_METRICS)
  }
}

// Downtime tracking
interface DowntimeEvent {
  start: Date
  end?: Date
  duration: number // in seconds
}

const downtimeEvents: DowntimeEvent[] = []

export function recordDowntime(start: Date, end?: Date) {
  const duration = end ? (end.getTime() - start.getTime()) / 1000 : 0
  downtimeEvents.push({ start, end, duration })
}

// Real system metrics functions
export function getRealUptime(): number {
  const totalRuntime = Date.now() - systemStats.startTime
  const totalDowntime = downtimeEvents.reduce((sum, event) => sum + event.duration, 0)
  
  // Calculate uptime percentage over the last 30 days or since system start
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
  const trackingPeriod = Math.min(totalRuntime, thirtyDaysMs)
  
  if (trackingPeriod === 0) return 100
  
  // Calculate uptime percentage
  const uptimePercentage = ((trackingPeriod - (totalDowntime * 1000)) / trackingPeriod) * 100
  return parseFloat(Math.max(0, Math.min(100, uptimePercentage)).toFixed(2))
}

export function getRealMemoryUsage(): number {
  const memUsage = process.memoryUsage()
  return parseFloat((memUsage.heapUsed / 1024 / 1024 / 1024).toFixed(2)) // Convert to GB
}

export function getSystemRuntime(): { 
  milliseconds: number
  seconds: number
  minutes: number
  hours: number
  days: number
  formatted: string
} {
  const uptimeMs = Date.now() - systemStats.startTime
  const seconds = Math.floor(uptimeMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  const remainingHours = hours % 24
  const remainingMinutes = minutes % 60
  const remainingSeconds = seconds % 60
  
  let formatted = ''
  if (days > 0) formatted += `${days}d `
  if (remainingHours > 0 || days > 0) formatted += `${remainingHours}h `
  if (remainingMinutes > 0 || hours > 0) formatted += `${remainingMinutes}m `
  formatted += `${remainingSeconds}s`
  
  return {
    milliseconds: uptimeMs,
    seconds,
    minutes,
    hours,
    days,
    formatted: formatted.trim()
  }
}

export function getRealErrorRate(timeRange?: { start: Date; end: Date }): number {
  const metrics = getPerformanceMetrics(timeRange)
  if (metrics.length === 0) return 0
  
  const errorCount = metrics.filter(metric => metric.statusCode >= 400).length
  return parseFloat((errorCount / metrics.length).toFixed(3))
}

export function getRealResponseTime(endpoint?: string, timeRange?: { start: Date; end: Date }): number {
  let metrics = getPerformanceMetrics(timeRange)
  
  if (endpoint) {
    metrics = metrics.filter(metric => metric.endpoint === endpoint)
  }
  
  if (metrics.length === 0) return 0
  
  const totalResponseTime = metrics.reduce((sum, metric) => sum + metric.responseTime, 0)
  return Math.round(totalResponseTime / metrics.length)
}

export function getRealApiRequests(timeRange?: { start: Date; end: Date }): number {
  const metrics = getPerformanceMetrics(timeRange)
  return metrics.length
}

export function getSystemStats(): SystemStats {
  return { ...systemStats }
}

export function getPerformanceMetrics(timeRange?: { start: Date; end: Date }) {
  if (!timeRange) {
    return performanceMetrics.slice(-1000) // Return last 1000 metrics
  }
  
  return performanceMetrics.filter(metric => 
    metric.timestamp >= timeRange.start && metric.timestamp <= timeRange.end
  )
}

export function getAverageResponseTime(endpoint?: string, timeRange?: { start: Date; end: Date }) {
  let metrics = getPerformanceMetrics(timeRange)
  
  if (endpoint) {
    metrics = metrics.filter(metric => metric.endpoint === endpoint)
  }
  
  if (metrics.length === 0) return 0
  
  const totalResponseTime = metrics.reduce((sum, metric) => sum + metric.responseTime, 0)
  return totalResponseTime / metrics.length
}

export function getErrorRate(endpoint?: string, timeRange?: { start: Date; end: Date }) {
  let metrics = getPerformanceMetrics(timeRange)
  
  if (endpoint) {
    metrics = metrics.filter(metric => metric.endpoint === endpoint)
  }
  
  if (metrics.length === 0) return 0
  
  const errorCount = metrics.filter(metric => metric.statusCode >= 400).length
  return errorCount / metrics.length
}

// Error tracking
interface ErrorLog {
  id: string
  message: string
  stack?: string
  endpoint: string
  method: string
  userId?: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
}

const errorLogs: ErrorLog[] = []
const MAX_ERRORS = 5000

export function logError(error: {
  message: string
  stack?: string
  endpoint: string
  method: string
  userId?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
}) {
  const errorLog: ErrorLog = {
    id: Math.random().toString(36).substr(2, 9),
    message: error.message,
    stack: error.stack,
    endpoint: error.endpoint,
    method: error.method,
    userId: error.userId,
    timestamp: new Date(),
    severity: error.severity || 'medium'
  }
  
  errorLogs.push(errorLog)
  
  // Keep only recent errors
  if (errorLogs.length > MAX_ERRORS) {
    errorLogs.splice(0, errorLogs.length - MAX_ERRORS)
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorLog)
  }
  
  // In production, you'd also send to Sentry or another error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(new Error(error.message))
  }
}

export function getErrorLogs(timeRange?: { start: Date; end: Date }) {
  if (!timeRange) {
    return errorLogs.slice(-100) // Return last 100 errors
  }
  
  return errorLogs.filter(error => 
    error.timestamp >= timeRange.start && error.timestamp <= timeRange.end
  )
}

export function getErrorRateByEndpoint(timeRange?: { start: Date; end: Date }) {
  const errors = getErrorLogs(timeRange)
  const errorCounts: Record<string, number> = {}
  
  errors.forEach(error => {
    errorCounts[error.endpoint] = (errorCounts[error.endpoint] || 0) + 1
  })
  
  return errorCounts
}

// Security monitoring
interface SecurityEvent {
  id: string
  type: 'failed_login' | 'rate_limit' | 'suspicious_activity' | 'api_abuse'
  ip: string
  userAgent?: string
  userId?: string
  endpoint: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  details: Record<string, any>
}

const securityEvents: SecurityEvent[] = []
const MAX_SECURITY_EVENTS = 2000

// Alert storage and management
interface PersistentAlert {
  id: string
  type: 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  resolved: boolean
  resolvedAt?: Date
  condition: string // What condition triggered this alert
  lastChecked: Date
}

const persistentAlerts: PersistentAlert[] = []
const MAX_ALERTS = 100

// Initialize with a system startup alert
const systemStartupAlert: PersistentAlert = {
  id: 'system-startup',
  type: 'info',
  title: 'System Monitoring Started',
  message: 'Real-time monitoring system has been initialized and is tracking system metrics',
  timestamp: new Date(),
  resolved: true,
  resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  condition: 'system_startup',
  lastChecked: new Date()
}

persistentAlerts.push(systemStartupAlert)

export function logSecurityEvent(event: {
  type: SecurityEvent['type']
  ip: string
  userAgent?: string
  userId?: string
  endpoint: string
  severity?: SecurityEvent['severity']
  details?: Record<string, any>
}) {
  const securityEvent: SecurityEvent = {
    id: Math.random().toString(36).substr(2, 9),
    type: event.type,
    ip: event.ip,
    userAgent: event.userAgent,
    userId: event.userId,
    endpoint: event.endpoint,
    timestamp: new Date(),
    severity: event.severity || 'medium',
    details: event.details || {}
  }
  
  securityEvents.push(securityEvent)
  
  // Keep only recent events
  if (securityEvents.length > MAX_SECURITY_EVENTS) {
    securityEvents.splice(0, securityEvents.length - MAX_SECURITY_EVENTS)
  }
  
  // Log critical security events
  if (securityEvent.severity === 'critical') {
    console.error('CRITICAL SECURITY EVENT:', securityEvent)
  }
}

export function getSecurityEvents(timeRange?: { start: Date; end: Date }) {
  if (!timeRange) {
    return securityEvents.slice(-50) // Return last 50 events
  }
  
  return securityEvents.filter(event => 
    event.timestamp >= timeRange.start && event.timestamp <= timeRange.end
  )
}

export function getSecurityEventCounts(timeRange?: { start: Date; end: Date }) {
  const events = getSecurityEvents(timeRange)
  const counts: Record<string, number> = {}
  
  events.forEach(event => {
    counts[event.type] = (counts[event.type] || 0) + 1
  })
  
  return counts
}

// Real security monitoring functions
export function getRealFailedLogins(timeRange?: { start: Date; end: Date }): number {
  const events = getSecurityEvents(timeRange)
  return events.filter(event => event.type === 'failed_login').length
}

export function getRealRateLimitViolations(timeRange?: { start: Date; end: Date }): number {
  const events = getSecurityEvents(timeRange)
  return events.filter(event => event.type === 'rate_limit').length
}

export function getRealSuspiciousActivity(timeRange?: { start: Date; end: Date }): number {
  const events = getSecurityEvents(timeRange)
  return events.filter(event => event.type === 'suspicious_activity').length
}

// Alert management functions
export function createAlert(alert: Omit<PersistentAlert, 'id' | 'timestamp' | 'lastChecked'>): string {
  const id = Math.random().toString(36).substr(2, 9)
  const newAlert: PersistentAlert = {
    ...alert,
    id,
    timestamp: new Date(),
    lastChecked: new Date()
  }
  
  persistentAlerts.push(newAlert)
  
  // Keep only recent alerts
  if (persistentAlerts.length > MAX_ALERTS) {
    persistentAlerts.splice(0, persistentAlerts.length - MAX_ALERTS)
  }
  
  return id
}

export function resolveAlert(id: string): boolean {
  const alert = persistentAlerts.find(a => a.id === id)
  if (alert && !alert.resolved) {
    alert.resolved = true
    alert.resolvedAt = new Date()
    return true
  }
  return false
}

export function getActiveAlerts(): PersistentAlert[] {
  return persistentAlerts.filter(alert => !alert.resolved)
}

export function getAllAlerts(): PersistentAlert[] {
  return [...persistentAlerts]
}

export function updateAlertCondition(condition: string, currentValue: number, threshold: number): void {
  const existingAlert = persistentAlerts.find(alert => 
    alert.condition === condition && !alert.resolved
  )
  
  const now = new Date()
  
  if (currentValue > threshold) {
    // Condition is breached - create or update alert
    if (!existingAlert) {
      createAlert({
        type: 'warning',
        title: getAlertTitle(condition),
        message: getAlertMessage(condition, currentValue, threshold),
        resolved: false,
        condition
      })
    } else {
      // Update existing alert
      existingAlert.message = getAlertMessage(condition, currentValue, threshold)
      existingAlert.lastChecked = now
    }
  } else if (existingAlert) {
    // Condition is now good - resolve the alert
    resolveAlert(existingAlert.id)
  }
}

function getAlertTitle(condition: string): string {
  switch (condition) {
    case 'error_rate': return 'High Error Rate Detected'
    case 'response_time': return 'Slow Response Times'
    case 'memory_usage': return 'High Memory Usage'
    case 'failed_logins': return 'High Failed Login Attempts'
    case 'rate_limit_violations': return 'High Rate Limit Violations'
    case 'database_connections': return 'High Database Connections'
    case 'demo_test': return 'Monitoring System Active'
    default: return 'System Alert'
  }
}

function getAlertMessage(condition: string, currentValue: number, threshold: number): string {
  switch (condition) {
    case 'error_rate': 
      return `Error rate is ${(currentValue * 100).toFixed(2)}% (threshold: ${(threshold * 100).toFixed(2)}%)`
    case 'response_time': 
      return `Average response time is ${currentValue}ms (threshold: ${threshold}ms)`
    case 'memory_usage': 
      return `Memory usage is ${currentValue}GB (threshold: ${threshold}GB)`
    case 'failed_logins': 
      return `${currentValue} failed login attempts in the last hour (threshold: ${threshold})`
    case 'rate_limit_violations': 
      return `${currentValue} rate limit violations in the last hour (threshold: ${threshold})`
    case 'database_connections': 
      return `${currentValue} active database connections (threshold: ${threshold})`
    case 'demo_test':
      return 'Real-time monitoring system is actively tracking system metrics and will alert on any issues'
    default: 
      return `Current value: ${currentValue}, Threshold: ${threshold}`
  }
}
