'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Download, Filter, TrendingUp, Globe, Smartphone, Monitor, Calendar, MapPin, Clock, Users, Eye } from 'lucide-react'
import { formatDistanceToNow, format, subDays, startOfDay, endOfDay } from 'date-fns'

interface AnalyticsData {
  summary: {
    totalScans: number
    totalQRCodes: number
    timeRange: string
    startDate: string
    endDate: string
    uniqueVisitors: number
    avgScansPerQR: number
    mostActiveDay: string
  }
  breakdowns: {
    devices: Record<string, number>
    countries: Record<string, number>
    browsers: Record<string, number>
    os: Record<string, number>
    cities: Record<string, number>
  }
  distributions: {
    hourly: Array<{ hour: number; count: number }>
    weekly: Array<{ day: number; count: number }>
  }
  dailyScans: Array<{ date: string; count: number }>
  topQRCodes: Array<{
    id: string
    name: string
    type: string
    scanCount: number
    isDynamic: boolean
  }>
  qrCodes: Array<{
    id: string
    name: string
    type: string
    isDynamic: boolean
    scanCount: number
    lastScanned: string | null
    createdAt: string
    scans: Array<{
      id: string
      scannedAt: string
      device?: string
      country?: string
      city?: string
      browser?: string
      os?: string
    }>
  }>
}

interface AdvancedAnalyticsProps {
  userPlan: string
  isTrialActive?: boolean
}

