/**
 * Comprehensive Matomo Tracking Utilities
 * 
 * High-level tracking functions that use custom dimensions and goals
 */

import {
  serverTrackEvent,
  serverTrackGoal,
  trackEvent as clientTrackEvent,
  trackGoal as clientTrackGoal,
  trackEcommerce,
  isMatomoConfigured,
  getMatomoConfig,
  type MatomoEcommerceItem,
} from './matomo';
import {
  MatomoGoals,
  MatomoEventCategory,
  MatomoEventAction,
  createCustomDimensions,
} from './matomo-config';

/**
 * User tracking functions
 */
export const trackUser = {
  /**
   * Track user signup (server-side)
   */
  async signup(userId: string, options?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
  }) {
    if (!isMatomoConfigured()) return;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/auth/signup`;
    
    await Promise.all([
      // Track event
      serverTrackEvent(
        url,
        MatomoEventCategory.USER,
        MatomoEventAction.SIGNUP,
        {
          userId,
          ip: options?.ip,
          userAgent: options?.userAgent,
          customDimensions: createCustomDimensions({
            USER_ID: userId,
            SUBSCRIPTION_PLAN: 'free',
            SUBSCRIPTION_STATUS: 'active',
            CONVERSION_TYPE: 'signup',
          }),
        }
      ),
      // Track goal
      serverTrackGoal(
        url,
        MatomoGoals.USER_SIGNUP,
        {
          userId,
          ip: options?.ip,
          userAgent: options?.userAgent,
        }
      ),
    ]);
  },

  /**
   * Track user login (server-side)
   */
  async login(userId: string, subscriptionPlan: string, options?: {
    ip?: string;
    userAgent?: string;
  }) {
    if (!isMatomoConfigured()) return;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/auth/login`;
    
    await serverTrackEvent(
      url,
      MatomoEventCategory.USER,
      MatomoEventAction.LOGIN,
      {
        userId,
        ip: options?.ip,
        userAgent: options?.userAgent,
        customDimensions: createCustomDimensions({
          USER_ID: userId,
          SUBSCRIPTION_PLAN: subscriptionPlan,
        }),
      }
    );
  },

  /**
   * Track email verification (server-side)
   */
  async verifyEmail(userId: string, options?: {
    ip?: string;
    userAgent?: string;
  }) {
    if (!isMatomoConfigured()) return;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/auth/verify-email`;
    
    await Promise.all([
      serverTrackEvent(
        url,
        MatomoEventCategory.USER,
        MatomoEventAction.VERIFY_EMAIL,
        {
          userId,
          ip: options?.ip,
          userAgent: options?.userAgent,
          customDimensions: createCustomDimensions({
            USER_ID: userId,
          }),
        }
      ),
      serverTrackGoal(
        url,
        MatomoGoals.EMAIL_VERIFIED,
        {
          userId,
          ip: options?.ip,
          userAgent: options?.userAgent,
        }
      ),
    ]);
  },

  /**
   * Track password reset (server-side)
   */
  async resetPassword(userId?: string, options?: {
    ip?: string;
    userAgent?: string;
  }) {
    if (!isMatomoConfigured()) return;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/auth/reset-password`;
    
    await serverTrackEvent(
      url,
      MatomoEventCategory.USER,
      MatomoEventAction.RESET_PASSWORD,
      {
        userId,
        ip: options?.ip,
        userAgent: options?.userAgent,
        customDimensions: userId ? createCustomDimensions({
          USER_ID: userId,
        }) : undefined,
      }
    );
  },

  /**
   * Track account deletion (server-side)
   */
  async deleteAccount(userId: string, subscriptionPlan: string, options?: {
    ip?: string;
    userAgent?: string;
  }) {
    if (!isMatomoConfigured()) return;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/account/settings`;
    
    await serverTrackEvent(
      url,
      MatomoEventCategory.USER,
      MatomoEventAction.DELETE_ACCOUNT,
      {
        userId,
        ip: options?.ip,
        userAgent: options?.userAgent,
        customDimensions: createCustomDimensions({
          USER_ID: userId,
          SUBSCRIPTION_PLAN: subscriptionPlan,
        }),
      }
    );
  },
};

/**
 * QR Code tracking functions
 */
export const trackQRCode = {
  /**
   * Track QR code creation (server-side)
   */
  async create(
    userId: string,
    qrCodeId: string,
    type: string,
    isDynamic: boolean,
    subscriptionPlan: string,
    qrCodeCount: number,
    options?: {
      ip?: string;
      userAgent?: string;
    }
  ) {
    // For server-side tracking, we need to check the server-side configuration
    const matomoConfig = getMatomoConfig();
    
    if (!matomoConfig) {
      console.log('Matomo: Server config not available, skipping QR code tracking');
      return;
    }
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/dashboard`;
    
    const promises: Promise<any>[] = [
      serverTrackEvent(
        url,
        MatomoEventCategory.QR_CODE,
        MatomoEventAction.CREATE,
        {
          name: qrCodeId,
          userId,
          ip: options?.ip,
          userAgent: options?.userAgent,
          customDimensions: createCustomDimensions({
            USER_ID: userId,
            SUBSCRIPTION_PLAN: subscriptionPlan,
            QR_CODE_ID: qrCodeId,
            QR_CODE_TYPE: type,
            QR_CODE_DYNAMIC: isDynamic.toString(),
          }),
        }
      ),
    ];

    // Track goal for first QR code
    if (qrCodeCount === 1) {
      promises.push(
        serverTrackGoal(
          url,
          MatomoGoals.FIRST_QR_CODE_CREATED,
          {
            userId,
            ip: options?.ip,
            userAgent: options?.userAgent,
          }
        )
      );
    }

    // Track milestone goals
    if (qrCodeCount === 10) {
      promises.push(
        serverTrackGoal(
          url,
          MatomoGoals.TEN_QR_CODES,
          {
            userId,
            ip: options?.ip,
            userAgent: options?.userAgent,
          }
        )
      );
    }

    const results = await Promise.all(promises);
    
    // Log only if tracking failed
    const failedCount = results.filter(r => r === false).length;
    if (failedCount > 0) {
      console.log(`Matomo: ${failedCount}/${results.length} tracking requests failed`);
    }
  },

  /**
   * Track QR code scan (server-side)
   */
  async scan(
    qrCodeId: string,
    userId: string,
    type: string,
    isDynamic: boolean,
    totalScans: number,
    options?: {
      ip?: string;
      userAgent?: string;
      country?: string;
      device?: string;
    }
  ) {
    if (!isMatomoConfigured()) return;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/scan`;
    
    const promises: Promise<any>[] = [
      serverTrackEvent(
        url,
        MatomoEventCategory.QR_CODE,
        MatomoEventAction.SCAN,
        {
          name: qrCodeId,
          userId,
          ip: options?.ip,
          userAgent: options?.userAgent,
          customDimensions: createCustomDimensions({
            USER_ID: userId,
            QR_CODE_ID: qrCodeId,
            QR_CODE_TYPE: type,
            QR_CODE_DYNAMIC: isDynamic.toString(),
          }),
        }
      ),
    ];

    // Track milestone goals
    if (totalScans === 1) {
      promises.push(
        serverTrackGoal(
          url,
          MatomoGoals.FIRST_SCAN_RECEIVED,
          {
            userId,
            ip: options?.ip,
            userAgent: options?.userAgent,
          }
        )
      );
    } else if (totalScans === 100) {
      promises.push(
        serverTrackGoal(
          url,
          MatomoGoals.HUNDRED_SCANS,
          {
            userId,
            ip: options?.ip,
            userAgent: options?.userAgent,
          }
        )
      );
    } else if (totalScans === 1000) {
      promises.push(
        serverTrackGoal(
          url,
          MatomoGoals.THOUSAND_SCANS,
          {
            userId,
            ip: options?.ip,
            userAgent: options?.userAgent,
          }
        )
      );
    }

    await Promise.all(promises);
  },

  /**
   * Track QR code update (server-side)
   */
  async update(
    userId: string,
    qrCodeId: string,
    type: string,
    isDynamic: boolean,
    options?: {
      ip?: string;
      userAgent?: string;
    }
  ) {
    if (!isMatomoConfigured()) return;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/dashboard`;
    
    await serverTrackEvent(
      url,
      MatomoEventCategory.QR_CODE,
      MatomoEventAction.UPDATE,
      {
        name: qrCodeId,
        userId,
        ip: options?.ip,
        userAgent: options?.userAgent,
        customDimensions: createCustomDimensions({
          USER_ID: userId,
          QR_CODE_ID: qrCodeId,
          QR_CODE_TYPE: type,
          QR_CODE_DYNAMIC: isDynamic.toString(),
        }),
      }
    );
  },

  /**
   * Track QR code deletion (server-side)
   */
  async delete(
    userId: string,
    qrCodeId: string,
    type: string,
    isDynamic: boolean,
    options?: {
      ip?: string;
      userAgent?: string;
    }
  ) {
    if (!isMatomoConfigured()) return;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/dashboard`;
    
    await serverTrackEvent(
      url,
      MatomoEventCategory.QR_CODE,
      MatomoEventAction.DELETE,
      {
        name: qrCodeId,
        userId,
        ip: options?.ip,
        userAgent: options?.userAgent,
        customDimensions: createCustomDimensions({
          USER_ID: userId,
          QR_CODE_ID: qrCodeId,
          QR_CODE_TYPE: type,
          QR_CODE_DYNAMIC: isDynamic.toString(),
        }),
      }
    );
  },

  /**
   * Track QR code download (client-side)
   */
  download(qrCodeId: string, type: string, isDynamic: boolean) {
    clientTrackEvent({
      category: MatomoEventCategory.QR_CODE,
      action: MatomoEventAction.DOWNLOAD,
      name: qrCodeId,
      customDimensions: createCustomDimensions({
        QR_CODE_ID: qrCodeId,
        QR_CODE_TYPE: type,
        QR_CODE_DYNAMIC: isDynamic.toString(),
      }),
    });
  },
};

/**
 * Subscription tracking functions
 */
export const trackSubscription = {
  /**
   * Track trial start (server-side)
   */
  async startTrial(userId: string, options?: {
    ip?: string;
    userAgent?: string;
  }) {
    if (!isMatomoConfigured()) return;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/auth/signup`;
    
    await Promise.all([
      serverTrackEvent(
        url,
        MatomoEventCategory.SUBSCRIPTION,
        MatomoEventAction.START_TRIAL,
        {
          userId,
          ip: options?.ip,
          userAgent: options?.userAgent,
          customDimensions: createCustomDimensions({
            USER_ID: userId,
            SUBSCRIPTION_STATUS: 'trialing',
          }),
        }
      ),
      serverTrackGoal(
        url,
        MatomoGoals.TRIAL_STARTED,
        {
          userId,
          ip: options?.ip,
          userAgent: options?.userAgent,
        }
      ),
    ]);
  },

  /**
   * Track subscription purchase (server-side with e-commerce)
   */
  async purchase(
    userId: string,
    plan: string,
    revenue: number,
    orderId: string,
    options?: {
      ip?: string;
      userAgent?: string;
      isUpgrade?: boolean;
      previousPlan?: string;
    }
  ) {
    if (!isMatomoConfigured()) return;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/pricing`;
    
    const planNames: Record<string, string> = {
      free: 'Free Plan',
      starter: 'Starter Plan',
      pro: 'Pro Plan',
      business: 'Business Plan',
    };

    const items: MatomoEcommerceItem[] = [{
      sku: plan,
      name: planNames[plan] || plan,
      category: 'Subscription',
      price: revenue,
      quantity: 1,
    }];

    const promises: Promise<any>[] = [
      // Track e-commerce order
      serverTrackEvent(
        url,
        MatomoEventCategory.PAYMENT,
        MatomoEventAction.PAYMENT_SUCCESS,
        {
          userId,
          ip: options?.ip,
          userAgent: options?.userAgent,
          customDimensions: createCustomDimensions({
            USER_ID: userId,
            SUBSCRIPTION_PLAN: plan,
            SUBSCRIPTION_STATUS: 'active',
            PAYMENT_PLAN: plan,
          }),
        }
      ),
    ];

    // Track appropriate goal
    if (options?.isUpgrade) {
      promises.push(
        serverTrackGoal(
          url,
          MatomoGoals.SUBSCRIPTION_UPGRADED,
          {
            revenue,
            userId,
            ip: options?.ip,
            userAgent: options?.userAgent,
          }
        )
      );
    } else {
      promises.push(
        serverTrackGoal(
          url,
          MatomoGoals.SUBSCRIPTION_STARTED,
          {
            revenue,
            userId,
            ip: options?.ip,
            userAgent: options?.userAgent,
          }
        )
      );
    }

    await Promise.all(promises);
  },

  /**
   * Track subscription cancellation (server-side)
   */
  async cancel(
    userId: string,
    plan: string,
    options?: {
      ip?: string;
      userAgent?: string;
      reason?: string;
    }
  ) {
    if (!isMatomoConfigured()) return;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/account/billing`;
    
    await serverTrackEvent(
      url,
      MatomoEventCategory.SUBSCRIPTION,
      MatomoEventAction.CANCEL,
      {
        name: options?.reason,
        userId,
        ip: options?.ip,
        userAgent: options?.userAgent,
        customDimensions: createCustomDimensions({
          USER_ID: userId,
          SUBSCRIPTION_PLAN: plan,
          SUBSCRIPTION_STATUS: 'canceled',
        }),
      }
    );
  },

  /**
   * Track subscription renewal (server-side)
   */
  async renew(
    userId: string,
    plan: string,
    revenue: number,
    options?: {
      ip?: string;
      userAgent?: string;
    }
  ) {
    if (!isMatomoConfigured()) return;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/account/billing`;
    
    await Promise.all([
      serverTrackEvent(
        url,
        MatomoEventCategory.SUBSCRIPTION,
        MatomoEventAction.RENEW,
        {
          userId,
          ip: options?.ip,
          userAgent: options?.userAgent,
          customDimensions: createCustomDimensions({
            USER_ID: userId,
            SUBSCRIPTION_PLAN: plan,
            SUBSCRIPTION_STATUS: 'active',
          }),
        }
      ),
      serverTrackGoal(
        url,
        MatomoGoals.SUBSCRIPTION_RENEWED,
        {
          revenue,
          userId,
          ip: options?.ip,
          userAgent: options?.userAgent,
        }
      ),
    ]);
  },
};

/**
 * API tracking functions
 */
export const trackAPI = {
  /**
   * Track API key creation (server-side)
   */
  async createKey(
    userId: string,
    apiKeyId: string,
    subscriptionPlan: string,
    options?: {
      ip?: string;
      userAgent?: string;
    }
  ) {
    if (!isMatomoConfigured()) return;
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/account/api-keys`;
    
    await Promise.all([
      serverTrackEvent(
        url,
        MatomoEventCategory.API,
        MatomoEventAction.CREATE_KEY,
        {
          name: apiKeyId,
          userId,
          ip: options?.ip,
          userAgent: options?.userAgent,
          customDimensions: createCustomDimensions({
            USER_ID: userId,
            SUBSCRIPTION_PLAN: subscriptionPlan,
            API_VERSION: 'v1',
          }),
        }
      ),
      serverTrackGoal(
        url,
        MatomoGoals.API_KEY_CREATED,
        {
          userId,
          ip: options?.ip,
          userAgent: options?.userAgent,
        }
      ),
    ]);
  },

  /**
   * Track API request (server-side)
   */
  async request(
    endpoint: string,
    method: string,
    userId?: string,
    options?: {
      ip?: string;
      userAgent?: string;
      statusCode?: number;
      responseTime?: number;
    }
  ) {
    if (!isMatomoConfigured()) return;
    
    // Use a virtual page for API tracking instead of actual API endpoints
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/api-activity`;
    
    await serverTrackEvent(
      url,
      MatomoEventCategory.API,
      MatomoEventAction.API_REQUEST,
      {
        name: `${method} ${endpoint}`,
        value: options?.responseTime,
        userId,
        ip: options?.ip,
        userAgent: options?.userAgent,
        customDimensions: userId ? createCustomDimensions({
          USER_ID: userId,
          API_ENDPOINT: endpoint,
          API_VERSION: endpoint.startsWith('/api/v') ? endpoint.split('/')[2] : 'internal',
        }) : undefined,
      }
    );
  },

  /**
   * Track API rate limit hit (server-side)
   */
  async rateLimited(
    endpoint: string,
    userId?: string,
    options?: {
      ip?: string;
      userAgent?: string;
    }
  ) {
    if (!isMatomoConfigured()) return;
    
    // Use a virtual page for API tracking instead of actual API endpoints
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/api-activity`;
    
    await serverTrackEvent(
      url,
      MatomoEventCategory.API,
      MatomoEventAction.RATE_LIMITED,
      {
        name: endpoint,
        userId,
        ip: options?.ip,
        userAgent: options?.userAgent,
        customDimensions: createCustomDimensions({
          USER_ID: userId || 'anonymous',
          API_ENDPOINT: endpoint,
          ERROR_TYPE: 'rate_limit',
        }),
      }
    );
  },
};

