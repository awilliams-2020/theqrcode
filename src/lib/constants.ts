/**
 * Shared constants and configurations
 */

// Plan definitions with consistent pricing and features
// NOTE: Business plan is temporarily hidden in the UI (see PricingPage, LandingPage, SignUp)
// Backend still supports it for existing customers
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
  business: {
    id: 'business',
    name: 'Business',
    price: 99,
    description: 'For large enterprises',
    features: [
      'Unlimited QR codes',
      'Unlimited scans',
      'Enterprise analytics',
      'All QR code types',
      'White label options',
      'Logo embedding',
      'SVG & PDF downloads',
      'Frame styles',
      '24/7 support',
      'Full API access',
      'Custom integrations',
    ],
    limits: {
      qrCodes: -1, // Unlimited
      scans: -1,   // Unlimited
    },
  },
} as const

// Plan limits for easy access
export const PLAN_LIMITS = {
  free: PLANS.free.limits,
  starter: PLANS.starter.limits,
  pro: PLANS.pro.limits,
  business: PLANS.business.limits,
} as const

// Plan display names
export const PLAN_DISPLAY_NAMES = {
  free: PLANS.free.name,
  starter: PLANS.starter.name,
  pro: PLANS.pro.name,
  business: PLANS.business.name,
} as const

// Plan pricing for display
export const PLAN_PRICING = {
  free: { price: '$0', period: 'forever' },
  starter: { price: '$9', period: 'per month' },
  pro: { price: '$29', period: 'per month' },
  business: { price: '$99', period: 'per month' },
} as const

// Trial configuration
export const TRIAL_CONFIG = {
  DAYS: 14,
  STATUS: 'trialing' as const,
} as const

export type PlanId = keyof typeof PLANS
export type PlanName = typeof PLANS[PlanId]['name']
