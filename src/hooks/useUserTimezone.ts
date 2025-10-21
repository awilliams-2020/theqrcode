'use client'

import { useState, useEffect } from 'react'

// Global cache for timezone data to prevent multiple API calls
let timezoneCache: {
  data: string | null
  promise: Promise<string> | null
  fallback: string
  timestamp: number | null
} = {
  data: null,
  promise: null,
  fallback: 'UTC',
  timestamp: null
}

// Cache duration: 30 minutes (1800000 ms)
const CACHE_DURATION = 30 * 60 * 1000

// Helper function to check if cache is still valid
function isCacheValid(): boolean {
  if (!timezoneCache.data || !timezoneCache.timestamp) {
    return false
  }
  return Date.now() - timezoneCache.timestamp < CACHE_DURATION
}

/**
 * Hook to get the user's timezone preference
 * Falls back to browser timezone if user preference is not available
 * Uses global caching to prevent multiple API calls
 */
export function useUserTimezone(): string {
  const [timezone, setTimezone] = useState<string>(
    (timezoneCache.data && isCacheValid()) ? timezoneCache.data : timezoneCache.fallback
  )

  useEffect(() => {
    // If we already have valid cached data, use it immediately
    if (timezoneCache.data !== null && isCacheValid()) {
      setTimezone(timezoneCache.data)
      return
    }

    // If there's already a request in progress, wait for it
    if (timezoneCache.promise) {
      timezoneCache.promise.then(setTimezone).catch(() => {
        // Fallback to browser timezone on error
        const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        setTimezone(browserTimezone)
        timezoneCache.fallback = browserTimezone
      })
      return
    }

    // Create new request and cache the promise
    const fetchUserTimezone = async (): Promise<string> => {
      try {
        const response = await fetch('/api/user/timezone')
        if (response.ok) {
          const data = await response.json()
          const userTimezone = data.timezone || 'UTC'
          
          // Update cache with timestamp
          timezoneCache.data = userTimezone
          timezoneCache.timestamp = Date.now()
          timezoneCache.promise = null
          
          return userTimezone
        } else {
          // Fallback to browser timezone
          const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
          timezoneCache.data = browserTimezone
          timezoneCache.timestamp = Date.now()
          timezoneCache.promise = null
          timezoneCache.fallback = browserTimezone
          
          return browserTimezone
        }
      } catch (error) {
        console.error('Error fetching user timezone:', error)
        // Fallback to browser timezone
        const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        timezoneCache.data = browserTimezone
        timezoneCache.timestamp = Date.now()
        timezoneCache.promise = null
        timezoneCache.fallback = browserTimezone
        
        return browserTimezone
      }
    }

    timezoneCache.promise = fetchUserTimezone()
    
    timezoneCache.promise.then(setTimezone).catch(() => {
      // This shouldn't happen since fetchUserTimezone handles all errors
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      setTimezone(browserTimezone)
      timezoneCache.fallback = browserTimezone
    })
  }, [])

  return timezone
}

/**
 * Hook to get timezone with a default fallback
 * Uses the same global caching mechanism to prevent multiple API calls
 */
export function useUserTimezoneWithFallback(fallback: string = 'UTC'): string {
  const [timezone, setTimezone] = useState<string>(
    (timezoneCache.data && isCacheValid()) ? timezoneCache.data : fallback
  )

  useEffect(() => {
    // If we already have valid cached data, use it immediately
    if (timezoneCache.data !== null && isCacheValid()) {
      setTimezone(timezoneCache.data)
      return
    }

    // If there's already a request in progress, wait for it
    if (timezoneCache.promise) {
      timezoneCache.promise.then(setTimezone).catch(() => {
        // Fallback to provided fallback on error
        setTimezone(fallback)
        timezoneCache.fallback = fallback
      })
      return
    }

    // Create new request and cache the promise (reuse the same logic as useUserTimezone)
    const fetchUserTimezone = async (): Promise<string> => {
      try {
        const response = await fetch('/api/user/timezone')
        if (response.ok) {
          const data = await response.json()
          const userTimezone = data.timezone || fallback
          
          // Update cache with timestamp
          timezoneCache.data = userTimezone
          timezoneCache.timestamp = Date.now()
          timezoneCache.promise = null
          
          return userTimezone
        } else {
          // Fallback to provided fallback
          timezoneCache.data = fallback
          timezoneCache.timestamp = Date.now()
          timezoneCache.promise = null
          timezoneCache.fallback = fallback
          
          return fallback
        }
      } catch (error) {
        console.error('Error fetching user timezone:', error)
        // Fallback to provided fallback
        timezoneCache.data = fallback
        timezoneCache.timestamp = Date.now()
        timezoneCache.promise = null
        timezoneCache.fallback = fallback
        
        return fallback
      }
    }

    timezoneCache.promise = fetchUserTimezone()
    
    timezoneCache.promise.then(setTimezone).catch(() => {
      // This shouldn't happen since fetchUserTimezone handles all errors
      setTimezone(fallback)
      timezoneCache.fallback = fallback
    })
  }, [fallback])

  return timezone
}
