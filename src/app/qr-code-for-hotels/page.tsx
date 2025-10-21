import { Metadata } from 'next'
import HotelsLanding from '@/components/landing/HotelsLanding'

export const metadata: Metadata = {
  title: 'Hotel QR Code Generator | Guest WiFi & Services Made Easy - TheQRCode.io',
  description: 'Create QR codes for hotel WiFi access, digital services, in-room amenities, and guest information. Perfect for hotels, resorts, and hospitality businesses.',
  keywords: 'hotel qr code, guest wifi qr, hotel services qr, hospitality qr code, resort qr code, guest services qr, hotel check-in qr',
  openGraph: {
    title: 'Hotel QR Code Generator | Enhance Guest Experience',
    description: 'Streamline guest services with QR codes for WiFi, amenities, and hotel information.',
    type: 'website',
  },
}

export default function HotelsLandingPage() {
  return <HotelsLanding />
}
