'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'

export interface RealtimeScanData {
  id: string
  qrCodeId: string
  qrCodeName: string
  qrCodeType: string
  timestamp: Date
  location: {
    country: string
    city: string
  }
  device: {
    type: string
    browser: string
    os: string
  }
  userId: string
}

export interface RealtimeAnalyticsUpdate {
  type: 'scan' | 'analytics_update' | 'qr_code_created' | 'qr_code_deleted'
  data: RealtimeScanData | any
  userId: string
  timestamp: Date
}

export interface LiveAnalyticsData {
  totalScans: number
  scansToday: number
  scansThisHour: number
  uniqueVisitors: number
  topCountries: Array<{ country: string; count: number }>
  topDevices: Array<{ device: string; count: number }>
  recentScans: RealtimeScanData[]
}

export function useRealtimePolling(userId: string) {
  const { data: session } = useSession()
  const [isConnected, setIsConnected] = useState(false)
  const [liveData, setLiveData] = useState<LiveAnalyticsData>({
    totalScans: 0,
    scansToday: 0,
    scansThisHour: 0,
    uniqueVisitors: 0,
    topCountries: [],
    topDevices: [],
    recentScans: []
  })
  const [recentScans, setRecentScans] = useState<RealtimeScanData[]>([])
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'scan' | 'milestone' | 'alert' | 'analytics_spike' | 'analytics_location' | 'analytics_trend' | 'analytics_summary' | 'analytics_record'
    message: string
    timestamp: Date
    read: boolean
  }>>([])
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const notificationPollingRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch real-time data
  const fetchRealtimeData = useCallback(async () => {
    if (!userId || !session?.user?.id) return

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
      const pollingUrl = baseUrl ? `${baseUrl}/api/realtime/polling` : '/api/realtime/polling'
      
      const response = await fetch(pollingUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.type === 'realtime_data') {
        setLiveData(prev => ({
          ...prev,
          ...data.data
        }))
        
        // Update recent scans with proper data structure
        const formattedRecentScans = (data.data.recentScans || []).map((scan: any) => ({
          id: scan?.id || '',
          qrCodeId: '', // Will be populated if needed
          qrCodeName: scan?.qrCodeName || 'Unknown QR Code',
          qrCodeType: scan?.qrCodeType || 'url',
          timestamp: scan?.scannedAt ? new Date(scan.scannedAt) : new Date(),
          location: {
            country: scan?.country || 'Unknown',
            city: scan?.city || 'Unknown'
          },
          device: {
            type: scan?.device || 'Unknown',
            browser: scan?.browser || 'Unknown',
            os: scan?.os || 'Unknown'
          },
          userId: session?.user?.id || ''
        }))
        
        setRecentScans(formattedRecentScans)
        setIsConnected(true)
      }

    } catch (error) {
      setIsConnected(false)
    }
  }, [userId, session?.user?.id])

  // Start polling
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return


    // Initial fetch
    fetchRealtimeData()

    // Poll every 2 seconds for real-time updates
    pollingIntervalRef.current = setInterval(fetchRealtimeData, 2000)
  }, [fetchRealtimeData])

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    setIsConnected(false)
  }, [])

  // Fetch analytics notifications
  const fetchAnalyticsNotifications = useCallback(async () => {
    if (!userId || !session?.user?.id) return

    try {
      const response = await fetch('/api/notifications?category=analytics', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      if (!response.ok) return

      const data = await response.json()

      if (data.success && data.notifications) {
        // Format notifications to match the expected structure
        const formattedNotifications = data.notifications.map((notif: any) => ({
          id: notif.id,
          type: notif.type,
          message: `${notif.title}: ${notif.message}`,
          timestamp: new Date(notif.createdAt),
          read: notif.isRead
        }))
        
        setNotifications(formattedNotifications)
      }
    } catch (error) {
      // Failed to fetch analytics notifications
    }
  }, [userId, session?.user?.id])

  // Initialize polling
  useEffect(() => {
    if (!userId || !session?.user?.id) return

    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
        const pollingUrl = baseUrl ? `${baseUrl}/api/realtime/polling` : '/api/realtime/polling'
        
        const response = await fetch(pollingUrl, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.type === 'realtime_data') {
          setLiveData(prev => ({
            ...prev,
            ...data.data
          }))
          
          // Update recent scans with proper data structure
          const formattedRecentScans = (data.data.recentScans || []).map((scan: any) => ({
            id: scan?.id || '',
            qrCodeId: '', // Will be populated if needed
            qrCodeName: scan?.qrCodeName || 'Unknown QR Code',
            qrCodeType: scan?.qrCodeType || 'url',
            timestamp: scan?.scannedAt ? new Date(scan.scannedAt) : new Date(),
            location: {
              country: scan?.country || 'Unknown',
              city: scan?.city || 'Unknown'
            },
            device: {
              type: scan?.device || 'Unknown',
              browser: scan?.browser || 'Unknown',
              os: scan?.os || 'Unknown'
            },
            userId: session?.user?.id || ''
          }))
          
          setRecentScans(formattedRecentScans)
          setIsConnected(true)
        }

      } catch (error) {
        setIsConnected(false)
      }
    }

    // Initial fetch
    fetchData()
    fetchAnalyticsNotifications()

    // Start polling interval
    const interval = setInterval(fetchData, 2000)
    const notificationInterval = setInterval(fetchAnalyticsNotifications, 5000) // Poll notifications every 5 seconds

    return () => {
      clearInterval(interval)
      clearInterval(notificationInterval)
    }
  }, [userId, session?.user?.id, fetchAnalyticsNotifications])

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        credentials: 'include'
      })
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      )
    } catch (error) {
      // Failed to mark notification as read
    }
  }, [])

  // Clear all notifications
  const clearNotifications = useCallback(async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'markAllRead' })
      })
      
      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
    } catch (error) {
      // Failed to clear notifications
    }
  }, [])

  // Get unread notification count
  const unreadCount = notifications.filter(n => !n.read).length

  return {
    isConnected,
    liveData,
    recentScans,
    notifications,
    unreadCount,
    markNotificationAsRead,
    clearNotifications
  }
}
