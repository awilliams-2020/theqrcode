'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRealtimePolling } from '@/hooks/useRealtimePolling'
import LiveScanCounter from './LiveScanCounter'
import LiveActivityFeed from './LiveActivityFeed'
import LiveNotifications from './LiveNotifications'
import RealtimeCharts from './RealtimeCharts'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'

interface RealtimeAnalyticsProps {
  userPlan: string
  isTrialActive?: boolean
  subscriptionStatus?: string
  className?: string
}

export default function RealtimeAnalytics({ 
  userPlan, 
  isTrialActive = false,
  subscriptionStatus = 'active',
  className = ''
}: RealtimeAnalyticsProps) {
  const { data: session } = useSession()
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Check if user has access to real-time analytics
  // Live Analytics is only available for trialing users or pro+ users with active status
  const hasRealtimeAccess = isTrialActive || (subscriptionStatus === 'active' && (userPlan === 'pro' || userPlan === 'business'))

  const {
    isConnected,
    liveData,
    recentScans,
    notifications,
    unreadCount,
    markNotificationAsRead,
    clearNotifications
  } = useRealtimePolling((session?.user as any)?.id || '')

  // Debug logging removed for production stability

  useEffect(() => {
    if ((session?.user as any)?.id) {
      setIsInitialized(true)
    }
  }, [session])

  if (!hasRealtimeAccess) {
    return (
      <div className={`bg-white p-8 rounded-lg border border-gray-200 text-center ${className}`}>
        <Wifi className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
        <p className="text-gray-600 mb-6">
          Live analytics are available for Pro and Business plans with active subscriptions, or during trial periods.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Upgrade Plan
        </button>
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className={`bg-white p-8 rounded-lg border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Initializing real-time analytics...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-gray-900">Real-time Analytics</h2>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <Wifi className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-red-600" />
                <span className="text-sm text-red-600 font-medium">Disconnected</span>
              </>
            )}
          </div>
        </div>
        
        <LiveNotifications
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markNotificationAsRead}
          onClearAll={clearNotifications}
        />
      </div>

      {/* Connection Warning */}
      {!isConnected && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Connection Lost</h4>
              <p className="text-sm text-red-700 mt-1">
                Real-time updates are not available. Check your internet connection.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live Scan Counter */}
      <LiveScanCounter
        totalScans={liveData.totalScans}
        scansToday={liveData.scansToday}
        scansThisHour={liveData.scansThisHour}
        isLive={isConnected}
      />

      {/* Live Activity Feed */}
      <LiveActivityFeed
        scans={recentScans}
        maxItems={10}
      />

      {/* Real-time Charts */}
      <RealtimeCharts
        scans={recentScans}
      />

      {/* Additional Real-time Metrics - Now handled by charts above */}

      {/* Real-time Performance Metrics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-900">{liveData.uniqueVisitors}</div>
            <div className="text-sm text-blue-600">Unique Visitors</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-900">
              {liveData.scansThisHour > 0 ? Math.round((liveData.scansThisHour / 60) * 100) / 100 : 0}
            </div>
            <div className="text-sm text-green-600">Scans per Minute</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-900">
              {liveData.totalScans > 0 ? Math.round((liveData.scansToday / liveData.totalScans) * 100) : 0}%
            </div>
            <div className="text-sm text-purple-600">Today's Share</div>
          </div>
        </div>
      </div>
    </div>
  )
}
