/**
 * Matomo Analytics Tracking Client
 * 
 * Supports both client-side and server-side tracking
 * 
 * Usage:
 * 1. Set environment variables:
 *    - NEXT_PUBLIC_MATOMO_URL: Your Matomo instance URL
 *    - NEXT_PUBLIC_MATOMO_SITE_ID: Site ID from Matomo
 *    - MATOMO_AUTH_TOKEN: Auth token for server-side tracking (optional)
 * 
 * 2. Client-side: Use trackPageView(), trackEvent(), etc.
 * 3. Server-side: Use serverTrack() with appropriate parameters
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface MatomoConfig {
  url: string;
  siteId: string;
  authToken?: string;
}

export interface MatomoPageViewParams {
  documentTitle?: string;
  customUrl?: string;
  userId?: string;
  customDimensions?: Record<string, string>;
}

export interface MatomoEventParams {
  category: string;
  action: string;
  name?: string;
  value?: number;
  customDimensions?: Record<string, string>;
}

export interface MatomoGoalParams {
  goalId: number;
  revenue?: number;
  customDimensions?: Record<string, string>;
}

export interface MatomoEcommerceItem {
  sku: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
}

export interface MatomoEcommerceParams {
  orderId: string;
  revenue: number;
  subTotal?: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  items: MatomoEcommerceItem[];
  customDimensions?: Record<string, string>;
}

export interface MatomoServerTrackParams {
  action: 'trackPageView' | 'trackEvent' | 'trackGoal' | 'trackEcommerce';
  url: string;
  userId?: string;
  visitorId?: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  pageView?: {
    title: string;
  };
  event?: {
    category: string;
    action: string;
    name?: string;
    value?: number;
  };
  goal?: {
    id: number;
    revenue?: number;
  };
  ecommerce?: MatomoEcommerceParams;
  customDimensions?: Record<string, string>;
}

// ============================================================================
// Configuration
// ============================================================================

let config: MatomoConfig | null = null;

/**
 * Initialize Matomo configuration
 */
export function initMatomo(customConfig?: Partial<MatomoConfig>): MatomoConfig | null {
  const url = customConfig?.url || process.env.NEXT_PUBLIC_MATOMO_URL;
  const siteId = customConfig?.siteId || process.env.NEXT_PUBLIC_MATOMO_SITE_ID;
  const authToken = customConfig?.authToken || process.env.MATOMO_AUTH_TOKEN;

  if (!url || !siteId) {
    return null;
  }

  config = {
    url: url.replace(/\/$/, ''), // Remove trailing slash
    siteId,
    authToken,
  };

  return config;
}

/**
 * Get current Matomo configuration
 */
export function getMatomoConfig(): MatomoConfig | null {
  if (!config) {
    return initMatomo();
  }
  return config;
}

// ============================================================================
// Client-Side Tracking (Browser)
// ============================================================================

/**
 * Check if Matomo tracker is available
 */
function isMatomoAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window._paq !== 'undefined';
}

/**
 * Check if Matomo is configured (has required env vars)
 */
export function isMatomoConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_MATOMO_URL && process.env.NEXT_PUBLIC_MATOMO_SITE_ID);
}

/**
 * Track a page view
 */
export function trackPageView(params?: MatomoPageViewParams): void {
  if (!isMatomoAvailable()) {
    return;
  }

  const _paq = window._paq!;

  // Set user ID if provided
  if (params?.userId) {
    _paq.push(['setUserId', params.userId]);
  }

  // Set custom dimensions
  if (params?.customDimensions) {
    Object.entries(params.customDimensions).forEach(([key, value]) => {
      _paq.push(['setCustomDimension', parseInt(key), value]);
    });
  }

  // Set custom URL if provided
  if (params?.customUrl) {
    _paq.push(['setCustomUrl', params.customUrl]);
  }

  // Set document title if provided
  if (params?.documentTitle) {
    _paq.push(['setDocumentTitle', params.documentTitle]);
  }

  // Track page view
  _paq.push(['trackPageView']);
}

/**
 * Track a custom event
 */
export function trackEvent(params: MatomoEventParams): void {
  if (!isMatomoAvailable()) {
    return;
  }

  const _paq = window._paq!;

  // Set custom dimensions
  if (params.customDimensions) {
    Object.entries(params.customDimensions).forEach(([key, value]) => {
      _paq.push(['setCustomDimension', parseInt(key), value]);
    });
  }

  // Track event
  _paq.push([
    'trackEvent',
    params.category,
    params.action,
    params.name,
    params.value,
  ]);
}

/**
 * Track a goal conversion
 */
export function trackGoal(params: MatomoGoalParams): void {
  if (!isMatomoAvailable()) {
    return;
  }

  const _paq = window._paq!;

  // Set custom dimensions
  if (params.customDimensions) {
    Object.entries(params.customDimensions).forEach(([key, value]) => {
      _paq.push(['setCustomDimension', parseInt(key), value]);
    });
  }

  // Track goal
  if (params.revenue) {
    _paq.push(['trackGoal', params.goalId, params.revenue]);
  } else {
    _paq.push(['trackGoal', params.goalId]);
  }
}

