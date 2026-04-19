# Dev Plan + MCP/API Architecture Plan

## Overview

Three workstreams:
1. **Developer Plan** — new paid tier ($15–19/mo), API-first, minimal dashboard, primary MCP target
2. **Authenticated MCP** — API key auth for Dev and Pro users, tiered limits and tools
3. **Public MCP hardening** — harden the free public tier against abuse

---

## Current State

| Layer | How it works today |
|---|---|
| Public rate limiter | In-memory `Map`, IP-based, 100 req/hr, resets on process restart, no cross-instance sharing |
| MCP server | Standalone Express at `mcp.theqrcode.io`, calls `/api/public/qr-codes`, zero auth |
| API keys | DB-backed, `environment: production\|sandbox`, `rateLimit: Int`, `permissions: String[]` |
| API auth | `authenticateApiRequest()` → `ApiKeyManager.validateApiKey()` → DB `ApiUsage` table |
| Plans | `free`, `starter`, `pro` — only `pro` gets API key access |

**Core problems:**
- MCP has no concept of who is calling it — IP rate limiting is trivially bypassed by VPN/proxy
- In-memory rate limiter doesn't survive restarts and isn't shared across multiple instances
- No monetisation path for heavy MCP users (they get a free ride indefinitely)
- Dev/builder use case is unserved — Pro is dashboard-first, not API-first

---

## 1. Developer Plan

### Positioning

| | Free | Starter ($9) | **Developer ($19)** | Pro ($29) |
|---|---|---|---|---|
| **Primary user** | Casual | Small biz | Builders / integrators | Growing companies |
| **Dashboard** | Basic | Full | Minimal (API-focused) | Full |
| **Analytics** | Basic | Advanced | Usage metrics only | Real-time, full |
| **QR codes** | 10 | 100 | 500 | 500 |
| **Scans/mo** | 1K | 10K | 50K | 500K |
| **API access** | No | No | Yes — primary feature | Yes — bonus feature |
| **MCP access** | Public (shared) | Public (shared) | Authenticated (high limits) | Authenticated (moderate) |
| **API rate limit** | — | — | 2,000 req/hr | 500 req/hr |
| **MCP rate limit** | 100/hr IP-shared | 100/hr IP-shared | 2,000/hr per key | 500/hr per key |
| **MCP tools** | `generate_qr_code` | `generate_qr_code` | `generate_qr_code`, `list_qr_codes`, `get_analytics` | `generate_qr_code` |
| **QR types via API** | url, text, wifi, contact | — | + email, dynamic | + email, dynamic |
| **Scan data stored** | Yes | Yes | Optional (can disable) | Yes |
| **Sandbox keys** | No | No | Yes | Yes |

### Why cheaper than Pro despite higher API limits

- **No analytics rendering** — the Pro dashboard hits the `Scan` table constantly (device breakdowns, geo maps, time-series). Dev users only see aggregate counts.
- **Scan storage is optional** — a Dev user building a generator doesn't need scan tracking. Disabling it cuts write load.
- **No UI overhead** — dashboard-level features (bulk edit, folders, display pages, share pages) aren't included.
- **API is the product** — simpler to operate than a full SaaS UI.

### Developer Dashboard (minimal)

Route: `/dashboard/developer` (or redirect `/dashboard` for Dev plan users to this view)

**Sections:**

```
┌─────────────────────────────────────────┐
│  API Keys                               │
│  [+ Create Key]  [production] [sandbox] │
│  key name | prefix | last used | revoke │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Usage This Month                       │
│  ████████░░  1,247 / 2,000 req/hr limit │
│  API calls: 14,302  |  MCP calls: 892   │
│  QR codes created: 47 / 500             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  MCP Configuration                      │
│  [Copy config snippet]                  │
│  Shows Bearer token config for          │
│  Claude Desktop / Cursor / Windsurf     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Quick Docs                             │
│  Base URL | Auth | Endpoints | Examples │
└─────────────────────────────────────────┘
```

No scan maps, no real-time feeds, no conversion funnels.

---

## 2. Authenticated MCP

### How auth works

The MCP server accepts an API key in the `Authorization` header. When present, it routes to the authenticated v1 API instead of the public endpoint. QR codes get saved to the user's account, usage is tracked per key, and higher limits apply.

**User config (Claude Desktop / Cursor / Windsurf):**

