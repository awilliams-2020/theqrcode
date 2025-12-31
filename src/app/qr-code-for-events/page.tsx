import { Metadata } from 'next'
import EventLanding from '@/components/landing/EventLanding'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'QR Code Activations for Events | Registration & Check-In - TheQRCode.io',
  description: 'QR code activations for events - Create QR codes for event registration, check-in, marketing, and attendee engagement. Track registrations and manage events with real-time analytics. Perfect for conferences, workshops, and corporate events.',
  keywords: [
    'qr code activations for events', 'event qr code', 'event registration qr code', 
    'event check-in qr code', 'event marketing qr', 'conference qr code',
    'workshop qr code', 'corporate event qr', 'event management qr code'
  ],
  openGraph: {
    title: 'QR Code Activations for Events | Registration & Check-In Made Easy',
    description: 'Create QR codes for event registration, check-in, and marketing. Track registrations and manage events with real-time analytics.',
    type: 'website',
    url: 'https://theqrcode.io/qr-code-for-events',
    images: [
      {
        url: 'https://theqrcode.io/og-event',
        width: 1200,
        height: 630,
        alt: 'QR Code Activations for Events - Event Management Solution',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Activations for Events | Registration & Check-In',
    description: 'Create QR codes for event registration, check-in, and marketing. Track registrations with real-time analytics.',
    images: ['https://theqrcode.io/og-event'],
  },
  alternates: {
    canonical: '/qr-code-for-events',
  },
}

export default function EventLandingPage() {
  return (
    <>
      <StructuredData 
        type="Service" 
        data={{
          name: "Event QR Code Activation Service",
          description: "Professional QR code generation for event registration, check-in, marketing, and attendee engagement. Track registrations and manage events with real-time analytics.",
          serviceType: "Event QR Code Solutions",
          areaServed: { "@type": "Country", "name": "Worldwide" },
        }} 
      />
      <EventLanding />
    </>
  )
}

