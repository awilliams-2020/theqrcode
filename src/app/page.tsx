import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import LandingPage from '@/components/LandingPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QR Code IO | QR Code Generator with Analytics - TheQRCode.io',
  description: 'QR Code IO - Generate beautiful QR codes instantly. Track scans with advanced analytics. Free QR code generator for restaurants, events, WiFi, and more. No signup required.',
  keywords: [
    'qr code io', 'qr io', 'qrcode io', 'qr-code.io', 'qr code generator', 
    'qr code analytics', 'free qr code generator', 'qr code maker',
    'restaurant qr code', 'event qr code', 'wifi qr code'
  ],
  openGraph: {
    title: 'QR Code IO | Free QR Code Generator with Analytics',
    description: 'Generate beautiful QR codes instantly. Track performance with advanced analytics. Perfect for businesses, restaurants, and events.',
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