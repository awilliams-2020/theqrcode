/**
 * Redis client for QR code cache
 * Connects to Redis instance from infrastructure
 * Falls back gracefully if Redis is unavailable
 */

import Redis from 'ioredis'
import { logger } from './logger'

let redisClient: Redis | null = null
let redisAvailable = false

/**
 * Initialize Redis connection
 */
export function initRedis(): void {
  const redisHost = process.env.REDIS_HOST || 'redis'
  const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10)
  const redisPassword = process.env.REDIS_PASSWORD || undefined
  const redisDb = parseInt(process.env.REDIS_DB || '0', 10)

  try {
    redisClient = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      db: redisDb,
      retryStrategy: (times) => {
        // Retry with exponential backoff, max 5 seconds
        const delay = Math.min(times * 50, 5000)
        return delay
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
      connectTimeout: 5000,
      commandTimeout: 5000,
    })

    redisClient.on('connect', () => {
      logger.info('SYSTEM', 'Redis connection established', {
        host: redisHost,
        port: redisPort,
        db: redisDb
      })
      redisAvailable = true
    })

    redisClient.on('ready', () => {
      logger.info('SYSTEM', 'Redis client ready', {
        host: redisHost,
        port: redisPort
      })
      redisAvailable = true
    })

    redisClient.on('error', (error) => {
      logger.logError(error, 'SYSTEM', 'Redis connection error', {
        host: redisHost,
        port: redisPort
      })
      redisAvailable = false
    })

    redisClient.on('close', () => {
      logger.warn('SYSTEM', 'Redis connection closed', {
        host: redisHost,
        port: redisPort
      })
      redisAvailable = false
    })

    // Attempt to connect
    redisClient.connect().catch((error) => {
      logger.logError(error, 'SYSTEM', 'Failed to connect to Redis, will use in-memory fallback', {
        host: redisHost,
        port: redisPort
      })
      redisAvailable = false
    })
  } catch (error) {
    logger.logError(error, 'SYSTEM', 'Failed to initialize Redis client, will use in-memory fallback')
    redisAvailable = false
  }
}

/**
 * Get Redis client (may be null if unavailable)
 */
export function getRedisClient(): Redis | null {
  return redisClient
}

/**
 * Check if Redis is available
 */
export function isRedisAvailable(): boolean {
  return redisAvailable && redisClient !== null && redisClient.status === 'ready'
}

/**
 * Gracefully close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.quit()
      logger.info('SYSTEM', 'Redis connection closed gracefully')
    } catch (error) {
      logger.logError(error, 'SYSTEM', 'Error closing Redis connection')
    } finally {
      redisClient = null
      redisAvailable = false
    }
  }
}

// Initialize Redis on module load (server-side only)
if (typeof window === 'undefined') {
  initRedis()
}
