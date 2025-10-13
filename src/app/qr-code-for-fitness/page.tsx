import { Metadata } from 'next'
import FitnessLanding from '@/components/landing/FitnessLanding'

export const metadata: Metadata = {
  title: 'Fitness Trainer QR Code Generator | Class Schedules & Bookings - TheQRCode.io',
  description: 'Create QR codes for class schedules, booking links, and contact info. Track client engagement with analytics. Perfect for personal trainers, yoga instructors, and gyms.',
  keywords: 'fitness qr code, trainer qr code, gym qr code, class schedule qr, fitness booking qr, personal trainer marketing',
  openGraph: {
    title: 'Fitness QR Code Generator | Grow Your Training Business',
    description: 'Share schedules, track clients, and boost bookings with QR codes designed for fitness professionals.',
    type: 'website',
  },
}

export default function FitnessLandingPage() {
  return <FitnessLanding />
}