/**
 * Error tracking functions
 */
export const trackError = {
  /**
   * Track error (server-side)
   */
  async error(
    errorType: string,
    errorMessage: string,
    endpoint: string,
    userId?: string,
    options?: {
      ip?: string;
      userAgent?: string;
      statusCode?: number;
    }
  ) {
    if (!isMatomoConfigured()) return;
    
    // If endpoint is an API path, use a virtual error tracking page instead
    const url = endpoint.startsWith('/api/') 
      ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}/error-tracking`
      : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'}${endpoint}`;
    
    await serverTrackEvent(
      url,
      MatomoEventCategory.ERROR,
      MatomoEventAction.ERROR_OCCURRED,
      {
        name: `${errorType}: ${errorMessage}`,
        value: options?.statusCode,
        userId,
        ip: options?.ip,
        userAgent: options?.userAgent,
        customDimensions: createCustomDimensions({
          USER_ID: userId || 'anonymous',
          ERROR_TYPE: errorType,
          API_ENDPOINT: endpoint,
        }),
      }
    );
  },

  /**
   * Track client-side error
   */
  clientError(errorType: string, errorMessage: string, page: string) {
    clientTrackEvent({
      category: MatomoEventCategory.ERROR,
      action: MatomoEventAction.ERROR_OCCURRED,
      name: `${errorType}: ${errorMessage}`,
      customDimensions: createCustomDimensions({
        ERROR_TYPE: errorType,
      }),
    });
  },
};

