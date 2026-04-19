/**
 * IP-based rate limiter for public endpoints.
 *
 * Primary path  — Redis (shared across instances, survives restarts):
 *   - Sliding window:  100 req / 1 hr  per fingerprint (IP + UA hash)
 *   - Burst window:     20 req / 60 s  per fingerprint
 *   - Violation track:  3 hourly-limit hits in 24 hr → 24 hr block
 *
 * Fallback path — in-memory (used only when Redis is unavailable):
 *   - Simpler fixed-window, 100 req / 1 hr per IP only
 *   - Fails closed on memory pressure (denies rather than allows)
 */

import { createHash } from 'crypto'
import { getRedisClient, isRedisAvailable } from './redis'
import { logger } from './logger'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HOUR_MS          = 60 * 60 * 1000
const HOUR_S           = 60 * 60
const BURST_WINDOW_S   = 60
const HOURLY_LIMIT     = 100
const BURST_LIMIT      = 20
const VIOLATION_LIMIT  = 3
const BLOCK_TTL_S      = 24 * 60 * 60   // 24 hours
const VIOLATION_TTL_S  = 24 * 60 * 60

// In-memory fallback constants
const MAX_STORE_SIZE   = 10_000

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  allowed:     boolean
  remaining:   number
  resetTime:   number   // unix ms
  retryAfter?: number   // seconds
  blocked?:    boolean  // true when on the hard block list
}

// ---------------------------------------------------------------------------
// Fingerprint helper
// ---------------------------------------------------------------------------

/**
 * Build a stable rate-limit key from IP + User-Agent.
 * Hashing the UA keeps Redis keys short while still differentiating clients
 * that rotate IPs but keep the same software fingerprint.
 */
export function buildFingerprint(ip: string, userAgent: string): string {
  const uaHash = createHash('md5').update(userAgent).digest('hex').slice(0, 8)
  return `${ip}:${uaHash}`
}

// ---------------------------------------------------------------------------
// Redis key helpers
// ---------------------------------------------------------------------------

const key = {
  sliding:    (fp: string) => `rl:pub:sliding:${fp}`,
  burst:      (fp: string) => `rl:pub:burst:${fp}`,
  violations: (ip: string) => `rl:pub:violations:${ip}`,
  blocked:    (ip: string) => `rl:pub:blocked:${ip}`,
}

// ---------------------------------------------------------------------------
// Redis path
// ---------------------------------------------------------------------------

async function redisCheckRateLimit(
  fingerprint: string,
  ip: string
): Promise<RateLimitResult> {
  const redis = getRedisClient()!
  const now   = Date.now()

  // 1. Hard block list — instant reject
  const blocked = await redis.exists(key.blocked(ip))
  if (blocked) {
    const ttl = await redis.ttl(key.blocked(ip))
    logger.warn('PUBLIC-RL', 'Blocked IP attempted request', { ip, ttlRemaining: ttl })
    return {
      allowed:    false,
      remaining:  0,
      resetTime:  now + ttl * 1000,
      retryAfter: ttl > 0 ? ttl : BLOCK_TTL_S,
      blocked:    true,
    }
  }

  // 2. Burst check — 20 req / 60 s
  const burstKey   = key.burst(fingerprint)
  const burstCount = await redis.incr(burstKey)
  if (burstCount === 1) {
    await redis.expire(burstKey, BURST_WINDOW_S)
  }
  if (burstCount > BURST_LIMIT) {
    const burstTtl = await redis.ttl(burstKey)
    logger.warn('PUBLIC-RL', 'Burst limit exceeded', { ip, fingerprint, burstCount })
    return {
      allowed:    false,
      remaining:  0,
      resetTime:  now + burstTtl * 1000,
      retryAfter: burstTtl > 0 ? burstTtl : BURST_WINDOW_S,
    }
  }

  // 3. Sliding window — 100 req / 1 hr
  const slidingKey  = key.sliding(fingerprint)
  const windowStart = now - HOUR_MS
  const member      = `${now}-${Math.random().toString(36).slice(2)}`

  const pipeline = redis.pipeline()
  pipeline.zremrangebyscore(slidingKey, 0, windowStart) // evict expired members
  pipeline.zadd(slidingKey, now, member)                // add this request
  pipeline.zcard(slidingKey)                            // count in window
  pipeline.expire(slidingKey, HOUR_S)                   // keep key alive
  const results = await pipeline.exec()

  // results[2] = [error, count]
  const count = (results?.[2]?.[1] as number) ?? (HOURLY_LIMIT + 1)

  if (count > HOURLY_LIMIT) {
    await recordViolation(ip, now)

    // Use oldest member score to calculate accurate reset time
    const oldest = await redis.zrange(slidingKey, 0, 0, 'WITHSCORES')
    const resetTime = oldest.length >= 2
      ? parseInt(oldest[1], 10) + HOUR_MS
      : now + HOUR_MS

    logger.warn('PUBLIC-RL', 'Hourly limit exceeded', { ip, fingerprint, count })
    return {
      allowed:    false,
      remaining:  0,
      resetTime,
      retryAfter: Math.ceil((resetTime - now) / 1000),
    }
  }

  return {
    allowed:   true,
    remaining: Math.max(0, HOURLY_LIMIT - count),
    resetTime: now + HOUR_MS,
  }
}

