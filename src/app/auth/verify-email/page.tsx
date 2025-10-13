'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [resendMessage, setResendMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link. No token provided.')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage('Your email has been verified successfully!')
          
          // Redirect to signin after 3 seconds
          setTimeout(() => {
            router.push('/auth/signin')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Failed to verify email')
        }
      } catch (error) {
        setStatus('error')
        setMessage('An error occurred while verifying your email')
      }
    }

    verifyEmail()
  }, [token, router])

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!resendEmail || !resendEmail.includes('@')) {
      setResendStatus('error')
      setResendMessage('Please enter a valid email address')
      return
    }

    setResendStatus('sending')
    setResendMessage('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setResendStatus('sent')
        setResendMessage(data.message || 'Verification email sent! Please check your inbox.')
      } else {
        setResendStatus('error')
        setResendMessage(data.error || 'Failed to send verification email')
      }
    } catch (error) {
      setResendStatus('error')
      setResendMessage('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              TheQRCode.io
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Email Verification
            </p>
          </div>

          {/* Status Message */}
          {status === 'loading' && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Verifying your email...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
                <svg className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                Email Verified!
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {message}
              </p>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                Redirecting to sign in page...
              </p>
              <Link
                href="/auth/signin"
                className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Sign In
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900">
                  <svg className="h-8 w-8 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Verification Failed
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {message}
                </p>
              </div>

              {/* Resend Verification Form */}
              <div className="border-t pt-6 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Need a new verification link?
                </h3>
                <form onSubmit={handleResendVerification} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="your@email.com"
                    />
                  </div>

                  {resendMessage && (
                    <div className={`p-3 rounded-md text-sm ${
                      resendStatus === 'sent' 
                        ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {resendMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={resendStatus === 'sending' || resendStatus === 'sent'}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {resendStatus === 'sending' ? 'Sending...' : resendStatus === 'sent' ? 'Email Sent!' : 'Resend Verification Email'}
                  </button>
                </form>
              </div>

              <div className="text-center pt-4">
                <Link
                  href="/auth/signin"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Additional Help */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Need help?{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}

