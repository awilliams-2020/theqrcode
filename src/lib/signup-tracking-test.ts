/**
 * Test utility for signup tracking
 * 
 * This file provides test functions to verify that signup tracking is working correctly
 */

import { trackSignup } from './matomo-tracking';

/**
 * Test all signup tracking functions
 * This should be called in development to verify tracking is working
 */
export function testSignupTracking() {
  console.log('🧪 Testing comprehensive signup tracking...');
  
  try {
    // Test CTA click tracking
    trackSignup.clickSignupCTA('Get Started', 'hero', 'home', 'free');
    console.log('✅ CTA click tracking test passed');
    
    // Test signup page view
    trackSignup.viewSignupPage('free', 'test');
    console.log('✅ Signup page view tracking test passed');
    
    // Test plan selection
    trackSignup.selectPlan('pro', 'pricing_page');
    console.log('✅ Plan selection tracking test passed');
    
    // Test auth method selection
    trackSignup.selectAuthMethod('google', 'pro');
    console.log('✅ Auth method selection tracking test passed');
    
    // Test form start
    trackSignup.startSignupForm('google', 'pro');
    console.log('✅ Form start tracking test passed');
    
    // Test form success
    trackSignup.completeSignupForm('google', 'pro');
    console.log('✅ Form success tracking test passed');
    
    // Test trial start
    trackSignup.startTrial('pro', 'test');
    console.log('✅ Trial start tracking test passed');
    
    // Test signup completion
    trackSignup.completeSignup('pro', 'google', 'test');
    console.log('✅ Signup completion tracking test passed');
    
    // Test error tracking
    trackSignup.errorSignupForm('password', 'validation_error', 'free');
    console.log('✅ Error tracking test passed');
    
    // Test abandonment tracking
    trackSignup.abandonSignup('form_filling', 'pro');
    console.log('✅ Abandonment tracking test passed');
    
    console.log('🎉 All signup tracking tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Signup tracking test failed:', error);
  }
}

/**
 * Test specific signup flow scenarios
 */
export function testSignupFlowScenarios() {
  console.log('🧪 Testing signup flow scenarios...');
  
  // Scenario 1: Free plan signup
  console.log('Testing free plan signup flow...');
  trackSignup.clickSignupCTA('Get Started', 'hero', 'home', 'free');
  trackSignup.viewSignupPage('free', 'home');
  trackSignup.selectAuthMethod('google', 'free');
  trackSignup.startSignupForm('google', 'free');
  trackSignup.completeSignupForm('google', 'free');
  trackSignup.completeSignup('free', 'google', 'home');
  
  // Scenario 2: Pro plan trial
  console.log('Testing pro plan trial flow...');
  trackSignup.clickSignupCTA('Subscribe Pro', 'pricing', 'home', 'pro');
  trackSignup.selectPlan('pro', 'pricing_page');
  trackSignup.viewSignupPage('pro', 'pricing');
  trackSignup.selectAuthMethod('github', 'pro');
  trackSignup.startSignupForm('github', 'pro');
  trackSignup.completeSignupForm('github', 'pro');
  trackSignup.startTrial('pro', 'pricing');
  trackSignup.completeSignup('pro', 'github', 'pricing');
  
  // Scenario 3: Failed signup
  console.log('Testing failed signup flow...');
  trackSignup.clickSignupCTA('Get Started', 'navbar', 'home', 'starter');
  trackSignup.viewSignupPage('starter', 'home');
  trackSignup.selectAuthMethod('password', 'starter');
  trackSignup.startSignupForm('password', 'starter');
  trackSignup.errorSignupForm('password', 'api_error', 'starter');
  trackSignup.abandonSignup('form_filling', 'starter');
  
  console.log('🎉 All signup flow scenario tests completed!');
}

// Export for use in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).testSignupTracking = testSignupTracking;
  (window as any).testSignupFlowScenarios = testSignupFlowScenarios;
}
