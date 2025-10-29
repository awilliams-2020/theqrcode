'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Eye, TrendingUp, AlertCircle, Rocket, Globe, Smartphone, BarChart3, Trophy, Bell, Lightbulb } from 'lucide-react'

interface Notification {
  id: string
  type: string
  title?: string
  message: string
  priority?: string
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
  const popoverRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 0)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'normal': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scan':
        return <Eye className="h-5 w-5 text-blue-600" />
      case 'milestone':
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'analytics_spike':
        return <Rocket className="h-5 w-5 text-yellow-600" />
      case 'analytics_location':
        return <Globe className="h-5 w-5 text-green-600" />
      case 'analytics_trend':
        return <Smartphone className="h-5 w-5 text-purple-600" />
      case 'analytics_summary':
        return <BarChart3 className="h-5 w-5 text-blue-600" />
      case 'analytics_record':
        return <Trophy className="h-5 w-5 text-orange-600" />
      case 'usage_alert':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'plan_limit':
        return <BarChart3 className="h-5 w-5 text-blue-600" />
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-yellow-600" />
      case 'update':
        return <Bell className="h-5 w-5 text-gray-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const displayNotifications = showAll ? notifications : notifications.slice(0, 5)

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
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

      <div className={`relative ${className}`} ref={popoverRef}>
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
                    onClick={onClearAll}
                    className="text-xs md:text-sm text-blue-600 hover:text-blue-700 whitespace-nowrap"
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
              {displayNotifications.length === 0 ? (
                <div className="p-6 md:p-8 text-center text-gray-500">
                  <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm md:text-base">No notifications yet</p>
                  <p className="text-xs md:text-sm text-gray-400 mt-1">
                    You'll see live updates here when your QR codes are scanned
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {displayNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-3 md:p-4 transition-colors cursor-pointer hover:bg-gray-50 active:bg-gray-100 ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-2 md:space-x-3">
                        <div className="flex-shrink-0 mt-0.5">{getTypeIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          {notification.title && (
                            <p className={`text-xs md:text-sm font-medium ${getPriorityColor(notification.priority)} break-words`}>
                              {notification.title}
                            </p>
                          )}
                          <p className="text-xs md:text-sm text-gray-600 mt-1 break-words line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        {!notification.read && (
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
                {notifications.length > 5 ? (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showAll ? 'Show less' : `Show all ${notifications.length} notifications`}
                  </button>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
