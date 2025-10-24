'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'

// Import engagement components dynamically
const AnnouncementBanner = dynamic(() => import('./AnnouncementBanner'), {
  ssr: false,
})

const FeedbackButton = dynamic(() => import('./FeedbackButton'), {
  ssr: false,
})

interface ConditionalMainProps {
  children: React.ReactNode
}

export default function ConditionalMain({ children }: ConditionalMainProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Define landing pages
  const landingPages = [
    '/qr-code-for-restaurants',
    '/qr-code-for-real-estate',
    '/qr-code-for-weddings',
    '/qr-code-for-fitness',
    '/qr-code-for-photographers',
    '/qr-code-for-retail',
    '/qr-code-for-salons',
    '/qr-code-for-food-trucks',
    '/qr-code-for-musicians',
    '/qr-code-for-open-houses',
    '/qr-code-generator',
    '/wifi-qr-code-generator',
    '/qr-code-api',
  ]
  
  const isLandingPage = landingPages.includes(pathname || '')
  
  // Use consistent padding logic to avoid hydration mismatch
  const shouldRemovePadding = pathname?.startsWith('/display/') || pathname?.startsWith('/menu/') || isLandingPage
  const mainClassName = shouldRemovePadding 
    ? "bg-white min-h-screen" // No padding on display routes, menu routes, and landing pages
    : "pt-16 bg-white min-h-screen" // Normal padding
  
  // Don't show engagement features on display routes, menu routes, landing pages, or auth pages
  const shouldShowEngagementFeatures = 
    !pathname?.startsWith('/display/') && 
    !pathname?.startsWith('/menu/') &&
    !isLandingPage &&
    !pathname?.startsWith('/auth/')
  
  return (
    <>
      {/* Announcement Banner - shown to all users on applicable pages */}
      {shouldShowEngagementFeatures && session && (
        <div suppressHydrationWarning>
          {isMounted && <AnnouncementBanner />}
        </div>
      )}
      
      <main className={mainClassName}>
        {children}
      </main>
      
      {/* Feedback Button - shown to authenticated users */}
      {shouldShowEngagementFeatures && session && (
        <div suppressHydrationWarning>
          {isMounted && <FeedbackButton />}
        </div>
      )}
    </>
  )
}
