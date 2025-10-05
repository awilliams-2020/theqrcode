'use client'

import { useState, useEffect } from 'react'
import { MapPin, Smartphone, Monitor, Globe, Clock, Eye, Tablet } from 'lucide-react'
import { RealtimeScanData } from '@/hooks/useRealtimePolling'
import { formatDistanceToNow } from 'date-fns'

interface LiveActivityFeedProps {
  scans: RealtimeScanData[]
  maxItems?: number
  className?: string
}

export default function LiveActivityFeed({ 
  scans, 
  maxItems = 10,
  className = ''
}: LiveActivityFeedProps) {
  const [displayedScans, setDisplayedScans] = useState<RealtimeScanData[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setDisplayedScans(scans.slice(0, maxItems))
  }, [scans, maxItems])

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4 text-blue-600" />
      case 'desktop':
        return <Monitor className="h-4 w-4 text-green-600" />
      case 'tablet':
        return <Tablet className="h-4 w-4 text-purple-600" />
      default:
        return <Globe className="h-4 w-4 text-gray-600" />
    }
  }

  const getDeviceColor = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return 'bg-blue-100 text-blue-800'
      case 'desktop':
        return 'bg-green-100 text-green-800'
      case 'tablet':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (scans.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-500">No activity in last 24h</span>
          </div>
        </div>
        
        <div className="text-center py-8">
          <Eye className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No scans in the last 24 hours</p>
          <p className="text-sm text-gray-400 mt-1">
            Share your QR codes to start seeing live activity
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">LIVE</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Real-time scan activity from your QR codes (last 24 hours)
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {displayedScans.map((scan, index) => (
          <div 
            key={scan.id} 
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              index === 0 ? 'bg-green-50 border-green-200' : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
              {/* Device Icon and QR Code Name */}
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0 mt-1">
                  {getDeviceIcon(scan?.device?.type || 'unknown')}
                </div>

                {/* Scan Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                    <span className="font-medium text-gray-900 truncate text-sm sm:text-base">
                      "{scan?.qrCodeName || 'Unknown QR Code'}"
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getDeviceColor(scan?.device?.type || 'unknown')}`}>
                        {scan?.device?.type || 'Unknown'}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Location and Time - Stack on mobile */}
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {(() => {
                          const countryFlags: Record<string, string> = {
                            'United States': '🇺🇸',
                            'United Kingdom': '🇬🇧', 
                            'Canada': '🇨🇦',
                            'Germany': '🇩🇪',
                            'Australia': '🇦🇺',
                            'France': '🇫🇷',
                            'Japan': '🇯🇵',
                            'China': '🇨🇳',
                            'India': '🇮🇳',
                            'Brazil': '🇧🇷',
                            'Italy': '🇮🇹',
                            'Spain': '🇪🇸',
                            'Netherlands': '🇳🇱',
                            'Sweden': '🇸🇪',
                            'Norway': '🇳🇴',
                            'Denmark': '🇩🇰',
                            'Finland': '🇫🇮',
                            'Switzerland': '🇨🇭',
                            'Austria': '🇦🇹',
                            'Belgium': '🇧🇪',
                            'Poland': '🇵🇱',
                            'Russia': '🇷🇺',
                            'South Korea': '🇰🇷',
                            'Singapore': '🇸🇬',
                            'Hong Kong': '🇭🇰',
                            'Mexico': '🇲🇽',
                            'Argentina': '🇦🇷',
                            'Chile': '🇨🇱',
                            'South Africa': '🇿🇦',
                            'Nigeria': '🇳🇬',
                            'Egypt': '🇪🇬',
                            'Turkey': '🇹🇷',
                            'Israel': '🇮🇱',
                            'United Arab Emirates': '🇦🇪',
                            'Saudi Arabia': '🇸🇦',
                            'Thailand': '🇹🇭',
                            'Malaysia': '🇲🇾',
                            'Indonesia': '🇮🇩',
                            'Philippines': '🇵🇭',
                            'Vietnam': '🇻🇳',
                            'New Zealand': '🇳🇿'
                          }
                          const country = scan?.location?.country || 'Unknown'
                          const city = scan?.location?.city || 'Unknown'
                          const flag = countryFlags[country] || '🌍'
                          return `${flag} ${city}, ${country}`
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">
                        {scan?.timestamp && isMounted 
                          ? formatDistanceToNow(new Date(scan.timestamp), { addSuffix: true }) 
                          : 'Unknown time'
                        }
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 text-xs text-gray-500">
                    {scan?.device?.browser || 'Unknown browser'} on {scan?.device?.os || 'Unknown OS'}
                  </div>
                </div>
              </div>

              {/* Scan Count Badge */}
              <div className="flex-shrink-0 self-start sm:self-auto">
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  Scan #{index + 1}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {scans.length > maxItems && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Showing {maxItems} of {scans.length} recent scans
          </p>
        </div>
      )}
    </div>
  )
}
