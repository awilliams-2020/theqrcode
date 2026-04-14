'use client'

import { SessionProvider } from 'next-auth/react'
import { type Session } from 'next-auth'
import { ToastProvider } from '@/hooks/useToast'
import MatomoUserTracking from '@/components/MatomoUserTracking'
import MatomoPageTracker from '@/components/MatomoPageTracker'
import { OAuthSignupGoalTracker } from '@/components/OAuthSignupGoalTracker'

export function Providers({ children, session }: { children: React.ReactNode; session?: Session | null }) {
  return (
    <SessionProvider session={session}>
      <MatomoPageTracker />
      <MatomoUserTracking />
      <OAuthSignupGoalTracker />
      <ToastProvider>
        {children}
      </ToastProvider>
    </SessionProvider>
  )
}
