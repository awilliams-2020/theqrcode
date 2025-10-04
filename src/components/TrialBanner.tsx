'use client'

import { AlertCircle, Clock, Sparkles } from 'lucide-react'
import { getTrialDaysRemaining, getTrialStatusMessage, shouldShowTrialWarning, isTrialExpired } from '@/lib/trial'

interface TrialBannerProps {
  trialEndsAt: Date | null | undefined
  status: string
  currentPlan?: string
  onUpgrade?: () => void
  onViewPlans?: () => void
}

export default function TrialBanner({ trialEndsAt, status, currentPlan = 'pro', onUpgrade, onViewPlans }: TrialBannerProps) {
  // Don't show banner if not on trial
  if (status !== 'trialing' || !trialEndsAt) {
    return null
  }

  // Get plan-specific features for trial banner
  const getPlanFeatures = (plan: string) => {
    switch (plan) {
      case 'starter':
        return '100 QR codes, 10,000 scans, and advanced analytics'
      case 'pro':
        return '500 QR codes, 50,000 scans, and advanced analytics'
      case 'business':
        return 'unlimited QR codes, unlimited scans, and enterprise analytics'
      default:
        return 'premium features'
    }
  }

  const planDisplayNames = {
    starter: 'Starter',
    pro: 'Pro', 
    business: 'Business'
  }

  const daysRemaining = getTrialDaysRemaining(trialEndsAt)
  const message = getTrialStatusMessage(trialEndsAt)
  const showWarning = shouldShowTrialWarning(trialEndsAt)
  const expired = isTrialExpired(trialEndsAt)

  // Trial expired
  if (expired) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800 mb-1">
              Your Trial Has Ended
            </h3>
            <p className="text-sm text-red-700 mb-3">
              Your 14-day free trial has expired. Upgrade to a paid plan to continue accessing all features.
            </p>
            {onUpgrade && (
              <button
                onClick={onUpgrade}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Upgrade Now
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Trial warning (3 days or less)
  if (showWarning) {
    return (
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg">
        <div className="flex items-start">
          <Clock className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-orange-800 mb-1">
              Trial Ending Soon
            </h3>
            <p className="text-sm text-orange-700 mb-3">
              {message}. Upgrade now to keep using all premium features.
            </p>
            {onUpgrade && (
              <button
                onClick={onUpgrade}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Upgrade Now
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Trial active (more than 3 days)
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
      <div className="flex items-start">
        <Sparkles className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">
            Free Trial Active - {planDisplayNames[currentPlan as keyof typeof planDisplayNames]} Features Unlocked
          </h3>
          <p className="text-sm text-blue-700 mb-2">
            {message}. You have full access to {planDisplayNames[currentPlan as keyof typeof planDisplayNames]} features including {getPlanFeatures(currentPlan)}!
          </p>
          <div className="flex gap-2">
            <button
              onClick={onUpgrade}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Upgrade to Keep {planDisplayNames[currentPlan as keyof typeof planDisplayNames]} Features
            </button>
            <button
              onClick={onViewPlans || onUpgrade}
              className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              View Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

