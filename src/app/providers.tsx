'use client'

import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from '@/hooks/useToast'
import MatomoUserTracking from '@/components/MatomoUserTracking'
import MatomoPageTracker from '@/components/MatomoPageTracker'
import SentryProvider from '@/components/SentryProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SentryProvider>
        <MatomoPageTracker />
        <MatomoUserTracking />
        <ToastProvider>
          {children}
        </ToastProvider>
      </SentryProvider>
    </SessionProvider>
  )
}
