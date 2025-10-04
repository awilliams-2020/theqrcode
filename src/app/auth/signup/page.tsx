'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QrCode, CheckCircle } from 'lucide-react'

function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('free')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get plan from URL parameters
    const plan = searchParams.get('plan')
    if (plan && ['free', 'starter', 'pro', 'business'].includes(plan)) {
      setSelectedPlan(plan)
    }

    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router, searchParams])

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // Store the selected plan in a cookie for the auth callback
      if (selectedPlan !== 'free') {
        await fetch('/api/auth/signup-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plan: selectedPlan }),
        })
      }
      
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: selectedPlan !== 'free' ? `/auth/setup?plan=${selectedPlan}` : '/dashboard'
      })

      if (result?.error) {
        setError('Failed to create account. Please try again.')
      } else if (result?.ok) {
        if (selectedPlan !== 'free') {
          router.push(`/auth/setup?plan=${selectedPlan}`)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const planFeatures = {
    free: [
      '10 QR codes',
      '1,000 scans per month',
      'Basic analytics',
      'URL, Text, WiFi, Contact types',
      'Basic customization'
    ],
    starter: [
      '100 QR codes',
      '10,000 scans per month',
      'Advanced analytics',
      'All QR code types',
      'Custom styling',
      'Email support',
      '14-day free trial'
    ],
    pro: [
      '500 QR codes',
      '50,000 scans per month',
      'Real-time analytics',
      'All QR code types',
      'Advanced customization',
      'Priority support',
      'API access',
      '14-day free trial'
    ],
    business: [
      'Unlimited QR codes',
      'Unlimited scans',
      'Enterprise analytics',
      'All QR code types',
      'White label options',
      '24/7 support',
      'Full API access',
      'Custom integrations',
      '14-day free trial'
    ]
  }

  const planNames = {
    free: 'Free',
    starter: 'Starter',
    pro: 'Pro',
    business: 'Business'
  }

  const features = planFeatures[selectedPlan as keyof typeof planFeatures] || planFeatures.free

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <QrCode className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">QR Analytics</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedPlan === 'free' ? 'Start your free account' : `Start your ${planNames[selectedPlan as keyof typeof planNames]} trial`}
          </h2>
          <p className="mt-2 text-gray-600">
            {selectedPlan === 'free' 
              ? 'Create your account and start generating QR codes with analytics'
              : `Get 14 days free with full ${planNames[selectedPlan as keyof typeof planNames]} features`
            }
          </p>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What you get:
          </h3>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </>
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already signed up?{' '}
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Want to try it first?{' '}
            <button
              onClick={() => router.push('/demo')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              View Demo
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  )
}
