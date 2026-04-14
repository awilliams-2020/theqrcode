import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import LandingPage from '@/components/LandingPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QR Code IO | Free QR Code Generator with Analytics - TheQRCode.io',
  description: 'QR Code IO (qr.io) — free QR code generator with analytics. Create & track QR codes instantly. No signup required. Used by 10,000+ businesses. Restaurants, events, WiFi. Start free →',
  keywords: [
    'qr code io', 'qr io', 'qrcode io', 'qr-code.io', 'qr code generator', 
    'qr code analytics', 'free qr code generator', 'qr code maker',
    'qr code tracker', 'restaurant qr code', 'event qr code', 'wifi qr code',
    'contact qr code', 'qr code creator', 'dynamic qr code', 'qr code with analytics',
    'qr code i o', 'qrcodeio', 'io qr code', 'qr code.io', 'qr.io'
  ],
  openGraph: {
    title: 'QR Code IO | Free QR Code Generator with Analytics',
    description: 'QR Code IO (qr.io) — create custom QR codes in seconds. Track scans with analytics. Perfect for businesses, restaurants, and events. No signup required.',
    type: 'website',
    url: 'https://theqrcode.io',
  },
  alternates: {
    canonical: '/',
  },
}

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }
  
  return <LandingPage />
}