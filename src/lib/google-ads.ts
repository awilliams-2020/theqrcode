/**
 * Google Ads Conversion Tracking Utilities
 * 
 * Usage:
 * 1. Set up environment variables in .env.local
 * 2. Call tracking functions after conversion events
 */

// Conversion event types
export type ConversionEvent = 
  | 'trial_signup'
  | 'demo_usage'
  | 'paid_subscription'
  | 'api_key_created'
  | 'business_plan_upgrade';

// Conversion values for different events
const CONVERSION_VALUES: Record<ConversionEvent, number> = {
  trial_signup: 20.0,
  demo_usage: 5.0,
  paid_subscription: 0, // Will be replaced with actual value
  api_key_created: 15.0,
  business_plan_upgrade: 50.0,
};

/**
 * Track a Google Ads conversion event
 * @param event - The type of conversion event
 * @param value - Optional custom value (overrides default)
 * @param transactionId - Optional unique transaction ID
 */
export function trackConversion(
  event: ConversionEvent,
  value?: number,
  transactionId?: string
): void {
  // Only run on client-side
  if (typeof window === 'undefined') return;
  
  // Check if gtag is loaded
  if (!window.gtag) {
    console.warn('Google Ads gtag not loaded');
    return;
  }

  // Get conversion ID from environment
  const conversionId = getConversionId(event);
  if (!conversionId) {
    console.warn(`No conversion ID configured for event: ${event}`);
    return;
  }

  // Track the conversion
  const conversionValue = value ?? CONVERSION_VALUES[event];
  
  window.gtag('event', 'conversion', {
    'send_to': conversionId,
    'value': conversionValue,
    'currency': 'USD',
    ...(transactionId && { 'transaction_id': transactionId }),
  });

  console.log(`Google Ads conversion tracked: ${event}`, {
    value: conversionValue,
    transactionId,
  });
}

/**
 * Get the conversion ID for a specific event type
 */
function getConversionId(event: ConversionEvent): string | undefined {
  const baseId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (!baseId) return undefined;

  const conversionLabel = getConversionLabel(event);
  if (!conversionLabel) return undefined;

  return `${baseId}/${conversionLabel}`;
}

/**
 * Get the conversion label from environment variables
 */
function getConversionLabel(event: ConversionEvent): string | undefined {
  switch (event) {
    case 'trial_signup':
      return process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_TRIAL;
    case 'demo_usage':
      return process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_DEMO;
    case 'paid_subscription':
      return process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_PAYMENT;
    case 'api_key_created':
      return process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_API;
    case 'business_plan_upgrade':
      return process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_BUSINESS;
    default:
      return undefined;
  }
}

/**
 * Track a page view (useful for remarketing)
 */
export function trackPageView(url: string): void {
  if (typeof window === 'undefined') return;
  
  if (!window.gtag) return;

  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (!adsId) return;

  window.gtag('config', adsId, {
    page_path: url,
  });
}

/**
 * Set custom parameters for enhanced conversions (optional)
 */
export function setUserData(userData: {
  email?: string;
  phone?: string;
  address?: {
    first_name?: string;
    last_name?: string;
    country?: string;
    postal_code?: string;
  };
}): void {
  if (typeof window === 'undefined') return;
  
  if (!window.gtag) return;

  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (!adsId) return;

  window.gtag('set', 'user_data', userData);
}

