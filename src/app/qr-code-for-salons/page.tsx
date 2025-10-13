import { Metadata } from 'next'
import SalonLanding from '@/components/landing/SalonLanding'

export const metadata: Metadata = {
  title: 'Hair Salon & Spa QR Code Generator | Booking & Reviews - TheQRCode.io',
  description: 'Create QR codes for salon booking, customer reviews, loyalty programs, and service menus. Track client engagement with analytics. Perfect for hair salons, spas, and beauty professionals.',
  keywords: 'salon qr code, spa qr code, hair salon booking qr, beauty salon qr, review collection qr, salon loyalty program',
  openGraph: {
    title: 'Salon QR Code Generator | Fill Your Appointment Book',
    description: 'Automate bookings, collect reviews, and build loyalty with QR codes for salons and spas.',
    type: 'website',
  },
}

export default function SalonLandingPage() {
  return <SalonLanding />
}

