import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import dynamic from 'next/dynamic'

// Import components dynamically to avoid SSR issues
const ConditionalNavbar = dynamic(() => import('@/components/ConditionalNavbar'), {
  ssr: true,
  loading: () => <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200" />
})

const ConditionalMain = dynamic(() => import('@/components/ConditionalMain'), {
  ssr: true,
  loading: () => <main className="pt-16 bg-white min-h-screen" />
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QR Analytics - Create & Track QR Codes',
  description: 'Generate beautiful QR codes and track their performance with detailed analytics. Perfect for businesses, marketers, and developers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ConditionalNavbar />
          <ConditionalMain>
            {children}
          </ConditionalMain>
        </Providers>
      </body>
    </html>
  )
}