async function recordViolation(ip: string, now: number): Promise<void> {
  const redis      = getRedisClient()!
  const vKey       = key.violations(ip)
  const violations = await redis.incr(vKey)

  if (violations === 1) {
    await redis.expire(vKey, VIOLATION_TTL_S)
  }

  if (violations >= VIOLATION_LIMIT) {
    const alreadyBlocked = await redis.exists(key.blocked(ip))
    if (!alreadyBlocked) {
      await redis.setex(key.blocked(ip), BLOCK_TTL_S, '1')
      logger.warn('PUBLIC-RL', 'IP added to block list after repeated violations', {
        ip,
        violations,
        blockedUntil: new Date(now + BLOCK_TTL_S * 1000).toISOString(),
      })
    }
  }
}

// ---------------------------------------------------------------------------
// In-memory fallback
// ---------------------------------------------------------------------------

interface MemEntry {
  count:        number
  resetTime:    number
  lastAccessed: number
}

const memStore = new Map<string, MemEntry>()
let memCleanupTimer: ReturnType<typeof setInterval> | null = null

function memCheckRateLimit(ip: string): RateLimitResult {
  const now = Date.now()

  // Fail closed on memory pressure — deny rather than allow
  if (!memStore.has(ip) && memStore.size >= MAX_STORE_SIZE) {
    evictMemEntries()
    if (memStore.size >= MAX_STORE_SIZE) {
      logger.warn('PUBLIC-RL', 'In-memory store full, failing closed', { ip })
      return { allowed: false, remaining: 0, resetTime: now + HOUR_MS, retryAfter: 60 }
    }
  }

  const entry = memStore.get(ip)

  if (!entry || now > entry.resetTime) {
    memStore.set(ip, { count: 1, resetTime: now + HOUR_MS, lastAccessed: now })
    return { allowed: true, remaining: HOURLY_LIMIT - 1, resetTime: now + HOUR_MS }
  }

  entry.lastAccessed = now

  if (entry.count >= HOURLY_LIMIT) {
    logger.warn('PUBLIC-RL', 'Hourly limit exceeded (in-memory fallback)', { ip, count: entry.count })
    return {
      allowed:    false,
      remaining:  0,
      resetTime:  entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    }
  }

  entry.count++
  return {
    allowed:   true,
    remaining: HOURLY_LIMIT - entry.count,
    resetTime: entry.resetTime,
  }
}

function evictMemEntries(): void {
  const entries = Array.from(memStore.entries())
  entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)
  const evictCount = Math.max(100, Math.floor(memStore.size * 0.1))
  for (const [k] of entries.slice(0, evictCount)) {
    memStore.delete(k)
  }
}

function startMemCleanup(): void {
  if (memCleanupTimer) return
  memCleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [k, v] of memStore.entries()) {
      if (now > v.resetTime) memStore.delete(k)
    }
    if (memStore.size > MAX_STORE_SIZE * 0.8) evictMemEntries()
  }, 5 * 60 * 1000)
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export class PublicRateLimiter {
  /**
   * Check rate limit for a request.
   *
   * @param fingerprint  Composite key from buildFingerprint(ip, ua)
   * @param ip           Raw IP (used separately for block list / violation tracking)
   */
  static async check(fingerprint: string, ip: string): Promise<RateLimitResult> {
    if (isRedisAvailable()) {
      try {
        return await redisCheckRateLimit(fingerprint, ip)
      } catch (err) {
        logger.logError(err, 'PUBLIC-RL', 'Redis rate limit check failed, falling back to in-memory')
      }
    }
    return memCheckRateLimit(ip)
  }

  /** Check whether an IP is on the hard block list (without counting a request). */
  static async isBlocked(ip: string): Promise<boolean> {
    if (!isRedisAvailable()) return false
    try {
      return (await getRedisClient()!.exists(key.blocked(ip))) === 1
    } catch {
      return false
    }
  }

  /** Remove an IP from the block list (admin / support use). */
  static async unblock(ip: string): Promise<void> {
    if (!isRedisAvailable()) return
    await getRedisClient()!.del(key.blocked(ip), key.violations(ip))
  }

  /** Reset all rate limit state for a fingerprint + IP (testing). */
  static async reset(fingerprint: string, ip: string): Promise<void> {
    memStore.delete(ip)
    if (!isRedisAvailable()) return
    const redis = getRedisClient()!
    await redis.del(
      key.sliding(fingerprint),
      key.burst(fingerprint),
      key.violations(ip),
      key.blocked(ip),
    )
  }

  static getMemStats() {
    return { size: memStore.size, maxSize: MAX_STORE_SIZE }
  }
}

// Start in-memory cleanup on server side
if (typeof window === 'undefined') {
  startMemCleanup()
}
