'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { setUser } from '@/lib/sentry'
import { useSession } from 'next-auth/react'

export default function SentryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    // Set user context
    if (session?.user) {
      setUser({
        id: session.user.id || '',
        email: session.user.email || '',
        plan: 'unknown' // You might want to fetch this from your user data
      })
    }
  }, [pathname, session])

  return <>{children}</>
}