```json
{
  "mcpServers": {
    "theqrcode": {
      "url": "https://mcp.theqrcode.io/mcp",
      "headers": {
        "Authorization": "Bearer tqc_sk_live_..."
      }
    }
  }
}
```

Public (no header) continues to work at the current 100 req/hr IP-limited rate.

### MCP Server changes (`mcp-server/src/index.ts`)

**Auth extraction:**

```typescript
function extractApiKey(req: Request): string | null {
  const auth = req.headers['authorization'] as string | undefined
  if (auth?.startsWith('Bearer ')) return auth.slice(7)
  return null
}
```

**Per-request routing:**

```typescript
async function handleMcp(req: Request, res: Response): Promise<void> {
  const apiKey = extractApiKey(req)
  const server = createServer(apiKey ?? null)  // pass key into factory
  // ... rest unchanged
}
```

**Factory receives key and configures tools accordingly:**

```typescript
function createServer(apiKey: string | null): McpServer {
  const server = new McpServer({ name: 'theqrcode-mcp', version: '1.0.0' })
  const isAuthenticated = apiKey !== null

  // Always register generate_qr_code
  server.tool('generate_qr_code', ..., async (params) => {
    const endpoint = isAuthenticated
      ? `${API_BASE}/api/v1/qr-codes`        // saves to account, uses key rate limit
      : `${API_BASE}/api/public/qr-codes`    // ephemeral, IP rate limited

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (isAuthenticated) headers['Authorization'] = `Bearer ${apiKey}`

    const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
    // ... handle response
  })

  // Only register extended tools for authenticated users
  // The MCP server validates the key and checks the plan before registering
  // (or registers them but they return 403 — simpler approach)
  if (isAuthenticated) {
    server.tool('list_qr_codes', ..., async ({ page, limit }) => {
      const res = await fetch(`${API_BASE}/api/v1/qr-codes?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      })
      // ...
    })

    server.tool('get_analytics', ..., async ({ qrCodeId, timeRange }) => {
      const res = await fetch(`${API_BASE}/api/v1/analytics?qrCodeId=${qrCodeId}&timeRange=${timeRange}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      })
      // ...
    })
  }

  return server
}
```

**MCP rate limits are enforced by the v1 API** — the existing `authenticateApiRequest()` + `ApiUsage` DB path already handles this. The MCP server doesn't need its own rate limit logic.

### MCP tool matrix

| Tool | Public | Dev | Pro |
|---|---|---|---|
| `generate_qr_code` | Yes (ephemeral, 24hr URL) | Yes (saved to account) | Yes (saved to account) |
| `list_qr_codes` | No | Yes | No |
| `get_analytics` | No | Yes | No |

**Rate limits by path:**

| Path | Limit |
|---|---|
| Public `/api/public/qr-codes` | 100/hr per IP (enforced in `PublicRateLimiter`) |
| Dev API key | 2,000/hr per key (enforced in `ApiUsage` + `RateLimiter`) |
| Pro API key | 500/hr per key |

Rate limits on API keys are stored in `ApiKey.rateLimit` — already wired. Dev keys get `rateLimit: 2000`, Pro keys get `rateLimit: 500` at creation time.

---

## 3. Public MCP / API Hardening

### Problems with the current in-memory rate limiter

1. **No cross-instance sharing** — two Next.js instances (or a restart) give an attacker a fresh 100-request window
2. **IP-only fingerprint** — trivially bypassed with VPN, Tor, or rotating residential proxies
3. **Fails open on memory pressure** — the `MAX_STORE_SIZE` fallback allows requests when the store is full
4. **No burst detection** — 100 requests spread over an hour vs 100 in 10 seconds look the same

### Hardening plan

#### A. Move to Redis-backed rate limiting

Replace `PublicRateLimiter` (in-memory `Map`) with a Redis sliding window counter. This survives restarts and works across multiple instances.

```typescript
// lib/public-rate-limiter.ts — new implementation
import { redis } from './redis'  // existing or new Redis client

export class PublicRateLimiter {
  static async checkRateLimit(ip: string): Promise<RateLimitResult> {
    const key = `rl:pub:${ip}`
    const now = Date.now()
    const windowMs = 60 * 60 * 1000  // 1 hour
    const limit = 100

    // Sliding window using sorted set
    const pipeline = redis.pipeline()
    pipeline.zremrangebyscore(key, 0, now - windowMs)  // remove expired
    pipeline.zadd(key, now, `${now}-${Math.random()}`)  // add current
    pipeline.zcard(key)                                  // count in window
    pipeline.expire(key, 3600)                           // TTL
    const results = await pipeline.exec()

    const count = results[2][1] as number
    const allowed = count <= limit

    return {
      allowed,
      remaining: Math.max(0, limit - count),
      resetTime: now + windowMs,
      retryAfter: allowed ? undefined : Math.ceil(windowMs / 1000)
    }
  }
}
```

**Redis key pattern:** `rl:pub:<ip>` — sorted set, score = timestamp, member = `<timestamp>-<random>`

#### B. Composite fingerprint (IP + UA hash)

Pure IP rate limiting is too coarse. Add a User-Agent component to the fingerprint:

```typescript
function buildRateLimitKey(req: NextRequest): string {
  const ip = extractIP(req)
  const ua = req.headers.get('user-agent') ?? ''
  // Hash UA to keep key short — don't store raw UA strings in Redis
  const uaHash = createHash('md5').update(ua).digest('hex').slice(0, 8)
  return `rl:pub:${ip}:${uaHash}`
}
```

This means rotating IPs with the same client fingerprint still get hit. Not perfect, but raises the cost of abuse significantly.

#### C. Burst detection (short window within the hour window)

Add a secondary 60-second burst limit. If someone fires 20 requests in one minute, block them for the remainder of that minute regardless of hourly count:

```typescript
static async checkRateLimit(ip: string, ua: string): Promise<RateLimitResult> {
  const key = buildRateLimitKey(ip, ua)

  // Check burst limit first (20 req/min)
  const burstKey = `rl:burst:${key}`
  const burstCount = await redis.incr(burstKey)
  if (burstCount === 1) await redis.expire(burstKey, 60)

  if (burstCount > 20) {
    return { allowed: false, remaining: 0, retryAfter: 60, resetTime: Date.now() + 60000 }
  }

  // Then check hourly window (100 req/hr) via sliding window
  // ...
}
```

**Burst limits:** 20 req/60s burst, 100 req/hr sustained.

#### D. Hard block list for sustained abusers

After an IP exceeds the hourly limit 3 times in a 24hr window, add them to a block list with a 24hr TTL:

```typescript
static async recordViolation(ip: string): Promise<void> {
  const violationKey = `rl:violations:${ip}`
  const violations = await redis.incr(violationKey)
  if (violations === 1) await redis.expire(violationKey, 86400)  // 24hr window

  if (violations >= 3) {
    await redis.setex(`rl:blocked:${ip}`, 86400, '1')  // Block for 24hrs
  }
}

static async isBlocked(ip: string): Promise<boolean> {
  return (await redis.exists(`rl:blocked:${ip}`)) === 1
}
```

Check `isBlocked` before the rate limit check — blocked IPs get an immediate 429.

#### E. `cf-connecting-ip` enforcement

The current `extractIP` function already reads `cf-connecting-ip`. Ensure that in the Cloudflare → Traefik → Next.js chain, `x-forwarded-for` is either stripped or only trusted from Cloudflare IPs. Otherwise an attacker can spoof it. This is a Traefik config change, not a code change.

```yaml
# traefik config — only trust CF IP ranges for x-forwarded-for
forwardedHeaders:
  trustedIPs:
    - "103.21.244.0/22"
    - "103.22.200.0/22"
    # ... all CF IP ranges
```

#### F. Fail closed (not open) on memory/Redis pressure

The current fallback when `MAX_STORE_SIZE` is reached is to **allow** requests. This should be reversed — on Redis error, fail closed (deny) or fall back to a conservative in-memory limit:

```typescript
// On Redis error, fall back to conservative in-memory check
// If in-memory is also unavailable, return 429 with a short retry-after
if (redisError) {
  logger.error('Redis unavailable for rate limiting — failing closed')
  return { allowed: false, remaining: 0, retryAfter: 30, resetTime: Date.now() + 30000 }
}
```

---

## Schema Changes

### 1. Add `developer` to Subscription plan

No migration needed for the `plan` field — it's `String`. Update application-level checks:

```typescript
// lib/plan-utils.ts (new or existing)
export const PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  DEVELOPER: 'developer',   // new
  PRO: 'pro',
} as const

export function hasApiAccess(plan: string): boolean {
  return plan === PLANS.DEVELOPER || plan === PLANS.PRO
}

export function hasMcpAuth(plan: string): boolean {
  return plan === PLANS.DEVELOPER || plan === PLANS.PRO
}

export function hasFullAnalytics(plan: string): boolean {
  return plan === PLANS.PRO
}

export function getMcpRateLimit(plan: string): number {
  if (plan === PLANS.DEVELOPER) return 2000
  if (plan === PLANS.PRO) return 500
  return 0
}

export function getApiRateLimit(plan: string): number {
  if (plan === PLANS.DEVELOPER) return 2000
  if (plan === PLANS.PRO) return 500
  return 0
}
```

### 2. ApiKey — set correct rateLimit at creation time

When a Developer plan user creates an API key, set `rateLimit: 2000`. Pro gets `rateLimit: 500`. The `rateLimit` field already exists on the `ApiKey` model.

```typescript
// In the POST /api/v1/api-keys route
const rateLimit = subscription.plan === 'developer' ? 2000
                : subscription.plan === 'pro'       ? 500
                : 0

await ApiKeyManager.createApiKey(userId, {
  name,
  permissions,
  environment,
  rateLimit,  // was hardcoded to 1000 default
  expiresAt
})
```

### 3. ApiKey — add `plan` snapshot (optional but useful)

Consider adding `plan String?` to `ApiKey` so you can distinguish Dev vs Pro keys without a join. Not strictly required but avoids a Subscription lookup on every API request.

```prisma
model ApiKey {
  // ... existing fields
  plan String?  // snapshot of plan at key creation time
}
```

Migration:
```sql
ALTER TABLE "public"."ApiKey" ADD COLUMN "plan" TEXT;
```

### 4. Subscription — `mcpCallCount` tracking (optional)

If you want to show MCP usage separately from API usage in the Dev dashboard, add a lightweight counter. Otherwise reuse `ApiUsage` and filter by `endpoint` containing `/mcp`.

The `ApiUsage` approach is simpler — no schema change needed. Tag MCP requests with `userAgent: 'theqrcode-mcp/1.0'` (already set in the MCP server) and filter on that in usage queries.

---

## Stripe — New Price IDs

Add a Developer plan price in Stripe:
- Monthly: ~$19/mo
- Annual: ~$182/yr (~20% off)

In the Stripe webhook handler, map the new `priceId` to `plan: 'developer'`.

Update `PricingPage.tsx` to show the Developer plan card between Starter and Pro.

---

## Implementation Order

### Phase 1 — Foundation (no user-facing changes)
1. Add Redis client (`lib/redis.ts`) — can reuse existing Redis if present
2. Rewrite `PublicRateLimiter` to use Redis sliding window + burst check + block list
3. Add `plan-utils.ts` with plan constants and helper functions
4. Fix `rateLimit` on API key creation (currently defaults to 1000 for all plans)

### Phase 2 — Developer Plan
5. Add Stripe Developer price IDs + webhook mapping
6. Update `hasApiAccess` check in `/api/v1/api-keys` route to include `developer`
7. Add Developer plan card to `PricingPage.tsx`
8. Build minimal Dev dashboard (`/dashboard/developer` or plan-conditional `/dashboard`)

### Phase 3 — Authenticated MCP
9. Update MCP server to extract and pass API key
10. Route authenticated MCP calls to `/api/v1/qr-codes` instead of `/api/public/qr-codes`
11. Register `list_qr_codes` and `get_analytics` tools for authenticated sessions
12. Update `/mcp` page with authenticated config snippet (show user's key if logged in)

### Phase 4 — Traefik hardening
13. Lock down `x-forwarded-for` trust to Cloudflare IP ranges in Traefik config
14. Monitor violation and block list counts in Grafana/Matomo

---

## Open Questions

1. **Scan storage for Dev plan**: Should generating via MCP/API record `Scan` entries? Probably yes by default (they get 50K/mo), but offer a `?trackScans=false` query param for bulk generation use cases.

2. **`list_qr_codes` MCP tool for Pro**: Currently excluded from Pro. Could be included — it's a read-only call. Worth revisiting.

3. **Redis availability**: Does the current stack have Redis? If not, Phase 1 requires adding it. Check `docker-compose.yml` / infrastructure config.

4. **MCP auth failure UX**: When the MCP server receives an invalid API key, it should return a clear error message that Claude can relay to the user ("Invalid API key — check your theqrcode.io settings").

5. **Sandbox MCP**: Should sandbox API keys be allowed for MCP? Probably yes — it lets devs test their integration without affecting production QR code counts.
