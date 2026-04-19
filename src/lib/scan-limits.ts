/**
 * Scan limit logic per plan. Used by the track API to allow or block recording scans.
 * Limits are "per month" in product copy; counting can be all-time or scoped to
 * billing period (stripeCurrentPeriodEnd) when period-based resets are applied.
 */

import { PLAN_LIMITS } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

const PLANS = ['free', 'starter', 'developer', 'pro'] as const
type PlanKey = (typeof PLANS)[number]

/** Scan limit config for each plan (same as PLAN_LIMITS from constants). */
export const SCAN_LIMITS = {
  free: PLAN_LIMITS.free.scans,
  starter: PLAN_LIMITS.starter.scans,
  developer: PLAN_LIMITS.developer.scans,
  pro: PLAN_LIMITS.pro.scans,
} as const

export interface ScanLimitResult {
  allowed: boolean
  currentCount: number
  limit: number
}

/**
 * Pure evaluation: given a plan and current scan count, return whether a new scan is allowed.
 * Use this for unit tests and for consistent limit logic. Supports -1 for unlimited.
 */
export function evaluateScanLimit(
  plan: string,
  currentCount: number
): ScanLimitResult {
  const limit: number = SCAN_LIMITS[plan as PlanKey] ?? SCAN_LIMITS.developer

  if (limit === -1) {
    return { allowed: true, currentCount, limit: -1 }
  }

  return {
    allowed: currentCount < limit,
    currentCount,
    limit,
  }
}

/**
 * Check if the user is within their plan's scan limit by loading subscription and
 * counting scans. Count is all scans for the user's QR codes (no period filter);
 * when period-based resets are used, the count can be scoped to current billing period.
 */
export async function checkScanLimit(userId: string): Promise<ScanLimitResult> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  const currentPlan = (subscription?.plan || 'free') as PlanKey
  const limits = PLAN_LIMITS[currentPlan] ?? PLAN_LIMITS.developer
  const limit: number = limits.scans

  if (limit === -1) {
    return { allowed: true, currentCount: 0, limit: -1 }
  }

  const totalScans = await prisma.scan.count({
    where: {
      qrCode: {
        userId,
      },
    },
  })

  return evaluateScanLimit(currentPlan, totalScans)
}
