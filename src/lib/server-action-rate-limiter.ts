/**
 * In-memory rate limiter for Server Actions using Token Bucket algorithm
 * Tracks requests by IP address to prevent probing attacks
 * Allows bursts while maintaining overall rate limits
 * 
 * Best Practices Applied:
 * - Token Bucket algorithm allows legitimate user bursts
 * - Higher limits (60-100 req/min) for normal users
 * - Strict limits (5 req/min) for invalid action IDs (probing)
 * - Sliding window for sustained rate limiting
 */

interface TokenBucketEntry {
  tokens: number // Current number of tokens
  lastRefill: number // Last time tokens were refilled
  burstCount: number // Count of requests in current burst window
  burstWindowStart: number // Start of burst window
}

interface RateLimitConfig {
  // Token Bucket parameters
  capacity: number // Maximum tokens (burst capacity)
  refillRate: number // Tokens refilled per minute
  refillIntervalMs: number // How often to refill (e.g., every second)
  
  // Burst protection
  burstWindowMs: number // Time window for burst detection
  maxBurstRequests: number // Maximum requests allowed in burst window
  
  // Legacy fixed window (for strict limits)
  windowMs?: number // Time window in milliseconds
  maxRequests?: number // Maximum requests per window
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

export class ServerActionRateLimiter {
  /**
   * Default config for normal Server Actions
   * - Allows bursts of up to 20 requests quickly
   * - Sustained rate of 60 requests per minute
   * - Refills tokens every second (1 token per second = 60/min)
   */
  private static readonly DEFAULT_CONFIG: RateLimitConfig = {
    capacity: 20, // Allow burst of 20 requests
    refillRate: 1, // 1 token per second = 60 tokens per minute
    refillIntervalMs: 1000, // Refill every second
    burstWindowMs: 5 * 1000, // 5 second burst window
    maxBurstRequests: 20 // Max 20 requests in 5 seconds
  }

  /**
   * Strict config for invalid action IDs (probing attempts)
   * - Very low limits to prevent scanning
   * - Uses fixed window for simplicity
   */
  private static readonly STRICT_CONFIG: RateLimitConfig = {
    capacity: 5,
    refillRate: 0.083, // ~5 tokens per minute
    refillIntervalMs: 1000,
    burstWindowMs: 60 * 1000, // 1 minute window
    maxBurstRequests: 5,
    windowMs: 60 * 1000, // Fixed 1 minute window
    maxRequests: 5 // 5 requests per minute for invalid action IDs
  }

  // In-memory store: IP -> TokenBucketEntry
  private static store = new Map<string, TokenBucketEntry>()

  // Cleanup interval to prevent memory leaks
  private static cleanupInterval: NodeJS.Timeout | null = null

  /**
   * Initialize cleanup interval
   */
  static initialize(): void {
    if (this.cleanupInterval) return

    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Check rate limit for a given IP address using Token Bucket algorithm
   */
  static checkRateLimit(
    ipAddress: string,
    config: RateLimitConfig = this.DEFAULT_CONFIG
  ): RateLimitResult {
    const now = Date.now()
    let entry = this.store.get(ipAddress)

    // Use fixed window for strict config (simpler, more restrictive)
    if (config.windowMs && config.maxRequests) {
      return this.checkFixedWindow(ipAddress, config, now)
    }

    // Token Bucket algorithm for normal config
    if (!entry) {
      // First request - initialize bucket
      entry = {
        tokens: config.capacity - 1, // Use one token for this request
        lastRefill: now,
        burstCount: 1,
        burstWindowStart: now
      }
      this.store.set(ipAddress, entry)
      return {
        allowed: true,
        remaining: entry.tokens,
        resetTime: now + config.refillIntervalMs
      }
    }

    // Refill tokens based on time elapsed
    const timeSinceRefill = now - entry.lastRefill
    const tokensToAdd = Math.floor((timeSinceRefill / config.refillIntervalMs) * config.refillRate)
    
    if (tokensToAdd > 0) {
      entry.tokens = Math.min(config.capacity, entry.tokens + tokensToAdd)
      entry.lastRefill = now
    }

    // Check burst protection
    const timeSinceBurstStart = now - entry.burstWindowStart
    if (timeSinceBurstStart > config.burstWindowMs) {
      // Reset burst window
      entry.burstCount = 0
      entry.burstWindowStart = now
    }

    // Check if burst limit exceeded
    if (entry.burstCount >= config.maxBurstRequests) {
      const retryAfter = Math.ceil((config.burstWindowMs - timeSinceBurstStart) / 1000)
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.burstWindowStart + config.burstWindowMs,
        retryAfter
      }
    }

    // Check if tokens available
    if (entry.tokens < 1) {
      // Calculate when next token will be available
      const tokensNeeded = 1 - entry.tokens
      const waitTime = Math.ceil((tokensNeeded / config.refillRate) * config.refillIntervalMs)
      return {
        allowed: false,
        remaining: 0,
        resetTime: now + waitTime,
        retryAfter: Math.ceil(waitTime / 1000)
      }
    }

    // Consume token and increment burst count
    entry.tokens--
    entry.burstCount++
    this.store.set(ipAddress, entry)

    return {
      allowed: true,
      remaining: entry.tokens,
      resetTime: now + config.refillIntervalMs
    }
  }

