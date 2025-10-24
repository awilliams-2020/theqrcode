'use client'

import { useState, useEffect } from 'react'
import { Bell, X, Check, AlertCircle, TrendingUp, Eye } from 'lucide-react'
import { useUserTimezone } from '@/hooks/useUserTimezone'
import { formatTimeAgoInTimezone } from '@/lib/date-utils'

interface Notification {
  id: string
  type: string
  message: string
  timestamp: Date
  read: boolean
}

interface LiveNotificationsProps {
  notifications: Notification[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onClearAll: () => void
  className?: string
}

export default function LiveNotifications({
  notifications,
  unreadCount,
  onMarkAsRead,
  onClearAll,
  className = ''
}: LiveNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const userTimezone = useUserTimezone()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'scan':
        return <Eye className="h-4 w-4 text-blue-600" />
      case 'milestone':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'analytics_spike':
        return <span className="text-lg">🚀</span>
      case 'analytics_location':
        return <span className="text-lg">🌍</span>
      case 'analytics_trend':
        return <span className="text-lg">📱</span>
      case 'analytics_summary':
        return <span className="text-lg">📊</span>
      case 'analytics_record':
        return <span className="text-lg">🏆</span>
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'scan':
        return 'bg-blue-50 border-blue-200'
      case 'milestone':
        return 'bg-green-50 border-green-200'
      case 'alert':
        return 'bg-red-50 border-red-200'
      case 'analytics_spike':
        return 'bg-yellow-50 border-yellow-200'
      case 'analytics_location':
        return 'bg-green-50 border-green-200'
      case 'analytics_trend':
        return 'bg-purple-50 border-purple-200'
      case 'analytics_summary':
        return 'bg-blue-50 border-blue-200'
      case 'analytics_record':
        return 'bg-orange-50 border-orange-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const displayNotifications = showAll ? notifications : notifications.slice(0, 5)
  const unreadNotifications = notifications.filter(n => !n.read)

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {displayNotifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No notifications yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  You'll see live updates here when your QR codes are scanned
                </p>
              </div>
            ) : (
              displayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.read ? getNotificationColor(notification.type) : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          {isMounted 
                            ? formatTimeAgoInTimezone(notification.timestamp, userTimezone)
                            : 'Loading...'
                          }
                        </p>
                        {!notification.read && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>

                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 5 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {showAll ? 'Show less' : `Show all ${notifications.length} notifications`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
