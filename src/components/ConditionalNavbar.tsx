'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Hide navbar on display routes
  const shouldHideNavbar = pathname.startsWith('/display/')
  
  if (shouldHideNavbar) {
    return null
  }
  
  return <Navbar />
}
