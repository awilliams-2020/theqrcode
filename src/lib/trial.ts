/**
 * Trial Management Utilities
 * Handles free trial period logic and status checks
 */

export const TRIAL_DAYS = 14;

/**
 * Calculate trial end date from creation date
 */
export function calculateTrialEndDate(startDate: Date = new Date()): Date {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + TRIAL_DAYS);
  return endDate;
}

/**
 * Check if a trial is currently active
 */
export function isTrialActive(trialEndsAt: Date | null | undefined): boolean {
  if (!trialEndsAt) return false;
  return new Date() < new Date(trialEndsAt);
}

/**
 * Check if a trial has expired
 */
export function isTrialExpired(trialEndsAt: Date | null | undefined): boolean {
  if (!trialEndsAt) return false;
  return new Date() >= new Date(trialEndsAt);
}

/**
 * Get the number of days remaining in trial
 */
export function getTrialDaysRemaining(trialEndsAt: Date | null | undefined): number {
  if (!trialEndsAt) return 0;
  
  const now = new Date();
  const endDate = new Date(trialEndsAt);
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Check if user should see trial warning (3 days or less remaining)
 */
export function shouldShowTrialWarning(trialEndsAt: Date | null | undefined): boolean {
  const daysRemaining = getTrialDaysRemaining(trialEndsAt);
  return daysRemaining > 0 && daysRemaining <= 3;
}

/**
 * Format trial status message
 */
export function getTrialStatusMessage(trialEndsAt: Date | null | undefined): string {
  if (!trialEndsAt) return '';
  
  const daysRemaining = getTrialDaysRemaining(trialEndsAt);
  
  if (daysRemaining === 0) {
    return 'Your trial has expired';
  } else if (daysRemaining === 1) {
    return 'Your trial expires tomorrow';
  } else if (daysRemaining <= 3) {
    return `Your trial expires in ${daysRemaining} days`;
  } else {
    return `${daysRemaining} days left in your trial`;
  }
}

/**
 * Check if user has access based on subscription and trial status
 */
export function hasActiveAccess(
  status: string,
  plan: string,
  trialEndsAt: Date | null | undefined
): boolean {
  // If user has a paid plan, they have access
  if (plan !== 'free' && status === 'active') {
    return true;
  }
  
  // If on free plan and active, they have access
  if (plan === 'free' && status === 'active') {
    return true;
  }
  
  // If on any plan and trialing, check if trial is active
  if (status === 'trialing') {
    return isTrialActive(trialEndsAt);
  }
  
  // No access
  return false;
}

