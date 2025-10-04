'use client'

import { useEffect } from 'react'

interface PageProps {
  params: {
    shortCode: string
  }
}

export default function QRCodePage({ params }: PageProps) {
  useEffect(() => {
    // Redirect immediately to the tracking API
    window.location.href = `/api/track/${params.shortCode}`
  }, [params.shortCode])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
