/**
 * Temporary QR code cache for public API
 * Stores QR code images with short codes for shareable URLs
 * Uses Redis for persistence, falls back to in-memory if Redis unavailable
 * Auto-expires after 24 hours
 */

import { getRedisClient, isRedisAvailable } from './redis'
import { logger } from './logger'

interface CachedQRCode {
  imageData: string // Base64 image data
  type: string
  content: string
  createdAt: number
  expiresAt: number
}

export class QRCache {
  private static readonly TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
  private static readonly TTL_SECONDS = 24 * 60 * 60 // 24 hours in seconds
  private static readonly CLEANUP_INTERVAL = 5 * 60 * 1000 // 5 minutes
  private static readonly REDIS_KEY_PREFIX = 'qr:cache:'
  private static cache = new Map<string, CachedQRCode>() // Fallback in-memory cache
  private static cleanupInterval: NodeJS.Timeout | null = null

  /**
   * Initialize cleanup interval (only needed for in-memory fallback)
   */
  static initialize(): void {
    if (this.cleanupInterval) return

    // Only run cleanup if Redis is not available
    this.cleanupInterval = setInterval(() => {
      if (!isRedisAvailable()) {
        this.cleanup()
      }
    }, this.CLEANUP_INTERVAL)
  }

  /**
   * Generate a short code for the QR code
   */
  private static generateShortCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  /**
   * Store QR code and return short code
   */
  static async store(imageData: string, type: string, content: string): Promise<string> {
    const now = Date.now()
    const code = this.generateShortCode()
    
    const cachedData: CachedQRCode = {
      imageData,
      type,
      content,
      createdAt: now,
      expiresAt: now + this.TTL_MS
    }

    // Try Redis first
    if (isRedisAvailable()) {
      try {
        const redis = getRedisClient()
        if (redis) {
          const key = `${this.REDIS_KEY_PREFIX}${code}`
          await redis.setex(key, this.TTL_SECONDS, JSON.stringify(cachedData))
          logger.debug('PUBLIC-API', 'QR code stored in Redis', { code })
          return code
        }
      } catch (error) {
        logger.logError(error, 'PUBLIC-API', 'Failed to store QR code in Redis, falling back to memory', { code })
      }
    }

    // Fallback to in-memory cache
    this.cache.set(code, cachedData)
    logger.debug('PUBLIC-API', 'QR code stored in memory cache', { code })
    return code
  }

  /**
   * Retrieve QR code by short code
   */
  static async get(code: string): Promise<CachedQRCode | null> {
    // Try Redis first
    if (isRedisAvailable()) {
      try {
        const redis = getRedisClient()
        if (redis) {
          const key = `${this.REDIS_KEY_PREFIX}${code}`
          const data = await redis.get(key)
          
          if (data) {
            const cached = JSON.parse(data) as CachedQRCode
            logger.debug('PUBLIC-API', 'QR code retrieved from Redis', { code })
            return cached
          }
          
          return null
        }
      } catch (error) {
        logger.logError(error, 'PUBLIC-API', 'Failed to retrieve QR code from Redis, falling back to memory', { code })
      }
    }

    // Fallback to in-memory cache
    const cached = this.cache.get(code)
    
    if (!cached) {
      return null
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(code)
      return null
    }

    logger.debug('PUBLIC-API', 'QR code retrieved from memory cache', { code })
    return cached
  }

  /**
   * Clean up expired entries
   */
  private static cleanup(): void {
    const now = Date.now()
    const expiredCodes: string[] = []

    for (const [code, cached] of this.cache.entries()) {
      if (now > cached.expiresAt) {
        expiredCodes.push(code)
      }
    }

    for (const code of expiredCodes) {
      this.cache.delete(code)
    }

    if (expiredCodes.length > 0) {
      logger.info('PUBLIC-API', 'QRCache cleaned up expired QR codes', { count: expiredCodes.length })
    }
  }

  /**
   * Get cache statistics
   */
  static async getStats(): Promise<{
    size: number
    maxSize: number
    storage: 'redis' | 'memory'
  }> {
    if (isRedisAvailable()) {
      try {
        const redis = getRedisClient()
        if (redis) {
          const keys = await redis.keys(`${this.REDIS_KEY_PREFIX}*`)
          return {
            size: keys.length,
            maxSize: 100000, // Redis can handle much more
            storage: 'redis'
          }
        }
      } catch (error) {
        logger.logError(error, 'PUBLIC-API', 'Failed to get Redis stats, falling back to memory stats')
      }
    }

    return {
      size: this.cache.size,
      maxSize: 10000, // Reasonable limit for in-memory
      storage: 'memory'
    }
  }
}

// Initialize cleanup on module load
if (typeof window === 'undefined') {
  QRCache.initialize()
}
