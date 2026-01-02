import { Metadata } from 'next'
import WiFiQRLanding from '@/components/landing/WiFiQRLanding'

export const metadata: Metadata = {
  title: 'WiFi QR Code Generator | Create WiFi QR Code Password - Free & Easy',
  description: 'Create WiFi QR codes in seconds. Generate QR codes for WiFi passwords - guests scan to connect instantly. Perfect for restaurants, hotels, offices, and events. Free WiFi QR code generator. No signup required!',
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
    title: 'WiFi QR Code Generator | Share Your Network Instantly',
    description: 'Create WiFi QR codes for easy guest access to your network. Perfect for restaurants, hotels, offices, and events. Free to use!',
    type: 'website',
    url: 'https://theqrcode.io/wifi-qr-code-generator',
  },
  alternates: {
    canonical: '/wifi-qr-code-generator',
  },
}

export default function WiFiQRLandingPage() {
  return <WiFiQRLanding />
}

