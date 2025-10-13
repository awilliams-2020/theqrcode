'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  priority: string
  ctaText?: string
  ctaUrl?: string
  isViewed: boolean
}

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements')
      const data = await res.json()
      if (data.success) {
        const unviewed = data.announcements.filter((a: Announcement) => !a.isViewed)
        setAnnouncements(unviewed)
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
    }
  }

  const markAsViewed = async (announcementId: string) => {
    try {
      await fetch(`/api/announcements/${announcementId}/view`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Failed to mark announcement as viewed:', error)
    }
  }

  const handleDismiss = (announcementId: string) => {
    markAsViewed(announcementId)
    setDismissed(prev => new Set(prev).add(announcementId))
    
    // Show next announcement if available
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleCTA = (announcement: Announcement) => {
    if (announcement.ctaUrl) {
      router.push(announcement.ctaUrl)
    }
    handleDismiss(announcement.id)
  }

  const visibleAnnouncements = announcements.filter(a => !dismissed.has(a.id))
  
  if (visibleAnnouncements.length === 0) {
    return null
  }

  const announcement = visibleAnnouncements[0]

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'feature':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
      case 'update':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
      case 'maintenance':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
      case 'promotion':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white'
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature': return '🚀'
      case 'update': return '🔔'
      case 'maintenance': return '🔧'
      case 'promotion': return '🎉'
      default: return '📢'
    }
  }

  return (
    <div className={`${getTypeStyles(announcement.type)} py-3 px-4 shadow-lg`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <span className="text-2xl">{getTypeIcon(announcement.type)}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base">{announcement.title}</p>
              <p className="text-sm opacity-90 mt-0.5">{announcement.content}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {announcement.ctaText && (
              <button
                onClick={() => handleCTA(announcement)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm whitespace-nowrap"
              >
                {announcement.ctaText}
              </button>
            )}
            <button
              onClick={() => handleDismiss(announcement.id)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

