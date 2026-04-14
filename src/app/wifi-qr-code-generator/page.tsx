import { Metadata } from 'next'
import WiFiQRLanding from '@/components/landing/WiFiQRLanding'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'WiFi QR Code Generator – Share WiFi in One Scan | Free – TheQRCode.io',
  description: 'Create a WiFi QR code in seconds. Guests scan to connect — no typing. Free. For restaurants, hotels, offices, events. No signup required.',
  keywords: [
    'wifi qr code', 'wifi qr codes', 'wifi qr code generator', 
    'share wifi qr code', 'restaurant wifi qr', 'hotel wifi qr', 
    'wifi access qr', 'free wifi qr code', 'qr code wifi password',
    'wifi qr code maker', 'qr code for wifi password', 'make wifi qr code',
    'create wifi qr code', 'qr wifi password', 'qr code for guest wifi',
    'guest wifi qr code', 'wifi password to qr code', 'wifi password as qr code',
    'make qr code for wifi', 'share wifi qr code', 'qr code connect to wifi',
    'connect to wifi with qr code', 'wifi with qr code', 'qr code wifi network',
    'generate wifi qr code', 'wifi qr share', 'wi fi qr code'
  ],
  openGraph: {
    title: 'WiFi QR Code Generator – Share WiFi in One Scan',
    description: 'Create a WiFi QR code in seconds. Guests scan to connect. Free. For restaurants, hotels, offices, events.',
    type: 'website',
    url: 'https://theqrcode.io/wifi-qr-code-generator',
  },
  alternates: {
    canonical: '/wifi-qr-code-generator',
  },
}

export default function WiFiQRLandingPage() {
  return (
    <>
      <StructuredData
        type="HowTo"
        data={{
          name: 'How to create a WiFi QR code',
          description: 'Create a WiFi QR code so guests can connect to your network by scanning — no typing the password.',
          steps: [
            { name: 'Enter your WiFi details', text: 'Type your network name (SSID) and password into the WiFi QR code generator.', url: 'https://theqrcode.io/wifi-qr-code-generator' },
            { name: 'Generate the QR code', text: 'Click generate to create your WiFi QR code image.', url: 'https://theqrcode.io/wifi-qr-code-generator' },
            { name: 'Download or print', text: 'Download the QR code or print it and place it where guests can scan to connect instantly.', url: 'https://theqrcode.io/wifi-qr-code-generator' },
          ]
        }}
      />
      <WiFiQRLanding />
    </>
  )
}