/**
 * Track an e-commerce order
 */
export function trackEcommerce(params: MatomoEcommerceParams): void {
  if (!isMatomoAvailable()) {
    return;
  }

  const _paq = window._paq!;

  // Add items to cart
  params.items.forEach((item) => {
    _paq.push([
      'addEcommerceItem',
      item.sku,
      item.name,
      item.category,
      item.price,
      item.quantity,
    ]);
  });

  // Set custom dimensions
  if (params.customDimensions) {
    Object.entries(params.customDimensions).forEach(([key, value]) => {
      _paq.push(['setCustomDimension', parseInt(key), value]);
    });
  }

  // Track order
  _paq.push([
    'trackEcommerceOrder',
    params.orderId,
    params.revenue,
    params.subTotal,
    params.tax,
    params.shipping,
    params.discount,
  ]);
}

/**
 * Set user ID for tracking
 */
export function setUserId(userId: string): void {
  if (!isMatomoAvailable()) return;
  window._paq!.push(['setUserId', userId]);
}

/**
 * Reset user ID (for logout)
 */
export function resetUserId(): void {
  if (!isMatomoAvailable()) return;
  window._paq!.push(['resetUserId']);
}

/**
 * Set custom dimension
 */
export function setCustomDimension(id: number, value: string): void {
  if (!isMatomoAvailable()) return;
  window._paq!.push(['setCustomDimension', id, value]);
}

/**
 * Track a site search
 */
export function trackSiteSearch(
  keyword: string,
  category?: string,
  resultsCount?: number
): void {
  if (!isMatomoAvailable()) return;
  window._paq!.push(['trackSiteSearch', keyword, category, resultsCount]);
}

/**
 * Track content impression
 */
export function trackContentImpression(
  contentName: string,
  contentPiece: string,
  contentTarget?: string
): void {
  if (!isMatomoAvailable()) return;
  window._paq!.push([
    'trackContentImpression',
    contentName,
    contentPiece,
    contentTarget,
  ]);
}

/**
 * Track content interaction
 */
export function trackContentInteraction(
  interaction: string,
  contentName: string,
  contentPiece: string,
  contentTarget?: string
): void {
  if (!isMatomoAvailable()) return;
  window._paq!.push([
    'trackContentInteraction',
    interaction,
    contentName,
    contentPiece,
    contentTarget,
  ]);
}

// ============================================================================
// Server-Side Tracking
// ============================================================================

/**
 * Build Matomo tracking URL with parameters
 */
