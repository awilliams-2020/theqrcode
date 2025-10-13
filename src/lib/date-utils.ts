import { formatDistanceToNow, format, parseISO } from 'date-fns'
import { enUS } from 'date-fns/locale'

/**
 * Format a date according to the user's timezone preference
 */
export function formatDateInTimezone(
  date: Date | string,
  timezone: string = 'UTC',
  formatString: string = 'PPpp'
): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    
    // Use Intl.DateTimeFormat for proper timezone handling
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    
    return formatter.format(dateObj)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

/**
 * Format a date as "time ago" (e.g., "2 hours ago") in user's timezone
 */
export function formatTimeAgoInTimezone(
  date: Date | string,
  timezone: string = 'UTC'
): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(dateObj, { 
      addSuffix: true,
      locale: enUS 
    })
  } catch (error) {
    console.error('Error formatting time ago:', error)
    return 'Unknown time'
  }
}

/**
 * Get a list of common timezones for the timezone selector
 */
export const COMMON_TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Kolkata', label: 'Mumbai/Delhi (IST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)' },
  { value: 'Australia/Perth', label: 'Perth (AWST)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)' },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)' },
  { value: 'America/Mexico_City', label: 'Mexico City (CST/CDT)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (ART)' },
]

/**
 * Convert a date to a specific timezone using the browser's Intl API
 */
export function convertToTimezone(date: Date, timezone: string): Date {
  try {
    // Create a new date with the timezone offset
    const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000)
    const targetTime = new Date(utcTime)
    
    // Get the timezone offset for the target timezone
    const targetOffset = new Date(targetTime.toLocaleString('en-US', { timeZone: timezone })).getTime() - new Date(targetTime.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()
    
    return new Date(targetTime.getTime() + targetOffset)
  } catch (error) {
    console.error('Error converting to timezone:', error)
    return date
  }
}

/**
 * Get current time in a specific timezone
 */
export function getCurrentTimeInTimezone(timezone: string): string {
  try {
    return new Date().toLocaleString('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  } catch (error) {
    console.error('Error getting current time in timezone:', error)
    return 'Invalid timezone'
  }
}