export default function AdvancedAnalytics({ userPlan, isTrialActive }: AdvancedAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')
  const [selectedQRCode, setSelectedQRCode] = useState<string | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)

  // Check if user has access to advanced analytics
  const hasAdvancedAccess = userPlan === 'starter' || userPlan === 'pro' || userPlan === 'business' || isTrialActive

  useEffect(() => {
    if (hasAdvancedAccess) {
      fetchAnalytics()
    } else {
      setLoading(false)
    }
  }, [hasAdvancedAccess, selectedTimeRange, selectedQRCode])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        timeRange: selectedTimeRange,
        ...(selectedQRCode && { qrCodeId: selectedQRCode })
      })
      
      const response = await fetch(`/api/analytics?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      
      const data = await response.json()
      setAnalyticsData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const exportData = async (format: 'csv' | 'pdf') => {
    try {
      const params = new URLSearchParams({
        timeRange: selectedTimeRange,
        format,
        ...(selectedQRCode && { qrCodeId: selectedQRCode })
      })
      
      const response = await fetch(`/api/analytics/export?${params}`)
      if (!response.ok) {
        throw new Error('Failed to export data')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-${format}-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'pdf'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Export failed:', err)
    }
  }

  if (!hasAdvancedAccess) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
        <p className="text-gray-600 mb-6">
          Upgrade to Starter plan or higher to access detailed analytics, charts, and export features.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Upgrade Plan
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <div className="text-red-600 mb-4">
          <BarChart3 className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={fetchAnalytics}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        {/* Empty State Placeholder */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
          <p className="text-gray-600 mb-6">
            Create some QR codes and start getting scans to see your analytics data here.
          </p>
        </div>

        {/* Placeholder Analytics Dashboard */}
        <div className="space-y-6">
          {/* Filters Placeholder */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 w-full sm:w-auto">
                Last 30 days
              </div>
              <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 w-full sm:w-auto">
                All QR Codes
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg sm:w-auto w-full">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </div>
          </div>

          {/* Summary Cards Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Trends</h3>
              <div className="h-64 flex items-end justify-between space-x-1">
                {Array.from({ length: 14 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="bg-gray-200 rounded-t w-full h-4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours</h3>
              <div className="h-64 flex items-end justify-between space-x-1">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="bg-gray-200 rounded-t w-full h-4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-6"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
              <div className="space-y-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                  <div key={day} className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                    <div className="flex-1 mx-3">
                      <div className="w-full bg-gray-200 rounded-full h-2"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Geographic and Browser Data Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Usage</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top QR Codes Placeholder */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing QR Codes</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-6 bg-gray-200 rounded w-12 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-40"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { summary, breakdowns, dailyScans, topQRCodes, qrCodes } = analyticsData || {}

  // Check if we have any actual scan data
  const hasScanData = summary?.totalScans > 0

  // Helper function to get last scanned date for a QR code
  const getLastScanned = (qrId: string) => {
    const qr = qrCodes?.find(q => q.id === qrId)
    return qr?.lastScanned || null
  }

  // If we have analytics data but no scans, show empty state
  if (!hasScanData) {
    return (
      <div className="space-y-6">
        {/* Empty State for No Scans */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Scans Yet</h3>
          <p className="text-gray-600 mb-6">
            Your QR codes haven't been scanned yet. Share them to start collecting analytics data!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create QR Codes
            </button>
            <button
              onClick={() => window.location.href = '/demo'}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              View Demo
            </button>
          </div>
        </div>

        {/* Show QR Codes List for Reference */}
        {qrCodes.length > 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your QR Codes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qrCodes.slice(0, 6).map((qr) => (
                <div key={qr.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 truncate mb-1">{qr.name}</h4>
                  <p className="text-sm text-gray-600 capitalize mb-2">{qr.type}</p>
                  <div className="text-xs text-gray-500">
                    0 scans • Created {formatDistanceToNow(new Date(qr.createdAt), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
            {qrCodes.length > 6 && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                And {qrCodes.length - 6} more QR codes...
              </p>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Time Range Selector */}
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          {/* QR Code Filter */}
          <select
            value={selectedQRCode || ''}
            onChange={(e) => setSelectedQRCode(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All QR Codes</option>
            {analyticsData?.qrCodes?.map(qr => (
              <option key={qr.id} value={qr.id}>{qr.name}</option>
            ))}
          </select>
        </div>

        {/* Export Button - Full width on mobile, auto on desktop */}
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium sm:w-auto w-full"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Scans</p>
              <p className="text-3xl font-bold text-gray-900">{summary?.totalScans?.toLocaleString() || '0'}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Visitors</p>
              <p className="text-3xl font-bold text-gray-900">{summary?.uniqueVisitors?.toLocaleString() || '0'}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Scans/QR</p>
              <p className="text-3xl font-bold text-gray-900">{summary?.avgScansPerQR || '0'}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Most Active Day</p>
              <p className="text-lg font-semibold text-gray-900">
                {summary?.mostActiveDay ? format(new Date(summary.mostActiveDay), 'MMM dd') : 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                {summary?.mostActiveDay ? format(new Date(summary.mostActiveDay), 'EEEE') : 'No data'}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Scans Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Trends</h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {(dailyScans || []).slice(-14).map((day, index) => {
              const maxCount = Math.max(...(dailyScans?.map(d => d.count) || [1]))
              return (
                <div key={day.date} className="flex flex-col items-center flex-1">
                  <div 
                    className="bg-blue-500 rounded-t w-full mb-2"
                    style={{ 
                      height: `${Math.max((day.count / maxCount) * 200, 4)}px` 
                    }}
                  ></div>
                <span className="text-xs text-gray-600 transform -rotate-45">
                  {format(new Date(day.date), 'MMM dd')}
                </span>
              </div>
              )
            })}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
          <div className="space-y-3">
            {Object.entries(breakdowns?.devices || {})
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([device, count]) => {
                const percentage = (count / (summary?.totalScans || 1)) * 100
                return (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {device === 'mobile' ? (
                        <Smartphone className="h-4 w-4 text-gray-600" />
                      ) : device === 'desktop' ? (
                        <Monitor className="h-4 w-4 text-gray-600" />
                      ) : (
                        <Globe className="h-4 w-4 text-gray-600" />
                      )}
                      <span className="text-sm font-medium text-gray-900 capitalize">{device}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Time Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours</h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {analyticsData?.distributions?.hourly?.map((hour) => {
              const maxCount = Math.max(...(analyticsData?.distributions?.hourly?.map(h => h.count) || [1]))
              return (
                <div key={hour.hour} className="flex flex-col items-center flex-1">
                  <div 
                    className="bg-indigo-500 rounded-t w-full mb-2"
                    style={{ 
                      height: `${Math.max((hour.count / maxCount) * 200, 4)}px` 
                    }}
                  ></div>
                  <span className="text-xs text-gray-600">
                    {hour.hour}:00
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Weekly Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <div className="space-y-3">
            {analyticsData?.distributions?.weekly?.map((day) => {
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
              const maxCount = Math.max(...(analyticsData?.distributions?.weekly?.map(d => d.count) || [1]))
              const percentage = (day.count / maxCount) * 100
              return (
                <div key={day.day} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 w-12">{dayNames[day.day]}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{day.count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Geographic and Browser Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
          <div className="space-y-3">
            {Object.entries(breakdowns?.countries || {})
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([country, count]) => {
                const percentage = (count / (summary?.totalScans || 1)) * 100
                return (
                  <div key={country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Usage</h3>
          <div className="space-y-3">
            {Object.entries(breakdowns?.browsers || {})
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([browser, count]) => {
                const percentage = (count / (summary?.totalScans || 1)) * 100
                return (
                  <div key={browser} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 capitalize">{browser}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* OS and City Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OS Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Systems</h3>
          <div className="space-y-3">
            {Object.entries(breakdowns?.os || {})
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([os, count]) => {
                const percentage = (count / (summary?.totalScans || 1)) * 100
                return (
                  <div key={os} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 capitalize">{os}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* City Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Cities</h3>
          <div className="space-y-3">
            {Object.entries(breakdowns?.cities || {})
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([city, count]) => {
                const percentage = (count / (summary?.totalScans || 1)) * 100
                return (
                  <div key={city} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{city}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-teal-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Top QR Codes Performance */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing QR Codes</h3>
        
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">QR Code</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Scans</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Last Scanned</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Total Scans</th>
              </tr>
            </thead>
            <tbody>
              {(topQRCodes || []).slice(0, 10).map((qr) => (
                <tr key={qr.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{qr.name}</span>
                      {qr.isDynamic && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Dynamic
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 capitalize">{qr.type}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{qr.scanCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {getLastScanned(qr.id) ? formatDistanceToNow(new Date(getLastScanned(qr.id)!), { addSuffix: true }) : 'Never'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {qr.scanCount.toLocaleString()} scans
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {(topQRCodes || []).slice(0, 10).map((qr) => (
            <div key={qr.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{qr.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600 capitalize">{qr.type}</span>
                    {qr.isDynamic && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Dynamic
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{qr.scanCount.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">scans</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Last scanned: {getLastScanned(qr.id) ? formatDistanceToNow(new Date(getLastScanned(qr.id)!), { addSuffix: true }) : 'Never'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Analytics Data</h3>
            <p className="text-gray-600 mb-6">Choose your preferred export format:</p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  exportData('csv')
                  setShowExportModal(false)
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Export as CSV
              </button>
              <button
                onClick={() => {
                  exportData('pdf')
                  setShowExportModal(false)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Export as PDF
              </button>
            </div>
            
            <button
              onClick={() => setShowExportModal(false)}
              className="w-full mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
