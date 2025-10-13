import { Metadata } from 'next'
import WiFiQRLanding from '@/components/landing/WiFiQRLanding'

export const metadata: Metadata = {
  title: 'WiFi QR Code Generator | Share WiFi Network Instantly - TheQRCode.io',
  description: 'Create WiFi QR codes in seconds. Let guests connect to your WiFi network by scanning a QR code. Perfect for restaurants, hotels, offices, and events.',
  keywords: 'wifi qr code, wifi qr code generator, share wifi qr code, restaurant wifi qr, hotel wifi qr, wifi access qr',
  openGraph: {
    title: 'WiFi QR Code Generator | Share Your Network Instantly',
    description: 'Create WiFi QR codes for easy guest access to your network',
    type: 'website',
  },
}

export default function WiFiQRLandingPage() {
  return <WiFiQRLanding />
}

