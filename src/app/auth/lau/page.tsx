'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LauPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Missing token')
      return
    }
    signIn('lau', { token, callbackUrl: '/dashboard', redirect: true }).then((res) => {
      if (res?.error) {
        setError('Invalid or expired link. Please try again from the admin panel.')
      }
    })
  }, [token])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/auth/signin" className="text-blue-600 hover:underline">
            Go to sign in
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600">Logging you in...</p>
    </div>
  )
}