/**
 * Engagement tracking functions (client-side)
 */
export const trackEngagement = {
  /**
   * Track button click
   */
  clickButton(buttonName: string, location: string) {
    clientTrackEvent({
      category: MatomoEventCategory.ENGAGEMENT,
      action: MatomoEventAction.CLICK_CTA,
      name: `${buttonName} - ${location}`,
    });
  },

  /**
   * Track form submission
   */
  submitForm(formName: string, success: boolean) {
    clientTrackEvent({
      category: MatomoEventCategory.FORM,
      action: MatomoEventAction.SUBMIT_FORM,
      name: formName,
      value: success ? 1 : 0,
    });
  },

  /**
   * Track analytics view
   */
  viewAnalytics(qrCodeId?: string) {
    clientTrackEvent({
      category: MatomoEventCategory.ANALYTICS,
      action: MatomoEventAction.VIEW_ANALYTICS,
      name: qrCodeId,
      customDimensions: qrCodeId ? createCustomDimensions({
        QR_CODE_ID: qrCodeId,
      }) : undefined,
    });
  },

  /**
   * Track data export
   */
  exportData(dataType: string) {
    clientTrackEvent({
      category: MatomoEventCategory.ANALYTICS,
      action: MatomoEventAction.EXPORT_DATA,
      name: dataType,
    });
  },
};

