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
  
  // Hide navbar on display routes
  const shouldHideNavbar = pathname.startsWith('/display/')
  
  if (shouldHideNavbar) {
    return null
  }
  
  return <Navbar />
}
