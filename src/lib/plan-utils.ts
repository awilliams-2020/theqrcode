/**
 * Central source of truth for plan gating, limits, and feature flags.
 * All plan checks across the codebase should use these helpers rather than
 * hardcoding plan name strings.
 */

// ---------------------------------------------------------------------------
// Plan constants
// ---------------------------------------------------------------------------

export const PLANS = {
  FREE:      'free',
  STARTER:   'starter',
  DEVELOPER: 'developer',
  PRO:       'pro',
} as const

export type Plan = typeof PLANS[keyof typeof PLANS]

// ---------------------------------------------------------------------------
// Feature gating
// ---------------------------------------------------------------------------

/** Can this plan create API keys and call v1 endpoints? */
export function hasApiAccess(plan: string): boolean {
  return plan === PLANS.DEVELOPER || plan === PLANS.PRO
}

/** Can this plan use the authenticated MCP server? */
export function hasMcpAuth(plan: string): boolean {
  return plan === PLANS.DEVELOPER || plan === PLANS.PRO
}

/** Does this plan include the extended MCP tools (list_qr_codes, get_analytics)? */
export function hasExtendedMcpTools(plan: string): boolean {
  return plan === PLANS.DEVELOPER
}

/** Does this plan include full analytics (real-time, geo, device breakdowns)? */
export function hasFullAnalytics(plan: string): boolean {
  return plan === PLANS.DEVELOPER || plan === PLANS.PRO
}

/** Does this plan include webhooks? */
export function hasWebhooks(plan: string): boolean {
  return plan === PLANS.DEVELOPER || plan === PLANS.PRO
}

// ---------------------------------------------------------------------------
// Limits
// ---------------------------------------------------------------------------

/** API key rate limit in requests per hour. */
export function getApiRateLimit(plan: string): number {
  switch (plan) {
    case PLANS.DEVELOPER: return 5_000
    case PLANS.PRO:       return 5_000
    default:              return 0
  }
}

/**
 * MCP-specific rate limit in requests per hour.
 * Developer gets a higher MCP limit because it is their primary interface.
 * Pro gets a lower MCP limit because MCP is a bonus feature alongside the dashboard.
 */
export function getMcpRateLimit(plan: string): number {
  switch (plan) {
    case PLANS.DEVELOPER: return 2_000
    case PLANS.PRO:       return 500
    default:              return 0
  }
}

/** Maximum QR codes the plan allows. */
export function getQrCodeLimit(plan: string): number {
  switch (plan) {
    case PLANS.FREE:      return 10
    case PLANS.STARTER:   return 100
    case PLANS.DEVELOPER: return 500
    case PLANS.PRO:       return 500
    default:              return 0
  }
}

/** Monthly scan limit. */
export function getScanLimit(plan: string): number {
  switch (plan) {
    case PLANS.FREE:      return 1_000
    case PLANS.STARTER:   return 10_000
    case PLANS.DEVELOPER: return 500_000
    case PLANS.PRO:       return 500_000
    default:              return 0
  }
}

// ---------------------------------------------------------------------------
// Trial helpers
// ---------------------------------------------------------------------------

export function isTrialActive(subscription: {
  status: string
  trialEndsAt?: Date | null
} | null | undefined): boolean {
  if (!subscription) return false
  return (
    subscription.status === 'trialing' &&
    subscription.trialEndsAt != null &&
    new Date(subscription.trialEndsAt) > new Date()
  )
}

/**
 * Resolve the effective plan for a subscription, accounting for active trials.
 * Returns the plan string or 'free' if no subscription exists.
 */
export function effectivePlan(subscription: {
  plan: string
  status: string
  trialEndsAt?: Date | null
} | null | undefined): string {
  if (!subscription) return PLANS.FREE
  return subscription.plan || PLANS.FREE
}
