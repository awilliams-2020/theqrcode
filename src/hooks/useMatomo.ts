/**
 * React Hook for Matomo Analytics
 * 
 * Provides easy-to-use tracking functions for React components
 */

import { useEffect } from 'react';
import {
  trackPageView,
  trackEvent,
  trackGoal,
  trackEcommerce,
  setUserId,
  resetUserId,
  trackSiteSearch,
  trackQRCodeEvent,
  trackUserEvent,
  trackSubscriptionEvent,
  trackAPIEvent,
  type MatomoPageViewParams,
  type MatomoEventParams,
  type MatomoGoalParams,
  type MatomoEcommerceParams,
} from '@/lib/matomo';

export interface UseMatomoReturn {
  trackPageView: (params?: MatomoPageViewParams) => void;
  trackEvent: (params: MatomoEventParams) => void;
  trackGoal: (params: MatomoGoalParams) => void;
  trackEcommerce: (params: MatomoEcommerceParams) => void;
  setUserId: (userId: string) => void;
  resetUserId: () => void;
  trackSiteSearch: (keyword: string, category?: string, resultsCount?: number) => void;
  trackQRCodeEvent: (
    action: 'created' | 'scanned' | 'updated' | 'deleted' | 'downloaded',
    qrCodeId?: string,
    additionalData?: Record<string, any>
  ) => void;
  trackUserEvent: (
    action: 'signup' | 'login' | 'logout' | 'profile_update' | 'trial_started',
    userId?: string
  ) => void;
  trackSubscriptionEvent: (
    action: 'upgraded' | 'downgraded' | 'canceled' | 'renewed',
    plan?: string,
    revenue?: number
  ) => void;
  trackAPIEvent: (
    action: 'key_created' | 'request_made' | 'rate_limited',
    apiKeyId?: string
  ) => void;
}

/**
 * Hook to use Matomo analytics in React components
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const matomo = useMatomo();
 * 
 *   const handleClick = () => {
 *     matomo.trackEvent({
 *       category: 'Button',
 *       action: 'click',
 *       name: 'signup-button'
 *     });
 *   };
 * 
 *   return <button onClick={handleClick}>Sign Up</button>;
 * }
 * ```
 */
export function useMatomo(): UseMatomoReturn {
  return {
    trackPageView,
    trackEvent,
    trackGoal,
    trackEcommerce,
    setUserId,
    resetUserId,
    trackSiteSearch,
    trackQRCodeEvent,
    trackUserEvent,
    trackSubscriptionEvent,
    trackAPIEvent,
  };
}

/**
 * Hook to set user ID when user logs in
 * 
 * @example
 * ```tsx
 * function MyApp() {
 *   const session = useSession();
 *   useMatomoUserId(session?.user?.id);
 *   
 *   return <div>...</div>;
 * }
 * ```
 */
export function useMatomoUserId(userId: string | null | undefined): void {
  useEffect(() => {
    if (userId) {
      setUserId(userId);
    } else {
      resetUserId();
    }
  }, [userId]);
}

export default useMatomo;

