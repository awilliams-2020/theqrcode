import { Metadata } from 'next'
import WeddingLanding from '@/components/landing/WeddingLanding'

export const metadata: Metadata = {
  title: 'Wedding QR Code Generator | RSVP, Registry & Photo Sharing Made Easy',
  description: 'Create beautiful QR codes for wedding RSVPs, registries, photo sharing, and venue info. Track responses in real-time. Free QR code generator perfect for modern weddings and wedding planners. Start free today!',
  keywords: [
    'wedding qr code', 'wedding qr codes', 'qr code for wedding',
    'wedding rsvp qr code', 'wedding registry qr', 'qr code for wedding registry',
    'photo sharing qr code', 'wedding invitation qr', 'wedding planning',
    'qr code for weddings', 'wedding qr code generator', 'free wedding qr code',
    'free wedding website with qr code'
  ],
  openGraph: {
    title: 'Wedding QR Code Generator | RSVP, Registry & Photo Sharing',
    description: 'Automate RSVPs, share registries, and collect photos with beautiful wedding QR codes. Track responses in real-time. Free to start!',
    type: 'website',
    url: 'https://theqrcode.io/qr-code-for-weddings',
  },
  alternates: {
    canonical: '/qr-code-for-weddings',
  },
}

export default function WeddingLandingPage() {
  return <WeddingLanding />
}