function buildTrackingUrl(params: Record<string, any>): string {
  const cfg = getMatomoConfig();
  if (!cfg) throw new Error('Matomo not configured');

  const url = new URL(`${cfg.url}/matomo.php`);
  url.searchParams.append('idsite', cfg.siteId);
  url.searchParams.append('rec', '1');

  // Add auth token if available (for server-side tracking)
  if (cfg.authToken) {
    url.searchParams.append('token_auth', cfg.authToken);
  }

  // Add all other parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

/**
 * Server-side tracking function
 * Use this in API routes or server-side code
 */
export async function serverTrack(
  params: MatomoServerTrackParams
): Promise<boolean> {
  try {
    const cfg = getMatomoConfig();
    if (!cfg) {
      return false;
    }

    const trackingParams: Record<string, any> = {
      url: params.url,
      apiv: 1, // API version
      rand: Math.random().toString().slice(2), // Random number to prevent caching
    };

    // Add user identification
    if (params.userId) trackingParams.uid = params.userId;
    if (params.visitorId) trackingParams._id = params.visitorId;
    if (params.ip) trackingParams.cip = params.ip;
    if (params.userAgent) trackingParams.ua = params.userAgent;
    if (params.referrer) trackingParams.urlref = params.referrer;

    // Add custom dimensions
    if (params.customDimensions) {
      Object.entries(params.customDimensions).forEach(([key, value]) => {
        trackingParams[`dimension${key}`] = value;
      });
    }

    // Handle different action types
    switch (params.action) {
      case 'trackPageView':
        trackingParams.action_name = params.pageView?.title || 'Page View';
        break;

      case 'trackEvent':
        if (!params.event) throw new Error('Event parameters required');
        trackingParams.e_c = params.event.category;
        trackingParams.e_a = params.event.action;
        if (params.event.name) trackingParams.e_n = params.event.name;
        if (params.event.value) trackingParams.e_v = params.event.value;
        break;

      case 'trackGoal':
        if (!params.goal) throw new Error('Goal parameters required');
        trackingParams.idgoal = params.goal.id;
        if (params.goal.revenue) trackingParams.revenue = params.goal.revenue;
        break;

      case 'trackEcommerce':
        if (!params.ecommerce) throw new Error('Ecommerce parameters required');
        trackingParams.idgoal = 0; // 0 = ecommerce order
        trackingParams.ec_id = params.ecommerce.orderId;
        trackingParams.revenue = params.ecommerce.revenue;
        if (params.ecommerce.subTotal) trackingParams.ec_st = params.ecommerce.subTotal;
        if (params.ecommerce.tax) trackingParams.ec_tx = params.ecommerce.tax;
        if (params.ecommerce.shipping) trackingParams.ec_sh = params.ecommerce.shipping;
        if (params.ecommerce.discount) trackingParams.ec_dt = params.ecommerce.discount;

        // Add items as JSON
        trackingParams.ec_items = JSON.stringify(
          params.ecommerce.items.map((item) => [
            item.sku,
            item.name,
            item.category || '',
            item.price,
            item.quantity,
          ])
        );
        break;
    }

    // Build URL and make request
    const trackingUrl = buildTrackingUrl(trackingParams);

    const response = await fetch(trackingUrl, {
      method: 'GET',
      headers: {
        'User-Agent': params.userAgent || 'TheQRCode.io Server',
      },
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Convenience function for server-side page view tracking
 */
export async function serverTrackPageView(
  url: string,
  title: string,
  options?: {
    userId?: string;
    visitorId?: string;
    ip?: string;
    userAgent?: string;
    referrer?: string;
    customDimensions?: Record<string, string>;
  }
): Promise<boolean> {
  return serverTrack({
    action: 'trackPageView',
    url,
    pageView: { title },
    ...options,
  });
}

/**
 * Convenience function for server-side event tracking
 */
export async function serverTrackEvent(
  url: string,
  category: string,
  action: string,
  options?: {
    name?: string;
    value?: number;
    userId?: string;
    visitorId?: string;
    ip?: string;
    userAgent?: string;
    customDimensions?: Record<string, string>;
  }
): Promise<boolean> {
  return serverTrack({
    action: 'trackEvent',
    url,
    event: {
      category,
      action,
      name: options?.name,
      value: options?.value,
    },
    userId: options?.userId,
    visitorId: options?.visitorId,
    ip: options?.ip,
    userAgent: options?.userAgent,
    customDimensions: options?.customDimensions,
  });
}

/**
 * Convenience function for server-side goal tracking
 */
export async function serverTrackGoal(
  url: string,
  goalId: number,
  options?: {
    revenue?: number;
    userId?: string;
    visitorId?: string;
    ip?: string;
    userAgent?: string;
    customDimensions?: Record<string, string>;
  }
): Promise<boolean> {
  return serverTrack({
    action: 'trackGoal',
    url,
    goal: {
      id: goalId,
      revenue: options?.revenue,
    },
    userId: options?.userId,
    visitorId: options?.visitorId,
    ip: options?.ip,
    userAgent: options?.userAgent,
    customDimensions: options?.customDimensions,
  });
}

// ============================================================================
// Type Declarations for Window
// ============================================================================

declare global {
  interface Window {
    _paq?: any[];
  }
}

// ============================================================================
// Common Event Helpers
// ============================================================================

/**
 * Predefined event categories for consistency
 */
export const MatomoEventCategories = {
  USER: 'User',
  QR_CODE: 'QR Code',
  SUBSCRIPTION: 'Subscription',
  API: 'API',
  CONVERSION: 'Conversion',
  ENGAGEMENT: 'Engagement',
  ERROR: 'Error',
} as const;

/**
 * Helper function to track QR code related events
 */
export function trackQRCodeEvent(
  action: 'created' | 'scanned' | 'updated' | 'deleted' | 'downloaded',
  qrCodeId?: string,
  additionalData?: Record<string, any>
): void {
  trackEvent({
    category: MatomoEventCategories.QR_CODE,
    action: action,
    name: qrCodeId,
    customDimensions: additionalData as Record<string, string>,
  });
}

/**
 * Helper function to track user events
 */
export function trackUserEvent(
  action: 'signup' | 'login' | 'logout' | 'profile_update' | 'trial_started',
  userId?: string
): void {
  trackEvent({
    category: MatomoEventCategories.USER,
    action: action,
    name: userId,
  });
}

/**
 * Helper function to track subscription events
 */
export function trackSubscriptionEvent(
  action: 'upgraded' | 'downgraded' | 'canceled' | 'renewed',
  plan?: string,
  revenue?: number
): void {
  trackEvent({
    category: MatomoEventCategories.SUBSCRIPTION,
    action: action,
    name: plan,
    value: revenue,
  });
}

/**
 * Helper function to track API usage
 */
export function trackAPIEvent(
  action: 'key_created' | 'request_made' | 'rate_limited',
  apiKeyId?: string
): void {
  trackEvent({
    category: MatomoEventCategories.API,
    action: action,
    name: apiKeyId,
  });
}

export default {
  initMatomo,
  trackPageView,
  trackEvent,
  trackGoal,
  trackEcommerce,
  setUserId,
  resetUserId,
  setCustomDimension,
  trackSiteSearch,
  trackContentImpression,
  trackContentInteraction,
  serverTrack,
  serverTrackPageView,
  serverTrackEvent,
  serverTrackGoal,
  trackQRCodeEvent,
  trackUserEvent,
  trackSubscriptionEvent,
  trackAPIEvent,
  MatomoEventCategories,
};

