/**
 * Hook to track form submissions
 * 
 * Use this hook to automatically track form submissions with success/error states
 */

'use client';

import { useCallback } from 'react';
import { trackEngagement } from '@/lib/matomo-tracking';

export function useTrackFormSubmission(formName: string) {
  const trackSubmission = useCallback((success: boolean) => {
    trackEngagement.submitForm(formName, success);
  }, [formName]);

  return { trackSubmission };
}

export default useTrackFormSubmission;

