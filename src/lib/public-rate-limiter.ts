/**
 * Simple IP-based rate limiter for public endpoints
 * Uses in-memory storage with fixed window algorithm
 * 
 * Memory Safety:
 * - Maximum 10,000 entries (prevents unbounded growth)
 * - LRU eviction when limit reached (removes oldest entries)
 * - Aggressive cleanup every 5 minutes
 * - Falls back to allowing requests if memory constrained
 */

import { logger } from './logger'

interface RateLimitEntry {
  count: number
  resetTime: number
  lastAccessed: number // For LRU eviction
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

export class PublicRateLimiter {
  private static readonly DEFAULT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
  private static readonly DEFAULT_MAX_REQUESTS = 100 // 100 requests per hour
  private static readonly MAX_STORE_SIZE = 10000 // Maximum entries to prevent memory exhaustion
  private static store = new Map<string, RateLimitEntry>()
  private static cleanupInterval: NodeJS.Timeout | null = null
  private static memoryWarningLogged = false

  /**
   * Initialize cleanup interval
   */
  static initialize(): void {
    if (this.cleanupInterval) return

    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000) // Clean up every 5 minutes
  }

  /**
   * Check rate limit for an IP address
   */
  static checkRateLimit(
    ipAddress: string,
    maxRequests: number = this.DEFAULT_MAX_REQUESTS,
    windowMs: number = this.DEFAULT_WINDOW_MS
  ): RateLimitResult {
    const now = Date.now()
    const entry = this.store.get(ipAddress)

    // Check if we need to evict entries before adding new ones
    if (!entry && this.store.size >= this.MAX_STORE_SIZE) {
      this.evictOldestEntries()
      
      // If still at limit after eviction, allow request but log warning
      if (this.store.size >= this.MAX_STORE_SIZE) {
        if (!this.memoryWarningLogged) {
          logger.warn('API', 'Public rate limiter store size limit reached', {
            component: 'PublicRateLimiter',
            action: 'memory_limit_reached',
            maxSize: this.MAX_STORE_SIZE,
            currentSize: this.store.size,
            ipAddress
          })
          this.memoryWarningLogged = true
        }
        // Fail open: allow request when memory constrained
        return {
          allowed: true,
          remaining: maxRequests,
          resetTime: now + windowMs
        }
      }
    }

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + windowMs,
        lastAccessed: now
      }
      this.store.set(ipAddress, newEntry)
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: newEntry.resetTime
      }
    }

    if (entry.count >= maxRequests) {
      // Log rate limit exceeded
      logger.warn('API', 'Rate limit exceeded for public API', {
        component: 'PublicRateLimiter',
        action: 'rate_limit_exceeded',
        ipAddress,
        requestCount: entry.count,
        maxRequests,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      })
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      }
    }

    entry.count++
    entry.lastAccessed = now // Update access time for LRU
    this.store.set(ipAddress, entry)

    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime
    }
  }

  /**
   * Evict oldest entries when store is full
   * Removes 10% of oldest entries (by lastAccessed time)
   */
  private static evictOldestEntries(): void {
    if (this.store.size < this.MAX_STORE_SIZE) return

    const entries = Array.from(this.store.entries())
    // Sort by lastAccessed (oldest first)
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)
    
    // Remove 10% of oldest entries (or at least 100 entries)
    const evictCount = Math.max(100, Math.floor(this.store.size * 0.1))
    const toEvict = entries.slice(0, evictCount)
    
    for (const [key] of toEvict) {
      this.store.delete(key)
    }

    if (toEvict.length > 0) {
      logger.info('API', 'Evicted oldest rate limit entries', {
        component: 'PublicRateLimiter',
        action: 'evict_entries',
        evictedCount: toEvict.length,
        storeSize: this.store.size,
        maxSize: this.MAX_STORE_SIZE
      })
      this.memoryWarningLogged = false // Reset warning after cleanup
    }
  }

  /**
   * Clean up expired entries
   * Also evicts oldest entries if store is getting large
   */
  private static cleanup(): void {
    const now = Date.now()
    const expiredKeys: string[] = []

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        expiredKeys.push(key)
      }
    }

    for (const key of expiredKeys) {
      this.store.delete(key)
    }

    // If store is still large after cleanup, evict oldest entries
    // Use 80% threshold to be proactive
    if (this.store.size > this.MAX_STORE_SIZE * 0.8) {
      this.evictOldestEntries()
    }

    // Log store size periodically for monitoring
    if (this.store.size > 0 && this.store.size % 1000 === 0) {
      logger.info('API', 'Public rate limiter store size check', {
        component: 'PublicRateLimiter',
        action: 'periodic_cleanup',
        storeSize: this.store.size,
        maxSize: this.MAX_STORE_SIZE,
        expiredEntriesRemoved: expiredKeys.length
      })
    }
  }

  /**
   * Get current store statistics (for monitoring)
   */
  static getStats(): {
    size: number
    maxSize: number
    utilizationPercent: number
  } {
    return {
      size: this.store.size,
      maxSize: this.MAX_STORE_SIZE,
      utilizationPercent: Math.round((this.store.size / this.MAX_STORE_SIZE) * 100)
    }
  }

  /**
   * Reset rate limit for a specific IP (useful for testing)
   */
  static reset(ipAddress: string): void {
    this.store.delete(ipAddress)
  }
}

// Initialize cleanup on module load
if (typeof window === 'undefined') {
  PublicRateLimiter.initialize()
}
