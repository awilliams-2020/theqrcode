/**
 * Matomo Page Tracker
 * 
 * Tracks route changes in Next.js App Router
 */

'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isMatomoConfigured } from '@/lib/matomo';

function PageTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only track in production and when Matomo is configured
    if (!isMatomoConfigured()) {
      return;
    }

    if (typeof window !== 'undefined' && window._paq) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      window._paq.push(['setCustomUrl', url]);
      window._paq.push(['setDocumentTitle', document.title]);
      window._paq.push(['trackPageView']);
    }
  }, [pathname, searchParams]);

  return null;
}

export function MatomoPageTracker() {
  return (
    <Suspense fallback={null}>
      <PageTrackerInner />
    </Suspense>
  );
}

export default MatomoPageTracker;

