import { Metadata } from 'next'
import QRGeneratorLanding from '@/components/landing/QRGeneratorLanding'

export const metadata: Metadata = {
  title: 'Free QR Code Generator | Create Custom QR Codes Instantly - TheQRCode.io',
  description: 'Generate free QR codes in seconds. Create custom QR codes for URLs, WiFi, contacts, and more. Track scans with advanced analytics. No credit card required to start.',
  keywords: 'qr code generator, create qr code, qr code maker, free qr code, custom qr code, qr code creator',
  openGraph: {
    title: 'Free QR Code Generator | Create Custom QR Codes',
    description: 'Generate free QR codes in seconds with advanced analytics tracking',
    type: 'website',
  },
}

export default function QRGeneratorLandingPage() {
  return <QRGeneratorLanding />
}

