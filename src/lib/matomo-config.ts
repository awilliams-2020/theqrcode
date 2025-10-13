/**
 * Matomo Custom Dimensions and Goals Configuration
 * 
 * This file defines all custom dimensions and goals for Matomo tracking.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to Matomo Dashboard > Settings > Custom Dimensions
 * 2. Create each dimension with the specified scope
 * 3. Update the IDs in this file with the actual IDs from Matomo
 * 
 * 4. Go to Matomo Dashboard > Settings > Goals
 * 5. Create each goal and update the IDs below
 */

/**
 * Custom Dimensions Configuration
 * These should be configured in your Matomo instance
 */
export const MatomoCustomDimensions = {
  // Visit-scoped dimensions (apply to entire visit)
  USER_ID: 1,                    // User ID (for logged-in users)
  SUBSCRIPTION_PLAN: 2,          // free, starter, pro, business
  SUBSCRIPTION_STATUS: 3,        // active, trialing, past_due, canceled
  USER_ROLE: 4,                  // user, admin
  
  // Action-scoped dimensions (apply to specific actions)
  QR_CODE_ID: 5,                 // QR Code ID
  QR_CODE_TYPE: 6,               // url, wifi, contact, email, text
  QR_CODE_DYNAMIC: 7,            // true, false
  API_ENDPOINT: 8,               // API endpoint path
  API_VERSION: 9,                // v1, v2, etc.
  ERROR_TYPE: 10,                // error category
  CONVERSION_TYPE: 11,           // signup, upgrade, api_key, etc.
  PAYMENT_PLAN: 12,              // Plan being purchased
  CAMPAIGN_SOURCE: 13,           // Marketing campaign source
  LANDING_PAGE: 14,              // Landing page name (home, restaurants, retail, etc.)
  CTA_LOCATION: 15,              // CTA button location on page
} as const;

/**
 * Goals Configuration
 * Create these in Matomo Dashboard > Goals
 */
export const MatomoGoals = {
  // User Acquisition Goals
  USER_SIGNUP: 1,                     // New user registration
  EMAIL_VERIFIED: 2,                  // Email verification completed
  TRIAL_STARTED: 3,                   // Free trial started
  
  // Engagement Goals
  FIRST_QR_CODE_CREATED: 4,           // User created first QR code
  QR_CODE_SHARED: 5,                  // QR code downloaded/shared
  FIRST_SCAN_RECEIVED: 6,             // First scan on any QR code
  
  // Conversion Goals (Revenue)
  SUBSCRIPTION_STARTED: 7,            // Paid subscription started
  SUBSCRIPTION_UPGRADED: 8,           // Upgraded to higher tier
  SUBSCRIPTION_RENEWED: 9,            // Subscription renewed
  
  // API Goals
  API_KEY_CREATED: 10,                // API key generated
  FIRST_API_CALL: 11,                 // First API request made
  
  // Milestone Goals
  TEN_QR_CODES: 12,                   // Created 10 QR codes
  HUNDRED_SCANS: 13,                  // Received 100 total scans
  THOUSAND_SCANS: 14,                 // Received 1000 total scans
  
  // Landing Page Goals
  LANDING_PAGE_SIGNUP: 15,            // Signup from landing page
  LANDING_PAGE_TRIAL: 16,             // Started trial from landing page
  LANDING_PAGE_DEMO: 17,              // Viewed demo from landing page
} as const;

/**
 * Event Categories
 * Consistent event categories for tracking
 */
export const MatomoEventCategory = {
  USER: 'User',
  QR_CODE: 'QR Code',
  SUBSCRIPTION: 'Subscription',
  API: 'API',
  ANALYTICS: 'Analytics',
  PAYMENT: 'Payment',
  ENGAGEMENT: 'Engagement',
  ERROR: 'Error',
  NAVIGATION: 'Navigation',
  FORM: 'Form',
  LANDING_PAGE: 'Landing Page',
  CTA: 'CTA',
} as const;

/**
 * Event Actions
 * Common event actions
 */
export const MatomoEventAction = {
  // User actions
  SIGNUP: 'signup',
  LOGIN: 'login',
  LOGOUT: 'logout',
  VERIFY_EMAIL: 'verify_email',
  RESET_PASSWORD: 'reset_password',
  UPDATE_PROFILE: 'update_profile',
  DELETE_ACCOUNT: 'delete_account',
  
  // QR Code actions
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  DOWNLOAD: 'download',
  SCAN: 'scan',
  SHARE: 'share',
  
  // Subscription actions
  START_TRIAL: 'start_trial',
  SUBSCRIBE: 'subscribe',
  UPGRADE: 'upgrade',
  DOWNGRADE: 'downgrade',
  CANCEL: 'cancel',
  RENEW: 'renew',
  
  // API actions
  CREATE_KEY: 'create_key',
  DELETE_KEY: 'delete_key',
  API_REQUEST: 'api_request',
  RATE_LIMITED: 'rate_limited',
  
  // Analytics actions
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data',
  FILTER_DATA: 'filter_data',
  
  // Payment actions
  CHECKOUT_START: 'checkout_start',
  CHECKOUT_COMPLETE: 'checkout_complete',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  
  // Engagement actions
  CLICK_CTA: 'click_cta',
  SUBMIT_FORM: 'submit_form',
  VIEW_DOCUMENTATION: 'view_documentation',
  CONTACT_SUPPORT: 'contact_support',
  
  // Error actions
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
  VALIDATION_ERROR: 'validation_error',
  
  // Landing page actions
  VIEW_LANDING: 'view_landing',
  CLICK_CTA_HERO: 'click_cta_hero',
  CLICK_CTA_PRICING: 'click_cta_pricing',
  CLICK_CTA_FOOTER: 'click_cta_footer',
  CLICK_DEMO: 'click_demo',
  VIEW_PRICING: 'view_pricing',
} as const;

/**
 * Helper function to get custom dimension value
 */
export function getCustomDimensionId(dimensionName: keyof typeof MatomoCustomDimensions): number {
  return MatomoCustomDimensions[dimensionName];
}

/**
 * Helper function to create custom dimensions object
 */
export function createCustomDimensions(dimensions: Partial<Record<keyof typeof MatomoCustomDimensions, string>>): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(dimensions)) {
    const dimensionId = MatomoCustomDimensions[key as keyof typeof MatomoCustomDimensions];
    if (dimensionId && value) {
      result[dimensionId.toString()] = value;
    }
  }
  
  return result;
}

export default {
  MatomoCustomDimensions,
  MatomoGoals,
  MatomoEventCategory,
  MatomoEventAction,
  getCustomDimensionId,
  createCustomDimensions,
};

