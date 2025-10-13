import { Metadata } from 'next'
import PhotographerLanding from '@/components/landing/PhotographerLanding'

export const metadata: Metadata = {
  title: 'Photographer QR Code Generator | Portfolio & Booking Links - TheQRCode.io',
  description: 'Create QR codes for your photography portfolio, booking calendar, and client galleries. Track engagement with analytics. Perfect for business cards and marketing materials.',
  keywords: 'photographer qr code, portfolio qr code, photography business card qr, booking qr code, client gallery qr, photography marketing',
  openGraph: {
    title: 'Photographer QR Code Generator | Share Your Portfolio Instantly',
    description: 'Modern QR codes for photographers. Share portfolios, book clients, and deliver amazing experiences.',
    type: 'website',
  },
}

export default function PhotographerLandingPage() {
  return <PhotographerLanding />
}

