'use client'

import { useState, useEffect } from 'react'
import { Eye, TrendingUp, Clock } from 'lucide-react'

interface LiveScanCounterProps {
  totalScans: number
  scansToday: number
  scansThisHour: number
  isLive?: boolean
  className?: string
}

export default function LiveScanCounter({ 
  totalScans, 
  scansToday, 
  scansThisHour, 
  isLive = false,
  className = ''
}: LiveScanCounterProps) {
  const [animatedTotal, setAnimatedTotal] = useState(totalScans)
  const [animatedToday, setAnimatedToday] = useState(scansToday)
  const [animatedHour, setAnimatedHour] = useState(scansThisHour)
  const [isMounted, setIsMounted] = useState(false)

  // Ensure component is mounted before starting animations
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Animate counters when values change (only on client side)
  useEffect(() => {
    if (!isMounted) return

    const animateValue = (start: number, end: number, setter: (value: number) => void, duration: number = 1000) => {
      const startTime = Date.now()
      const difference = end - start
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        const current = start + (difference * easeOutCubic)
        
        setter(Math.floor(current))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      animate()
    }

    animateValue(animatedTotal, totalScans, setAnimatedTotal)
    animateValue(animatedToday, scansToday, setAnimatedToday)
    animateValue(animatedHour, scansThisHour, setAnimatedHour)
  }, [totalScans, scansToday, scansThisHour, isMounted])

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Scan Analytics</h3>
        <div className="flex items-center space-x-2">
          {isLive && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">LIVE</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Scans */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Scans</p>
              <p className="text-2xl font-bold text-blue-900">
                {animatedTotal.toLocaleString()}
              </p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Today's Scans */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Today</p>
              <p className="text-2xl font-bold text-green-900">
                {animatedToday.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        {/* This Hour */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">This Hour</p>
              <p className="text-2xl font-bold text-purple-900">
                {animatedHour.toLocaleString()}
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Live Activity Indicator */}
      {isLive && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 font-medium">
              Real-time tracking active
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
