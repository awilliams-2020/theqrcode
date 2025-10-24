import { Metadata } from 'next'
import EducationLanding from '@/components/landing/EducationLanding'

export const metadata: Metadata = {
  title: 'Education QR Code Generator | Student Engagement & Learning Made Easy - TheQRCode.io',
  description: 'Create QR codes for school WiFi, digital homework, course materials, and student check-ins. Perfect for schools, universities, and educational institutions.',
  keywords: 'education qr code, school qr code, classroom qr code, student wifi qr, digital homework qr, university qr code, learning qr code',
  openGraph: {
    title: 'Education QR Code Generator | Enhance Learning Experience',
    description: 'Engage students with QR codes for WiFi, homework, and educational resources.',
    type: 'website',
  },
}

export default function EducationLandingPage() {
  return <EducationLanding />
}
