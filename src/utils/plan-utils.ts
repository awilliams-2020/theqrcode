import { PlanType } from '@/types'
import { PLAN_TYPES, PLAN_LIMITS, PLAN_DISPLAY_NAMES } from '@/constants'

export interface PlanFeatures {
  hasColorCustomization: boolean
  hasAdvancedCustomization: boolean
  hasProFeatures: boolean
  hasSizeCustomization: boolean
  hasAllQRTypes: boolean
}

export function getPlanFeatures(currentPlan: PlanType, isTrialActive: boolean = false): PlanFeatures {
  const paidPlans = [PLAN_TYPES.STARTER, PLAN_TYPES.PRO, PLAN_TYPES.BUSINESS]
  const proPlans = [PLAN_TYPES.PRO, PLAN_TYPES.BUSINESS]
  
  // For trials, features should be based on the actual plan being trialed, not just "any trial"
  const effectivePlan = currentPlan
  
  return {
    hasColorCustomization: paidPlans.includes(effectivePlan as any),
    hasAdvancedCustomization: paidPlans.includes(effectivePlan as any),
    hasProFeatures: proPlans.includes(effectivePlan as any),
    hasSizeCustomization: effectivePlan !== PLAN_TYPES.FREE,
    hasAllQRTypes: paidPlans.includes(effectivePlan as any)
  }
}

export function getPlanLimits(plan: PlanType) {
  return PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS[PLAN_TYPES.FREE]
}

export function getPlanDisplayName(plan: PlanType): string {
  return PLAN_DISPLAY_NAMES[plan as keyof typeof PLAN_DISPLAY_NAMES] || PLAN_DISPLAY_NAMES[PLAN_TYPES.FREE]
}
