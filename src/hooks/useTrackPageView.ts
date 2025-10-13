/**
 * Hook to track custom page views with additional metadata
 * 
 * Use this hook when you want to track a page view with custom dimensions
 * or when you want to track specific sections/tabs within a page
 */

'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/lib/matomo';
import { createCustomDimensions } from '@/lib/matomo-config';

interface UseTrackPageViewOptions {
  title?: string;
  customUrl?: string;
  customDimensions?: Record<string, string>;
}

export function useTrackPageView(options?: UseTrackPageViewOptions) {
  useEffect(() => {
    if (options) {
      trackPageView({
        documentTitle: options.title,
        customUrl: options.customUrl,
        customDimensions: options.customDimensions,
      });
    }
  }, [options?.title, options?.customUrl]);
}

export default useTrackPageView;

