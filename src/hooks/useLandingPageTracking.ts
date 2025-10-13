/**
 * Hook for landing page tracking
 * 
 * Provides easy-to-use tracking for landing pages with automatic page view tracking
 */

'use client';

import { useEffect, useCallback } from 'react';
import { trackLandingPage } from '@/lib/matomo-tracking';

export function useLandingPageTracking(pageName: string, planShown?: string) {
  // Track page view on mount
  useEffect(() => {
    trackLandingPage.view(pageName, planShown);
  }, [pageName, planShown]);

  // Provide tracking functions
  const trackCTA = useCallback(
    (
      ctaText: string,
      location: 'hero' | 'pricing' | 'footer' | 'inline',
      planSelected?: string
    ) => {
      trackLandingPage.clickCTA(ctaText, pageName, location, planSelected);
    },
    [pageName]
  );

  const trackDemo = useCallback(() => {
    trackLandingPage.clickDemo(pageName);
  }, [pageName]);

  const trackPricingView = useCallback(() => {
    trackLandingPage.viewPricing(pageName);
  }, [pageName]);

  return {
    trackCTA,
    trackDemo,
    trackPricingView,
  };
}

export default useLandingPageTracking;

