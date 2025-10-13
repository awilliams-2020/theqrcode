import { Metadata } from 'next'
import OpenHouseLanding from '@/components/landing/OpenHouseLanding'

export const metadata: Metadata = {
  title: 'Open House QR Code Generator | Track Visitors & Capture Leads - TheQRCode.io',
  description: 'Create QR codes for open house listings, virtual tours, and lead capture. Track visitor engagement in real-time. Perfect for real estate agents hosting open houses.',
  keywords: 'open house qr code, real estate qr code, property tour qr, open house lead capture, real estate agent qr, virtual tour qr',
  openGraph: {
    title: 'Open House QR Code Generator | Track Every Visitor',
    description: 'Modernize your open houses with QR codes that track visitors and capture leads automatically.',
    type: 'website',
  },
}

export default function OpenHouseLandingPage() {
  return <OpenHouseLanding />
}

