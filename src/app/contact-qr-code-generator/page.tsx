import { Metadata } from 'next'
import ContactGeneratorLanding from '@/components/landing/ContactGeneratorLanding'

export const metadata: Metadata = {
  title: 'Contact QR Code Generator | vCard QR Codes Made Easy - TheQRCode.io',
  description: 'Create professional vCard QR codes for business cards, networking events, and contact sharing. Generate contact QR codes instantly with name, phone, email, and business information.',
  keywords: 'contact qr code generator, vcard qr code, business card qr code, contact qr code, networking qr code, digital business card qr',
  openGraph: {
    title: 'Contact QR Code Generator | Digital Business Cards',
    description: 'Create professional vCard QR codes for instant contact sharing at networking events and business meetings.',
    type: 'website',
  },
}

export default function ContactGeneratorLandingPage() {
  return <ContactGeneratorLanding />
}