  /**
   * Fixed window rate limiting (for strict config)
   */
  private static checkFixedWindow(
    ipAddress: string,
    config: RateLimitConfig,
    now: number
  ): RateLimitResult {
    interface FixedWindowEntry {
      count: number
      resetTime: number
      firstRequest: number
    }
    
    const entry = this.store.get(ipAddress) as FixedWindowEntry | undefined
    const windowMs = config.windowMs || 60000
    const maxRequests = config.maxRequests || 5
    
    if (!entry || now > entry.resetTime) {
      const newEntry: FixedWindowEntry = {
        count: 1,
        resetTime: now + windowMs,
        firstRequest: now
      }
      this.store.set(ipAddress, newEntry as TokenBucketEntry)
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: newEntry.resetTime
      }
    }

    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      }
    }

    entry.count++
    this.store.set(ipAddress, entry as TokenBucketEntry)

    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime
    }
  }

  /**
   * Check rate limit with strict config (for invalid action IDs)
   */
  static checkStrictRateLimit(ipAddress: string): RateLimitResult {
    return this.checkRateLimit(ipAddress, this.STRICT_CONFIG)
  }

  /**
   * Get current rate limit status for an IP
   */
  static getStatus(ipAddress: string, config: RateLimitConfig = this.DEFAULT_CONFIG): {
    tokens: number
    capacity: number
    resetTime: number
    remaining: number
    burstCount: number
    maxBurst: number
  } {
    const entry = this.store.get(ipAddress)
    const now = Date.now()

    if (!entry) {
      return {
        tokens: config.capacity,
        capacity: config.capacity,
        resetTime: now + config.refillIntervalMs,
        remaining: config.capacity,
        burstCount: 0,
        maxBurst: config.maxBurstRequests
      }
    }

    // Refill tokens if needed
    const timeSinceRefill = now - entry.lastRefill
    const tokensToAdd = Math.floor((timeSinceRefill / config.refillIntervalMs) * config.refillRate)
    const currentTokens = Math.min(config.capacity, entry.tokens + tokensToAdd)

    return {
      tokens: currentTokens,
      capacity: config.capacity,
      resetTime: entry.lastRefill + config.refillIntervalMs,
      remaining: currentTokens,
      burstCount: entry.burstCount,
      maxBurst: config.maxBurstRequests
    }
  }

  /**
   * Clean up expired entries
   * For Token Bucket: remove entries that haven't been used in 10 minutes
   * For Fixed Window: remove entries past their reset time
   */
  private static cleanup(): void {
    const now = Date.now()
    const expiredKeys: string[] = []
    const maxIdleTime = 10 * 60 * 1000 // 10 minutes

    for (const [key, entry] of this.store.entries()) {
      // Check if entry is expired
      // TokenBucketEntry has lastRefill, FixedWindowEntry has resetTime
      const lastActivity = entry.lastRefill || ('resetTime' in entry ? entry.resetTime : 0)
      const timeSinceActivity = now - lastActivity
      
      // Remove if idle for too long or past reset time
      if (timeSinceActivity > maxIdleTime || 
          ('resetTime' in entry && now > entry.resetTime)) {
        expiredKeys.push(key)
      }
    }

    for (const key of expiredKeys) {
      this.store.delete(key)
    }

    // Log cleanup if there were expired entries
    if (expiredKeys.length > 0) {
      console.log(`[ServerActionRateLimiter] Cleaned up ${expiredKeys.length} expired rate limit entries`)
    }
  }

  /**
   * Reset rate limit for a specific IP (useful for testing or manual intervention)
   */
  static reset(ipAddress: string): void {
    this.store.delete(ipAddress)
  }

  /**
   * Get all active rate limit entries (for monitoring/debugging)
   */
  static getActiveEntries(): Array<{ 
    ip: string
    tokens?: number
    count?: number
    burstCount?: number
    resetTime: number
  }> {
    const now = Date.now()
    const active: Array<{ 
      ip: string
      tokens?: number
      count?: number
      burstCount?: number
      resetTime: number
    }> = []

    for (const [ip, entry] of this.store.entries()) {
      // Determine reset time based on entry type
      const resetTime = 'resetTime' in entry 
        ? entry.resetTime 
        : (entry.lastRefill + this.DEFAULT_CONFIG.refillIntervalMs)
      
      const lastActivity = entry.lastRefill || ('resetTime' in entry ? entry.resetTime : 0)
      const isActive = now <= resetTime || (lastActivity && (now - lastActivity) < 10 * 60 * 1000)
      
      if (isActive) {
        active.push({
          ip,
          tokens: 'tokens' in entry ? entry.tokens : undefined,
          count: 'count' in entry ? entry.count : undefined,
          burstCount: 'burstCount' in entry ? entry.burstCount : undefined,
          resetTime
        })
      }
    }

    return active
  }
}

// Initialize cleanup on module load
if (typeof window === 'undefined') {
  ServerActionRateLimiter.initialize()
}

