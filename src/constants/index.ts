// Application constants

export const QR_CODE_TYPES = {
  URL: 'url',
  TEXT: 'text',
  WIFI: 'wifi',
  CONTACT: 'contact',
  EMAIL: 'email',
  MENU: 'menu'
} as const

export const PLAN_TYPES = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
  BUSINESS: 'business'
} as const

export const FRAME_STYLES = {
  SQUARE: 'square',
  ROUNDED: 'rounded',
  CIRCLE: 'circle',
  DASHED: 'dashed'
} as const


export const TOAST_DURATION = 5000
export const COPY_FEEDBACK_DURATION = 2000

export const QR_CODE_SIZES = {
  MIN: 128,
  MAX: 512,
  DEFAULT: 256,
  STEP: 32
} as const

export const FRAME_SIZES = {
  MIN: 5,
  MAX: 50,
  DEFAULT: 20,
  STEP: 5,
  CIRCLE_MIN: 10
} as const

export const LOGO_CONSTRAINTS = {
  MAX_SIZE_MB: 2,
  MAX_SIZE_PERCENT: 0.25,
  MAX_PIXELS: 64
} as const


export const API_ENDPOINTS = {
  QR_CODES: '/api/qr-codes',
  ANALYTICS: '/api/analytics',
  STRIPE_CHECKOUT: '/api/stripe/checkout',
  USER_SUBSCRIPTION: '/api/user/subscription'
} as const

export const PLAN_LIMITS = {
  [PLAN_TYPES.FREE]: { qrCodes: 10, scans: 1000 },
  [PLAN_TYPES.STARTER]: { qrCodes: 100, scans: 10000 },
  [PLAN_TYPES.PRO]: { qrCodes: 500, scans: 50000 },
  [PLAN_TYPES.BUSINESS]: { qrCodes: -1, scans: -1 }
} as const

export const PLAN_DISPLAY_NAMES = {
  [PLAN_TYPES.FREE]: 'Free',
  [PLAN_TYPES.STARTER]: 'Starter',
  [PLAN_TYPES.PRO]: 'Pro',
  [PLAN_TYPES.BUSINESS]: 'Business'
} as const
