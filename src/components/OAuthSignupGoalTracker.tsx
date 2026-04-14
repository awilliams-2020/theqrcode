/**
 * OAuth Signup Goal Tracker
 *
 * Fires the Matomo "User Signup" goal when the user lands after completing
 * Google/GitHub OAuth signup. Server-side goal tracking in auth.ts runs without
 * the browser's Matomo visitor cookie, so the goal is attributed to a different
 * visit. This component runs client-side on /auth/setup or /dashboard so the
 * goal is attributed to the same visit as the signup flow.
 */

'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { isMatomoConfigured } from '@/lib/matomo'
import { trackSignup } from '@/lib/matomo-tracking'

const PENDING_COOKIE = 'matomo_signup_pending'

function getMatomoSignupPending(): { plan: string; method: 'google' | 'github' } | null {
  const row = document.cookie
    .split('; ')
    .find((r) => r.startsWith(`${PENDING_COOKIE}=`))
  if (!row) return null
  const eq = row.indexOf('=')
  const value = decodeURIComponent(eq >= 0 ? row.slice(eq + 1).trim() : '')
  const parts = value.split(':')
  const plan = parts[0] ?? 'free'
  const method = parts[1] === 'google' || parts[1] === 'github' ? parts[1] : null
  if (!method) return null
  return { plan, method }
}

function clearMatomoSignupPending(): void {
  document.cookie = `${PENDING_COOKIE}=; path=/; max-age=0`
}

export function OAuthSignupGoalTracker() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const firedRef = useRef(false)

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return
    if (pathname !== '/auth/setup' && pathname !== '/dashboard') return
    if (firedRef.current) return
    if (!isMatomoConfigured()) return

    const pending = getMatomoSignupPending()
    if (!pending) return

    trackSignup.completeSignup(pending.plan, pending.method, 'direct')
    firedRef.current = true
    clearMatomoSignupPending()
  }, [status, session?.user?.id, pathname])

  return null
}

export default OAuthSignupGoalTracker
