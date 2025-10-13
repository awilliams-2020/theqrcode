'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SubscriptionSetupForm() {
  const [isSettingUp, setIsSettingUp] = useState(true)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const setupSubscription = async () => {
      try {
        // Get plan from URL or cookie
        const planParam = searchParams?.get('plan')
        let selectedPlan = 'free'

        // Business plan is temporarily hidden
        if (planParam && ['starter', 'pro'].includes(planParam)) {
          selectedPlan = planParam
        } else {
          // Check cookie for stored plan
          const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('signupPlan='))
            ?.split('=')[1]
          
          // Business plan is temporarily hidden
          if (cookieValue && ['starter', 'pro'].includes(cookieValue)) {
            selectedPlan = cookieValue
          }
        }

        // Only setup subscription if it's not free
        if (selectedPlan !== 'free') {
          const response = await fetch('/api/auth/setup-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ plan: selectedPlan }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to setup subscription')
          }

          const data = await response.json()
          console.log('Subscription setup completed:', data)

          // Check if user should be redirected to checkout (returning user without trial)
          if (data.shouldRedirectToCheckout && data.requestedPlan) {
            console.log('Redirecting to checkout for plan:', data.requestedPlan)
            
            // Create checkout session
            const checkoutResponse = await fetch('/api/stripe/checkout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ plan: data.requestedPlan }),
            })

            if (!checkoutResponse.ok) {
              throw new Error('Failed to create checkout session')
            }

            const checkoutData = await checkoutResponse.json()
            
            // Redirect to checkout
            if (checkoutData.url) {
              window.location.href = checkoutData.url
              return // Don't proceed with normal flow
            }
          }
        }

        // Clear the cookie
        document.cookie = 'signupPlan=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        setIsSettingUp(false)
      } catch (error) {
        console.error('Error setting up subscription:', error)
        setError('Failed to setup subscription. You can upgrade later from your dashboard.')
        setIsSettingUp(false)
      }
    }

    setupSubscription()
  }, [searchParams])

  if (isSettingUp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">{error}</p>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Redirect to dashboard
  window.location.href = '/dashboard'
  return null
}

export default function SubscriptionSetup() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    }>
      <SubscriptionSetupForm />
    </Suspense>
  )
}
