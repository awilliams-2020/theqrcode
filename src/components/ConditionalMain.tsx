'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ConditionalMainProps {
  children: React.ReactNode
}

export default function ConditionalMain({ children }: ConditionalMainProps) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Use default padding during SSR, then conditionally adjust on client
  const mainClassName = !isMounted 
    ? "pt-16 bg-white min-h-screen" // Default during SSR
    : pathname.startsWith('/display/')
      ? "bg-white min-h-screen" // No padding on display routes
      : "pt-16 bg-white min-h-screen" // Normal padding
  
  return (
    <main className={mainClassName}>
      {children}
    </main>
  )
}
