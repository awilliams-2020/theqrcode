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
  
  // Always show navbar during SSR, then conditionally hide on client
  if (!isMounted) {
    return <Navbar />
  }
  
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
  
  if (shouldHideNavbar) {
    return null
  }
  
  return <Navbar />
}
