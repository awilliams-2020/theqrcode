'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { X } from 'lucide-react'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  priority: string
  isRead: boolean
  createdAt: string
}

export default function NotificationBell() {
  const { data: session, status } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only fetch notifications if we're in the browser and have a valid session
    if (typeof window !== 'undefined' && status === 'authenticated' && session?.user?.id) {
      // Add a small delay to ensure session is established
      const timeoutId = setTimeout(() => {
        fetchNotifications()
      }, 100)
      
      // Poll for new notifications every 60 seconds
      const interval = setInterval(fetchNotifications, 60000)
      
      return () => {
        clearTimeout(timeoutId)
        clearInterval(interval)
      }
    }
  }, [status, session?.user?.id])

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      // Add a small delay to prevent immediate closing when opening
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 0)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    // Don't fetch if not authenticated
    if (status !== 'authenticated' || !session?.user?.id) {
      return
    }

    try {
      // Fetch only non-analytics notifications for navbar bell
      const res = await fetch('/api/notifications?category=general', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      
      const data = await res.json()
      
      if (data.success) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      } else {
        throw new Error(data.error || 'Failed to fetch notifications')
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    // Don't proceed if not authenticated
    if (status !== 'authenticated' || !session?.user?.id) {
      return
    }

    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        fetchNotifications()
      } else {
        throw new Error(result.error || 'Failed to mark notification as read')
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    // Don't proceed if not authenticated
    if (status !== 'authenticated' || !session?.user?.id) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        fetchNotifications()
      } else {
        throw new Error(result.error || 'Failed to mark all notifications as read')
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    setIsOpen(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'normal': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'usage_alert': return '⚠️'
      case 'plan_limit': return '📊'
      case 'milestone': return '🎉'
      case 'tip': return '💡'
      case 'update': return '🔔'
      case 'analytics_spike': return '🚀'
      case 'analytics_location': return '🌍'
      case 'analytics_trend': return '📱'
      case 'analytics_summary': return '📊'
      case 'analytics_record': return '🏆'
      default: return '📬'
    }
  }

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="relative" ref={popoverRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Notifications"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="fixed md:absolute right-4 md:right-0 left-4 md:left-auto top-16 md:top-auto md:mt-2 w-auto md:w-96 max-w-md bg-white rounded-lg shadow-xl z-50 border border-gray-200">
            <div className="p-3 md:p-4 border-b border-gray-200 flex justify-between items-center gap-2">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    disabled={loading}
                    className="text-xs md:text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 whitespace-nowrap"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="md:hidden p-1 text-gray-400 hover:text-gray-600 rounded"
                  aria-label="Close notifications"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(100vh-12rem)] md:max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 md:p-8 text-center text-gray-500">
                  <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm md:text-base">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-3 md:p-4 transition-colors cursor-pointer hover:bg-gray-50 active:bg-gray-100 ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-2 md:space-x-3">
                        <span className="text-xl md:text-2xl flex-shrink-0">{getTypeIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs md:text-sm font-medium ${getPriorityColor(notification.priority)} break-words`}>
                            {notification.title}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600 mt-1 break-words line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <button
                  onClick={() => {
                    router.push('/dashboard/notifications')
                    setIsOpen(false)
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

