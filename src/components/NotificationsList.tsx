'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Check, CheckCheck, Trash2, Filter } from 'lucide-react'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  actionUrl?: string | null
  priority: string
  isRead: boolean
  createdAt: string | Date
}

interface NotificationsListProps {
  initialNotifications: Notification[]
}

export default function NotificationsList({ initialNotifications }: NotificationsListProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
      })

      if (response.ok) {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        ))
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' }),
      })

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })))
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
    if (notification.actionUrl) {
      // Ensure absolute navigation by using window.location for root paths
      if (notification.actionUrl.startsWith('/')) {
        window.location.href = notification.actionUrl
      } else {
        router.push(notification.actionUrl)
      }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'normal': return 'border-blue-500 bg-blue-50'
      default: return 'border-gray-300 bg-white'
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'usage_alert': return '⚠️'
      case 'plan_limit': return '📊'
      case 'milestone': return '🎉'
      case 'tip': return '💡'
      case 'update': return '🔔'
      default: return '📬'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    // Only calculate relative time on client side to avoid hydration mismatch
    if (!isMounted) {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    }
    
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24)
      return `${days} ${days === 1 ? 'day' : 'days'} ago`
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header with filters and actions */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-gray-400" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                All Notifications
              </h2>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600">
                  {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter buttons */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'unread'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mark all as read */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications list */}
      <div className="divide-y divide-gray-100">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? "You're all caught up! Check back later for new updates."
                : "We'll notify you when there's something new."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-6 transition-colors ${
                notification.actionUrl ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
              } ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <span className="text-3xl">{getTypeIcon(notification.type)}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {notification.priority !== 'low' && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityBadgeColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      )}
                      {!notification.isRead && (
                        <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {formatDate(notification.createdAt instanceof Date ? notification.createdAt.toISOString() : notification.createdAt)}
                    </span>

                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(notification.id)
                        }}
                        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Check className="h-4 w-4" />
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer stats */}
      {notifications.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-600">
          Showing {filteredNotifications.length} of {notifications.length} total notifications
        </div>
      )}
    </div>
  )
}

