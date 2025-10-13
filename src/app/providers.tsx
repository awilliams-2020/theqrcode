'use client'

import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from '@/hooks/useToast'
import MatomoUserTracking from '@/components/MatomoUserTracking'
import MatomoPageTracker from '@/components/MatomoPageTracker'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MatomoPageTracker />
      <MatomoUserTracking />
      <ToastProvider>
        {children}
      </ToastProvider>
    </SessionProvider>
  )
}
