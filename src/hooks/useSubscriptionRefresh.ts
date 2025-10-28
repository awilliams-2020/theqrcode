import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SubscriptionData {
  plan: string
  status: string
  trialEndsAt: string | null
}

interface UseSubscriptionRefreshReturn {
  refreshSubscription: () => Promise<void>
  isRefreshing: boolean
}

export function useSubscriptionRefresh(): UseSubscriptionRefreshReturn {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const refreshSubscription = useCallback(async () => {
    setIsRefreshing(true)
    try {
      // Fetch the latest subscription data
      const response = await fetch('/api/user/subscription')
      if (response.ok) {
        const data = await response.json()
        // Force a router refresh to get the latest server-side data
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to refresh subscription:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [router])

  return {
    refreshSubscription,
    isRefreshing
  }
}
