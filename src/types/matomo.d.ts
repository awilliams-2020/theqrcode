/**
 * TypeScript type declarations for Matomo Analytics
 */

declare global {
  interface Window {
    /**
     * Matomo tracker queue
     * All tracking calls are pushed to this array
     */
    _paq?: Array<Array<string | number | object>>;

    /**
     * Matomo main object (available after script loads)
     */
    Matomo?: any;

    /**
     * Google Analytics gtag (if using Google Ads alongside Matomo)
     */
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Matomo tracking methods available via _paq.push()
 */
export type MatomoTrackingMethod =
  // Configuration
  | ['setTrackerUrl', string]
  | ['setSiteId', string | number]
  | ['setUserId', string]
  | ['resetUserId']
  | ['setCustomUrl', string]
  | ['setDocumentTitle', string]
  | ['setCustomDimension', number, string]
  | ['deleteCustomDimension', number]
  | ['setCustomVariable', number, string, string, 'page' | 'visit']
  | ['deleteCustomVariable', number, 'page' | 'visit']
  
  // Page tracking
  | ['trackPageView']
  | ['trackPageView', string] // with custom page title
  
  // Event tracking
  | ['trackEvent', string, string] // category, action
  | ['trackEvent', string, string, string] // category, action, name
  | ['trackEvent', string, string, string, number] // category, action, name, value
  
  // Goal tracking
  | ['trackGoal', number] // goal ID
  | ['trackGoal', number, number] // goal ID, custom revenue
  
  // Site search
  | ['trackSiteSearch', string] // keyword
  | ['trackSiteSearch', string, string] // keyword, category
  | ['trackSiteSearch', string, string, number] // keyword, category, results count
  
  // E-commerce
  | ['addEcommerceItem', string, string, string, number, number] // sku, name, category, price, quantity
  | ['removeEcommerceItem', string] // sku
  | ['clearEcommerceCart']
  | ['trackEcommerceCartUpdate', number] // cart amount
  | ['trackEcommerceOrder', string, number] // order ID, revenue
  | ['trackEcommerceOrder', string, number, number, number, number, number] // order ID, revenue, subTotal, tax, shipping, discount
  | ['setEcommerceView', string, string, string, number] // product SKU, name, category, price
  | ['setEcommerceView', false, false, string] // category page
  
  // Content tracking
  | ['trackContentImpression', string, string, string] // content name, content piece, content target
  | ['trackContentInteraction', string, string, string, string] // interaction, content name, content piece, content target
  
  // Link tracking
  | ['enableLinkTracking']
  | ['enableLinkTracking', boolean] // enable cross-domain linking
  | ['setLinkTrackingTimer', number] // delay in milliseconds
  | ['setLinkClasses', string[]] // array of CSS classes
  | ['setDownloadClasses', string[]] // array of CSS classes
  | ['setDownloadExtensions', string[]] // array of file extensions
  | ['addDownloadExtensions', string[]] // array of file extensions
  | ['removeDownloadExtensions', string[]] // array of file extensions
  | ['setIgnoreClasses', string[]] // array of CSS classes
  
  // Performance tracking
  | ['enableHeartBeatTimer']
  | ['enableHeartBeatTimer', number] // active time in seconds
  
  // Tracking options
  | ['setCookieConsentGiven']
  | ['requireConsent']
  | ['requireCookieConsent']
  | ['disableCookies']
  | ['deleteCookies']
  | ['setSecureCookie', boolean]
  | ['setCookieDomain', string]
  | ['setCookiePath', string]
  | ['setVisitorCookieTimeout', number] // in seconds
  | ['setSessionCookieTimeout', number] // in seconds
  | ['setReferralCookieTimeout', number] // in seconds
  
  // Privacy
  | ['setDoNotTrack', boolean]
  | ['optUserOut']
  | ['forgetUserOptOut']
  | ['isUserOptedOut']
  
  // Advanced
  | ['enableDebug']
  | ['setRequestMethod', 'GET' | 'POST']
  | ['setCustomRequestProcessing', (request: string) => void]
  | ['appendToTrackingUrl', string]
  | ['setRequestContentType', string]
  | ['disablePerformanceTracking']
  | ['setGenerationTimeMs', number]
  
  // Cross-domain tracking
  | ['setDomains', string[]]
  | ['enableCrossDomainLinking']
  | ['setCrossDomainLinkingTimeout', number]
  
  // Campaign tracking
  | ['setCampaignNameKey', string]
  | ['setCampaignKeywordKey', string]
  
  // Custom data
  | ['ping']
  | ['trackAllContentImpressions']
  | ['trackVisibleContentImpressions']
  | ['trackContentImpressionsWithinNode', HTMLElement];

/**
 * Matomo tracker instance interface
 */
export interface MatomoTracker {
  /**
   * Push a tracking method to the queue
   */
  push(method: MatomoTrackingMethod): void;
}

/**
 * Matomo configuration interface
 */
export interface MatomoConfig {
  /**
   * Matomo instance URL (without trailing slash)
   */
  url: string;
  
  /**
   * Site ID from Matomo dashboard
   */
  siteId: string;
  
  /**
   * Auth token for server-side tracking (optional)
   */
  authToken?: string;
}

/**
 * Matomo Tracking API parameter names
 * Used for server-side tracking HTTP API
 */
export interface MatomoTrackingParams {
  // Required parameters
  idsite: string | number;           // Site ID
  rec: 1;                            // Record tracking request
  url: string;                       // Page URL
  
  // Recommended parameters
  action_name?: string;              // Page title
  _id?: string;                      // Visitor ID (16 character hex string)
  rand?: string;                     // Random value to prevent caching
  apiv?: number;                     // API version (always 1)
  
  // User info
  uid?: string;                      // User ID
  _idvc?: number;                    // Number of visits
  _viewts?: number;                  // Timestamp of previous visit
  _idts?: number;                    // Timestamp of first visit
  
  // Session info
  _rcn?: string;                     // Campaign name
  _rck?: string;                     // Campaign keyword
  
  // Action info
  url?: string;                      // Page URL
  urlref?: string;                   // Referrer URL
  
  // Custom variables (page scope)
  cvar?: string;                     // JSON encoded custom variables
  
  // Custom variables (visit scope)
  _cvar?: string;                    // JSON encoded custom variables
  
  // Event tracking
  e_c?: string;                      // Event category
  e_a?: string;                      // Event action
  e_n?: string;                      // Event name
  e_v?: number;                      // Event value
  
  // Goal tracking
  idgoal?: number;                   // Goal ID
  revenue?: number;                  // Goal revenue
  
  // E-commerce
  ec_id?: string;                    // Order ID
  ec_items?: string;                 // JSON encoded items
  ec_st?: number;                    // Subtotal
  ec_tx?: number;                    // Tax
  ec_sh?: number;                    // Shipping
  ec_dt?: number;                    // Discount
  
  // Search tracking
  search?: string;                   // Site search keyword
  search_cat?: string;               // Site search category
  search_count?: number;             // Site search results count
  
  // Performance tracking
  pf_net?: number;                   // Network time
  pf_srv?: number;                   // Server time
  pf_tfr?: number;                   // Transfer time
  pf_dm1?: number;                   // DOM processing time
  pf_dm2?: number;                   // DOM completion time
  pf_onl?: number;                   // Onload time
  
  // Device info
  res?: string;                      // Screen resolution (e.g., "1920x1080")
  ua?: string;                       // User agent
  lang?: string;                     // Browser language
  cip?: string;                      // Client IP address
  cdt?: number;                      // Custom timestamp
  
  // Custom dimensions
  dimension1?: string;               // Custom dimension 1
  dimension2?: string;               // Custom dimension 2
  dimension3?: string;               // Custom dimension 3
  dimension4?: string;               // Custom dimension 4
  dimension5?: string;               // Custom dimension 5
  // ... and so on
  
  // Content tracking
  c_n?: string;                      // Content name
  c_p?: string;                      // Content piece
  c_t?: string;                      // Content target
  c_i?: string;                      // Content interaction
  
  // Other
  gt_ms?: number;                    // Generation time in milliseconds
  cs?: string;                       // Character set
  send_image?: 0 | 1;                // Send image response
  pdf?: 0 | 1;                       // PDF support
  qt?: 0 | 1;                        // QuickTime support
  realp?: 0 | 1;                     // RealPlayer support
  wma?: 0 | 1;                       // Windows Media Player support
  dir?: 0 | 1;                       // Director support
  fla?: 0 | 1;                       // Flash support
  java?: 0 | 1;                      // Java support
  gears?: 0 | 1;                     // Gears support
  ag?: 0 | 1;                        // Silverlight support
  cookie?: 0 | 1;                    // Cookie support
  token_auth?: string;               // Auth token for tracking
}

export {};