/**
 * Landing page tracking functions
 */
export const trackLandingPage = {
  /**
   * Track landing page view (client-side)
   */
  view(pageName: string, planShown?: string) {
    clientTrackEvent({
      category: MatomoEventCategory.LANDING_PAGE,
      action: MatomoEventAction.VIEW_LANDING,
      name: pageName,
      customDimensions: createCustomDimensions({
        LANDING_PAGE: pageName,
        PAYMENT_PLAN: planShown,
      }),
    });
  },

  /**
   * Track CTA button click (client-side)
   */
  clickCTA(
    ctaText: string,
    pageName: string,
    location: 'hero' | 'pricing' | 'footer' | 'inline',
    planSelected?: string
  ) {
    const actionMap = {
      hero: MatomoEventAction.CLICK_CTA_HERO,
      pricing: MatomoEventAction.CLICK_CTA_PRICING,
      footer: MatomoEventAction.CLICK_CTA_FOOTER,
      inline: MatomoEventAction.CLICK_CTA,
    };

    clientTrackEvent({
      category: MatomoEventCategory.CTA,
      action: actionMap[location],
      name: `${ctaText} - ${pageName}`,
      customDimensions: createCustomDimensions({
        LANDING_PAGE: pageName,
        CTA_LOCATION: location,
        PAYMENT_PLAN: planSelected,
      }),
    });

    // Track goal for landing page signups/trials
    if (planSelected && ctaText.toLowerCase().includes('trial')) {
      clientTrackGoal({
        goalId: MatomoGoals.LANDING_PAGE_TRIAL,
        customDimensions: createCustomDimensions({
          LANDING_PAGE: pageName,
          PAYMENT_PLAN: planSelected,
        }),
      });
    }
  },

  /**
   * Track demo button click (client-side)
   */
  clickDemo(pageName: string) {
    clientTrackEvent({
      category: MatomoEventCategory.LANDING_PAGE,
      action: MatomoEventAction.CLICK_DEMO,
      name: pageName,
      customDimensions: createCustomDimensions({
        LANDING_PAGE: pageName,
      }),
    });

    clientTrackGoal({
      goalId: MatomoGoals.LANDING_PAGE_DEMO,
      customDimensions: createCustomDimensions({
        LANDING_PAGE: pageName,
      }),
    });
  },

  /**
   * Track pricing view from landing page (client-side)
   */
  viewPricing(pageName: string) {
    clientTrackEvent({
      category: MatomoEventCategory.LANDING_PAGE,
      action: MatomoEventAction.VIEW_PRICING,
      name: pageName,
      customDimensions: createCustomDimensions({
        LANDING_PAGE: pageName,
      }),
    });
  },
};

export default {
  trackUser,
  trackQRCode,
  trackSubscription,
  trackAPI,
  trackError,
  trackEngagement,
  trackLandingPage,
};

