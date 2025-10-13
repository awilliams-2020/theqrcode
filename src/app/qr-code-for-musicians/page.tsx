import { Metadata } from 'next'
import MusicianLanding from '@/components/landing/MusicianLanding'

export const metadata: Metadata = {
  title: 'Musician & DJ QR Code Generator | EPK & Booking Links - TheQRCode.io',
  description: 'Create QR codes for your EPK, booking info, streaming links, and social media. Track fan engagement with analytics. Perfect for musicians, DJs, and bands.',
  keywords: 'musician qr code, dj qr code, epk qr code, music booking qr, spotify qr code, band qr code, artist promotion',
  openGraph: {
    title: 'Musician QR Code Generator | Share Your Music & Book Gigs',
    description: 'Connect fans to your music, grow your following, and book more gigs with QR codes.',
    type: 'website',
  },
}

export default function MusicianLandingPage() {
  return <MusicianLanding />
}

