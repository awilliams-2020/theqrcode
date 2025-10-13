import { Metadata } from 'next'
import APILanding from '@/components/landing/APILanding'

export const metadata: Metadata = {
  title: 'QR Code API | Programmatic QR Code Generation & Analytics - TheQRCode.io',
  description: 'Powerful QR Code API for developers. Generate QR codes programmatically, track analytics, manage webhooks. RESTful API with comprehensive documentation.',
  keywords: 'qr code api, qr code generation api, qr api, qr code rest api, developer qr code, programmatic qr code',
  openGraph: {
    title: 'QR Code API for Developers | TheQRCode.io',
    description: 'Powerful REST API for generating and managing QR codes programmatically',
    type: 'website',
  },
}

export default function APILandingPage() {
  return <APILanding />
}

