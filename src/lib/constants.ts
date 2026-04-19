/**
 * Shared constants and configurations
 */

// Plan definitions with consistent pricing and features
export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out QR codes',
    features: [
      '10 QR codes',
      '1,000 scans per month',
      'Basic analytics',
      'URL, Text, WiFi, Contact types',
      'Basic customization',
    ],
    limits: {
      qrCodes: 10,
      scans: 1000,
    },
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 9,
    description: 'Great for small businesses',
    features: [
      '100 QR codes',
      '10,000 scans per month',
      'Advanced analytics',
      'All QR code types',
      'Custom styling',
      'Email support',
    ],
    limits: {
      qrCodes: 100,
      scans: 10000,
    },
  },
  developer: {
    id: 'developer',
    name: 'Developer',
    price: 19,
    description: 'Headless Pro — full API access, no dashboard UI',
    features: [
      '500 QR codes',
      '250,000 scans per month',
      'Full analytics via API',
      'All QR code types',
      'REST API — 2,000 req/hr',
      'API key management (production + sandbox)',
      'Authenticated MCP server',
      'Webhooks',
    ],
    limits: {
      qrCodes: 500,
      scans: 250000,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    description: 'Best for growing companies',
    features: [
      '500 QR codes',
      '500,000 scans per month',
      'Real-time analytics',
      'All QR code types',
      'Advanced customization',
      'Logo embedding',
      'SVG & PDF downloads',
      'Frame styles',
      'Priority support',
      'API access',
      'Bulk operations',
    ],
    limits: {
      qrCodes: 500,
      scans: 500000,
    },
  },
} as const

// Plan limits for easy access
export const PLAN_LIMITS = {
  free: PLANS.free.limits,
  starter: PLANS.starter.limits,
  developer: PLANS.developer.limits,
  pro: PLANS.pro.limits,
} as const

// Plan display names
export const PLAN_DISPLAY_NAMES = {
  free: PLANS.free.name,
  starter: PLANS.starter.name,
  developer: PLANS.developer.name,
  pro: PLANS.pro.name,
} as const

// Plan pricing for display
export const PLAN_PRICING = {
  free: { price: '$0', period: 'forever' },
  starter: { price: '$9', period: 'per month' },
  developer: { price: '$19', period: 'per month' },
  pro: { price: '$29', period: 'per month' },
} as const

// Trial configuration
export const TRIAL_CONFIG = {
  DAYS: 14,
  STATUS: 'trialing' as const,
} as const

export type PlanId = keyof typeof PLANS
export type PlanName = typeof PLANS[PlanId]['name']
