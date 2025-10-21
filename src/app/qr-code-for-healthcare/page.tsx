import { Metadata } from 'next'
import HealthcareLanding from '@/components/landing/HealthcareLanding'

export const metadata: Metadata = {
  title: 'Healthcare QR Code Generator | Patient Info & Check-in Made Easy - TheQRCode.io',
  description: 'Create QR codes for patient check-ins, medical forms, appointment booking, and health information sharing. HIPAA-compliant solutions for medical practices, clinics, and hospitals.',
  keywords: 'healthcare qr code, medical qr code, patient check-in qr, medical forms qr, healthcare appointment booking, clinic qr code, hospital qr code',
  openGraph: {
    title: 'Healthcare QR Code Generator | Streamline Patient Experience',
    description: 'Reduce wait times with QR codes for patient check-ins, forms, and information sharing.',
    type: 'website',
  },
}

export default function HealthcareLandingPage() {
  return <HealthcareLanding />
}
