'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to get the user's timezone preference
 * Falls back to browser timezone if user preference is not available
 */
export function useUserTimezone(): string {
  const [timezone, setTimezone] = useState<string>('UTC')

  useEffect(() => {
    // Try to get user's saved timezone preference
    const fetchUserTimezone = async () => {
      try {
        const response = await fetch('/api/user/timezone')
        if (response.ok) {
          const data = await response.json()
          setTimezone(data.timezone || 'UTC')
        } else {
          // Fallback to browser timezone
          setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
        }
      } catch (error) {
        console.error('Error fetching user timezone:', error)
        // Fallback to browser timezone
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
      }
    }

    fetchUserTimezone()
  }, [])

  return timezone
}

/**
 * Hook to get timezone with a default fallback
 */
export function useUserTimezoneWithFallback(fallback: string = 'UTC'): string {
  const [timezone, setTimezone] = useState<string>(fallback)

  useEffect(() => {
    const fetchUserTimezone = async () => {
      try {
        const response = await fetch('/api/user/timezone')
        if (response.ok) {
          const data = await response.json()
          setTimezone(data.timezone || fallback)
        } else {
          setTimezone(fallback)
        }
      } catch (error) {
        console.error('Error fetching user timezone:', error)
        setTimezone(fallback)
      }
    }

    fetchUserTimezone()
  }, [fallback])

  return timezone
}
