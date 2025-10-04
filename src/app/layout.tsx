import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import ConditionalNavbar from '@/components/ConditionalNavbar'
import ConditionalMain from '@/components/ConditionalMain'

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