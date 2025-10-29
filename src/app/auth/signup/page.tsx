'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QrCode, CheckCircle, ArrowLeft, Lock } from 'lucide-react'
import { useSignupTracking } from '@/hooks/useSignupTracking'


type AuthMethod = 'oauth' | 'password'

function SignUpForm() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGitHubLoading, setIsGitHubLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [error, setError] = useState('')
  const [authMethod, setAuthMethod] = useState<AuthMethod>('oauth')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('free')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize comprehensive signup tracking
  const {
    trackPlanSelection,
    trackAuthMethodSelection,
    trackSignupFormStart,
    trackSignupFormSuccess,
    trackSignupFormError,
    trackSignupAbandonment,
  } = useSignupTracking({
    pageName: 'signup',
    source: searchParams?.get('source') || 'direct'
  })

  useEffect(() => {
    // Get plan from URL parameters
    const plan = searchParams?.get('plan')
    // Business plan is temporarily hidden
    if (plan && ['free', 'starter', 'pro'].includes(plan)) {
      setSelectedPlan(plan)
      trackPlanSelection(plan)
    }

    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router, searchParams, trackPlanSelection])

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true)
      setError('')
      
      // Track auth method selection and form start
      trackAuthMethodSelection('google')
      trackSignupFormStart('google')
      
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
      
      // Use standard OAuth flow
      await signIn('google', {
        callbackUrl: selectedPlan !== 'free' ? `/auth/setup?plan=${selectedPlan}` : '/dashboard'
      })
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      trackSignupFormError('google', 'oauth_error')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleGitHubSignUp = async () => {
    try {
      setIsGitHubLoading(true)
      setError('')
      
      // Track auth method selection and form start
      trackAuthMethodSelection('github')
      trackSignupFormStart('github')
      
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
      
      // Use standard OAuth flow
      await signIn('github', {
        callbackUrl: selectedPlan !== 'free' ? `/auth/setup?plan=${selectedPlan}` : '/dashboard'
      })
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      trackSignupFormError('github', 'oauth_error')
    } finally {
      setIsGitHubLoading(false)
    }
  }


  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please enter your email and password')
      trackSignupFormError('password', 'validation_error')
      return
    }

    try {
      setIsPasswordLoading(true)
      setError('')

      // Track auth method selection and form start
      trackAuthMethodSelection('password')
      trackSignupFormStart('password')

      // Create account with password
      const response = await fetch('/api/auth/signup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create account')
        trackSignupFormError('password', 'api_error')
        return
      }

      // Store plan if not free
      if (selectedPlan !== 'free') {
        await fetch('/api/auth/signup-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: selectedPlan }),
        })
      }

      // Sign in with the new account
      const result = await signIn('password', {
        email,
        password,
        redirect: false,
        callbackUrl: selectedPlan !== 'free' ? `/auth/setup?plan=${selectedPlan}` : '/dashboard',
      })

      if (result?.error) {
        setError(result.error)
        trackSignupFormError('password', 'signin_error')
      } else if (result?.ok) {
        // Track successful signup
        trackSignupFormSuccess('password')
        
        await getSession()
        if (selectedPlan !== 'free') {
          router.push(`/auth/setup?plan=${selectedPlan}`)
        } else {
          router.push('/dashboard')
        }
        router.refresh()
      }
    } catch (error) {
      setError('Failed to create account. Please try again.')
      trackSignupFormError('password', 'network_error')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const switchAuthMethod = (method: AuthMethod) => {
    setAuthMethod(method)
    setEmail('')
    setPassword('')
    setName('')
    setError('')
    
    // Track auth method switch
    if (method === 'password') {
      trackAuthMethodSelection('password')
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
      '500,000 scans per month',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 pt-20">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <QrCode className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">TheQRCode</span>
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

          {/* Auth Method Tabs */}
          {authMethod !== 'oauth' && (
            <button
              onClick={() => switchAuthMethod('oauth')}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to sign-up options
            </button>
          )}

          {authMethod === 'oauth' ? (
            <div className="space-y-4">
              <button
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading || isGitHubLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
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

              <button
                onClick={handleGitHubSignUp}
                disabled={isGoogleLoading || isGitHubLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGitHubLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    Sign up with GitHub
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>

              <button
                onClick={() => switchAuthMethod('password')}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Lock className="w-5 h-5 mr-2" />
                Sign up with Password
              </button>
            </div>
          ) : authMethod === 'password' ? (
            <form onSubmit={handlePasswordSignUp} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name (optional)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email-pass" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email-pass"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  At least 8 characters with a number and letter
                </p>
              </div>
              <button
                type="submit"
                disabled={isPasswordLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPasswordLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          ) : null}

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
              onClick={() => router.push('/qr-code-generator')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Try Generator
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center pt-20">
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
