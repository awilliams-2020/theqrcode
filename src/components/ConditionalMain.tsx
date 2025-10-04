'use client'

import { usePathname } from 'next/navigation'

interface ConditionalMainProps {
  children: React.ReactNode
}

export default function ConditionalMain({ children }: ConditionalMainProps) {
  const pathname = usePathname()
  
  // Remove top padding on display routes since navbar is hidden
  const isDisplayRoute = pathname.startsWith('/display/')
  const mainClassName = isDisplayRoute 
    ? "bg-white min-h-screen" 
    : "pt-16 bg-white min-h-screen"
  
  return (
    <main className={mainClassName}>
      {children}
    </main>
  )
}
