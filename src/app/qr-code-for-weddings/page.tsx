import { Metadata } from 'next'
import WeddingLanding from '@/components/landing/WeddingLanding'

export const metadata: Metadata = {
  title: 'Wedding QR Code Generator | RSVP & Guest Info Made Easy - TheQRCode.io',
  description: 'Create QR codes for wedding RSVPs, registries, photo sharing, and venue info. Track responses in real-time. Perfect for modern weddings and wedding planners.',
  keywords: 'wedding qr code, wedding rsvp qr code, wedding registry qr, photo sharing qr code, wedding invitation qr, wedding planning',
  openGraph: {
    title: 'Wedding QR Code Generator | Simplify Your Special Day',
    description: 'Automate RSVPs, share registries, and collect photos with beautiful wedding QR codes.',
    type: 'website',
  },
}

export default function WeddingLandingPage() {
  return <WeddingLanding />
}

