/**
 * Hook to track errors in React components
 * 
 * Use this hook to track and report errors to Matomo
 */

'use client';

import { useCallback, useEffect } from 'react';
import { trackError } from '@/lib/matomo-tracking';

export function useTrackError() {
  const logError = useCallback((errorType: string, errorMessage: string, page: string) => {
    trackError.clientError(errorType, errorMessage, page);
  }, []);

  return { logError };
}

/**
 * Hook to automatically track unhandled errors on a page
 */
export function useErrorTracking(pageName: string) {
  const { logError } = useTrackError();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logError(
        'JavaScript Error',
        `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
        pageName
      );
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      logError(
        'Unhandled Promise Rejection',
        event.reason?.toString() || 'Unknown error',
        pageName
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [pageName, logError]);
}

export default useTrackError;

