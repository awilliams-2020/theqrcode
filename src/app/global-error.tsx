'use client'

import Link from 'next/link'
import { QrCode, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <QrCode className="h-24 w-24 text-red-400 mx-auto" />
            </div>
            
            {/* Error Text */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">System Error</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-8">
              We encountered a critical error. Please try refreshing the page or contact support.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <span>Try Again</span>
              </button>
              
              <Link
                href="/"
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <Home className="h-4 w-4" />
                <span>Go Home</span>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
