'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Globe, 
  Server, 
  Shield, 
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'

interface SystemMetrics {
  uptime: number
  responseTime: number
  errorRate: number
  activeUsers: number
  totalScans: number
  apiRequests: number
  memoryUsage: number
  databaseConnections: number
}

interface Alert {
  id: string
  type: 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  resolved: boolean
}

interface PerformanceData {
  timestamp: string
  responseTime: number
  errorRate: number
  requests: number
}

interface SecurityMetrics {
  failedLogins: number
  rateLimitViolations: number
  suspiciousActivity: number
  sslStatus: string
}

interface SystemInfo {
  runtime: string
  runtimeMs: number
  startTime: string
  totalRequests: number
  totalErrors: number
}

interface UptimeStats {
  uptime24h: number
  uptime7d: number
  uptime30d: number
  totalChecks24h: number
  totalChecks7d: number
  totalChecks30d: number
  hasActiveIncident: boolean
  recentIncidents: Array<{
    id: string
    startedAt: string
    endedAt: string | null
    duration: number | null
    cause: string | null
    resolved: boolean
  }>
}

export default function AdminMonitoring() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    uptime: 99.9,
    responseTime: 0,
    errorRate: 0,
    activeUsers: 0,
    totalScans: 0,
    apiRequests: 0,
    memoryUsage: 0,
    databaseConnections: 0
  })
  
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    failedLogins: 0,
    rateLimitViolations: 0,
    suspiciousActivity: 0,
    sslStatus: 'Valid'
  })
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    runtime: '0s',
    runtimeMs: 0,
    startTime: new Date().toISOString(),
    totalRequests: 0,
    totalErrors: 0
  })
  const [uptimeStats, setUptimeStats] = useState<UptimeStats>({
    uptime24h: 100,
    uptime7d: 100,
    uptime30d: 100,
    totalChecks24h: 0,
    totalChecks7d: 0,
    totalChecks30d: 0,
    hasActiveIncident: false,
    recentIncidents: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMonitoringData()
    const interval = setInterval(fetchMonitoringData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchMonitoringData = async () => {
    try {
      const response = await fetch('/api/monitoring/metrics')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.metrics)
        setAlerts(data.alerts)
        setPerformanceData(data.performanceData)
        setSecurityMetrics(data.securityMetrics || {
          failedLogins: 0,
          rateLimitViolations: 0,
          suspiciousActivity: 0,
          sslStatus: 'Valid'
        })
        setSystemInfo(data.systemInfo || {
          runtime: '0s',
          runtimeMs: 0,
          startTime: new Date().toISOString(),
          totalRequests: 0,
          totalErrors: 0
        })
        setUptimeStats(data.uptimeStats || {
          uptime24h: 100,
          uptime7d: 100,
          uptime30d: 100,
          totalChecks24h: 0,
          totalChecks7d: 0,
          totalChecks30d: 0,
          hasActiveIncident: false,
          recentIncidents: []
        })
      }
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600'
    if (value <= thresholds.warning) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />
    }
  }

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}m ${remainingSeconds}s`
    }
    const hours = Math.floor(seconds / 3600)
    const remainingMinutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${remainingMinutes}m`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Monitoring</h2>
          <p className="text-gray-600 mt-1">
            Real-time system health and performance metrics
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          metrics.uptime >= 99.9 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200"
        }`}>
          {metrics.uptime >= 99.9 ? "Healthy" : "Issues Detected"}
        </span>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-semibold text-gray-700">System Uptime (30d)</h3>
            <Server className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <div className={`text-2xl font-bold ${
              metrics.uptime >= 99.9 ? 'text-green-600' : 
              metrics.uptime >= 99.0 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.uptime}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {uptimeStats.totalChecks30d} health checks
            </p>
            {uptimeStats.hasActiveIncident && (
              <span className="inline-flex items-center mt-2 px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                Incident Active
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-semibold text-gray-700">Avg Response Time</h3>
            <Zap className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <div className={`text-2xl font-bold ${getStatusColor(metrics.responseTime, { good: 200, warning: 500 })}`}>
              {metrics.responseTime}ms
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Average API response (last hour)
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-semibold text-gray-700">Error Rate</h3>
            <AlertTriangle className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <div className={`text-2xl font-bold ${getStatusColor(metrics.errorRate * 100, { good: 1, warning: 5 })}`}>
              {(metrics.errorRate * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Last 24 hours
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-semibold text-gray-700">Active Sessions</h3>
            <Users className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{metrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">
              Currently logged in
            </p>
          </div>
        </div>
      </div>

      {/* Uptime History */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Clock className="h-5 w-5 text-blue-600" />
            Uptime History
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Historical uptime percentages and recent downtime incidents
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Last 24 Hours</span>
              <span className={`text-xl font-bold ${
                uptimeStats.uptime24h >= 99.9 ? 'text-green-600' : 
                uptimeStats.uptime24h >= 99.0 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {uptimeStats.uptime24h.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{uptimeStats.totalChecks24h} checks</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Last 7 Days</span>
              <span className={`text-xl font-bold ${
                uptimeStats.uptime7d >= 99.9 ? 'text-green-600' : 
                uptimeStats.uptime7d >= 99.0 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {uptimeStats.uptime7d.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{uptimeStats.totalChecks7d} checks</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Last 30 Days</span>
              <span className={`text-xl font-bold ${
                uptimeStats.uptime30d >= 99.9 ? 'text-green-600' : 
                uptimeStats.uptime30d >= 99.0 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {uptimeStats.uptime30d.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{uptimeStats.totalChecks30d} checks</p>
          </div>
        </div>

        {/* Recent Incidents */}
        {uptimeStats.recentIncidents.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Downtime Incidents</h4>
            <div className="space-y-2">
              {uptimeStats.recentIncidents.map((incident) => (
                <div 
                  key={incident.id}
                  className={`p-3 rounded-lg border ${
                    incident.resolved 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        incident.resolved ? 'text-gray-500' : 'text-red-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-900">
                        {incident.cause?.replace('_', ' ').toUpperCase() || 'UNKNOWN CAUSE'}
                      </span>
                      {!incident.resolved && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800 rounded">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {incident.duration 
                        ? formatDuration(incident.duration)
                        : 'Ongoing'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                    <span>Started: {new Date(incident.startedAt).toLocaleString()}</span>
                    {incident.endedAt && (
                      <span>Ended: {new Date(incident.endedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {uptimeStats.recentIncidents.length === 0 && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-900">Perfect Uptime</p>
              <p className="text-xs text-green-700">No downtime incidents recorded</p>
            </div>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Activity className="h-5 w-5 text-blue-600" />
              Performance Metrics
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Real-time system performance indicators
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Database Connections</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                metrics.databaseConnections < 20 
                  ? "bg-green-100 text-green-800 border border-green-200" 
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}>
                {metrics.databaseConnections}/50
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Server className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Memory Usage</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                metrics.memoryUsage < 4 
                  ? "bg-green-100 text-green-800 border border-green-200" 
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}>
                {metrics.memoryUsage}GB
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">API Requests (1h)</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                {metrics.apiRequests.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Total Scans Today</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                {metrics.totalScans.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Shield className="h-5 w-5 text-green-600" />
              Security Overview
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Security monitoring and threat detection
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-700">Failed Login Attempts</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                securityMetrics.failedLogins > 5 
                  ? "bg-red-100 text-red-800 border-red-200" 
                  : securityMetrics.failedLogins > 0
                  ? "bg-orange-100 text-orange-800 border-orange-200"
                  : "bg-green-100 text-green-800 border-green-200"
              }`}>
                {securityMetrics.failedLogins} (last hour)
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-700">Rate Limit Violations</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                securityMetrics.rateLimitViolations > 0 
                  ? "bg-red-100 text-red-800 border-red-200" 
                  : "bg-green-100 text-green-800 border-green-200"
              }`}>
                {securityMetrics.rateLimitViolations} (last hour)
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-700">Suspicious API Usage</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                securityMetrics.suspiciousActivity > 0 
                  ? "bg-red-100 text-red-800 border-red-200" 
                  : "bg-green-100 text-green-800 border-green-200"
              }`}>
                {securityMetrics.suspiciousActivity} (last hour)
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-700">SSL Certificate</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                {securityMetrics.sslStatus} (30 days)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Active Alerts & Notifications
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            System alerts and maintenance notifications
          </p>
        </div>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">All Systems Operational</h4>
                <p className="text-sm text-green-700 mt-1">
                  No active alerts or issues detected.
                </p>
              </div>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`flex items-start gap-4 p-4 border rounded-lg ${
                alert.type === 'error' ? 'bg-red-50 border-red-200' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              } ${alert.resolved ? "opacity-60" : ""}`}>
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    alert.type === 'error' ? 'text-red-900' :
                    alert.type === 'warning' ? 'text-yellow-900' :
                    'text-blue-900'
                  } ${alert.resolved ? "line-through" : ""}`}>
                    {alert.title}
                  </h4>
                  <p className={`text-sm mt-2 ${
                    alert.type === 'error' ? 'text-red-700' :
                    alert.type === 'warning' ? 'text-yellow-700' :
                    'text-blue-700'
                  }`}>
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {alert.resolved && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* External Monitoring Links */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">External Monitoring Tools</h3>
          <p className="text-gray-600 text-sm mt-1">
            Access to external monitoring services and dashboards
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a 
            href="https://sentry.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border border-orange-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 bg-orange-50"
          >
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Sentry</div>
              <div className="text-xs text-gray-600">Error Tracking & Performance</div>
            </div>
          </a>

          <a 
            href="https://uptimerobot.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">UptimeRobot</div>
              <div className="text-xs text-gray-600">Uptime Monitoring</div>
            </div>
          </a>

          <a 
            href="https://vercel.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">V</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Vercel Analytics</div>
              <div className="text-xs text-gray-600">Performance</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

