'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { QrCode, ArrowLeft, UserPlus } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')

  const getErrorMessage = () => {
    switch (error) {
      case 'Signin':
        return {
          title: 'Account Not Found',
          message: 'No account found with this Google/GitHub account. Please sign up first or use a different sign-in method.',
          action: 'Sign up for a new account'
        }
      case 'OAuthSignin':
        return {
          title: 'Sign-in Error',
          message: 'There was a problem with the OAuth provider. Please try again.',
          action: 'Try again'
        }
      case 'OAuthCallback':
        return {
          title: 'Authentication Error',
          message: 'There was a problem completing the sign-in process. Please try again.',
          action: 'Try again'
        }
      case 'OAuthCreateAccount':
        return {
          title: 'Account Creation Error',
          message: 'There was a problem creating your account. Please try again.',
          action: 'Try again'
        }
      case 'EmailCreateAccount':
        return {
          title: 'Account Creation Error',
          message: 'There was a problem creating your account. Please try again.',
          action: 'Try again'
        }
      case 'Callback':
        return {
          title: 'Authentication Error',
          message: 'There was a problem with the authentication callback. Please try again.',
          action: 'Try again'
        }
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Not Linked',
          message: 'This email is already associated with a different sign-in method. Please use the original sign-in method or contact support.',
          action: 'Contact support'
        }
      case 'EmailSignin':
        return {
          title: 'Email Sign-in Error',
          message: 'There was a problem with email sign-in. Please check your email and try again.',
          action: 'Try again'
        }
      case 'CredentialsSignin':
        return {
          title: 'Sign-in Error',
          message: 'Invalid email or password. Please check your credentials and try again.',
          action: 'Try again'
        }
      case 'SessionRequired':
        return {
          title: 'Session Required',
          message: 'You must be signed in to access this page.',
          action: 'Sign in'
        }
      default:
        return {
          title: 'Authentication Error',
          message: 'An unexpected error occurred during sign-in. Please try again.',
          action: 'Try again'
        }
    }
  }

  const errorInfo = getErrorMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <QrCode className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">TheQRCode</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {errorInfo.title}
          </h1>
        </div>

        {/* Error Message */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-gray-600 mb-6">
              {errorInfo.message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {error === 'Signin' ? (
              <button
                onClick={() => router.push('/auth/signup')}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign up for a new account
              </button>
            ) : null}

            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <button
                onClick={() => router.push('/help')}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Contact Support
              </button>
            </p>
          </div>
        </div>

        {/* Demo Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Want to see how it works first?{' '}
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
