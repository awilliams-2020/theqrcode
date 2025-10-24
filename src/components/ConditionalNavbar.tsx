'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Hide navbar on display routes and all landing pages
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
  
  const shouldHideNavbar = 
    pathname?.startsWith('/display/') || 
    pathname?.startsWith('/menu/') ||
    landingPages.includes(pathname || '')
  
  // Use suppressHydrationWarning to prevent hydration mismatch
  if (shouldHideNavbar) {
    return <div suppressHydrationWarning>{isMounted ? null : <Navbar />}</div>
  }
  
  return <Navbar />
}
