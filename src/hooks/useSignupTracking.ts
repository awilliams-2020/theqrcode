/**
 * Hook for comprehensive signup tracking
 * 
 * Provides easy-to-use tracking for the entire signup flow
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackSignup } from '@/lib/matomo-tracking';

interface UseSignupTrackingOptions {
  pageName?: string;
  source?: string;
}

export function useSignupTracking(options: UseSignupTrackingOptions = {}) {
  const searchParams = useSearchParams();
  const signupStartTime = useRef<number | null>(null);
  const currentPlan = useRef<string>('free');
  const currentMethod = useRef<string | null>(null);

  // Track signup page view on mount
  useEffect(() => {
    const plan = searchParams?.get('plan') || 'free';
    const source = options.source || 'direct';
    
    currentPlan.current = plan;
    signupStartTime.current = Date.now();
    
    trackSignup.viewSignupPage(plan, source);
  }, [searchParams, options.source]);

  // Track plan selection
  const trackPlanSelection = useCallback((plan: string) => {
    currentPlan.current = plan;
    trackSignup.selectPlan(plan, 'signup_page');
  }, []);

  // Track auth method selection
  const trackAuthMethodSelection = useCallback((method: 'google' | 'github' | 'password') => {
    currentMethod.current = method;
    trackSignup.selectAuthMethod(method, currentPlan.current);
  }, []);

  // Track signup form start
  const trackSignupFormStart = useCallback((method: 'google' | 'github' | 'password') => {
    currentMethod.current = method;
    trackSignup.startSignupForm(method, currentPlan.current);
  }, []);

  // Track signup form success
  const trackSignupFormSuccess = useCallback((method: 'google' | 'github' | 'password') => {
    trackSignup.completeSignupForm(method, currentPlan.current);
    
    // Track trial start if not free plan
    if (currentPlan.current !== 'free') {
      trackSignup.startTrial(currentPlan.current, options.source);
    }
    
    // Track signup completion
    trackSignup.completeSignup(currentPlan.current, method, options.source);
  }, [options.source]);

  // Track signup form error
  const trackSignupFormError = useCallback((method: 'google' | 'github' | 'password', errorType: string) => {
    trackSignup.errorSignupForm(method, errorType, currentPlan.current);
  }, []);

  // Track signup abandonment
  const trackSignupAbandonment = useCallback((step: 'plan_selection' | 'auth_method' | 'form_filling') => {
    trackSignup.abandonSignup(step, currentPlan.current);
  }, []);

  // Track CTA clicks
  const trackSignupCTA = useCallback((
    ctaText: string,
    location: 'navbar' | 'hero' | 'pricing' | 'footer' | 'inline',
    planSelected?: string
  ) => {
    trackSignup.clickSignupCTA(ctaText, location, options.pageName || 'signup', planSelected);
  }, [options.pageName]);

  // Track page visibility changes for abandonment detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && signupStartTime.current) {
        const timeOnPage = Date.now() - signupStartTime.current;
        // If user spent more than 30 seconds and left, track abandonment
        if (timeOnPage > 30000) {
          trackSignupAbandonment('form_filling');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [trackSignupAbandonment]);

  // Track beforeunload for abandonment detection
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (signupStartTime.current) {
        const timeOnPage = Date.now() - signupStartTime.current;
        if (timeOnPage > 10000) { // At least 10 seconds
          trackSignupAbandonment('form_filling');
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [trackSignupAbandonment]);

  return {
    trackPlanSelection,
    trackAuthMethodSelection,
    trackSignupFormStart,
    trackSignupFormSuccess,
    trackSignupFormError,
    trackSignupAbandonment,
    trackSignupCTA,
    currentPlan: currentPlan.current,
    currentMethod: currentMethod.current,
  };
}

export default useSignupTracking;
