import { Metadata } from 'next'
import RealEstateLanding from '@/components/landing/RealEstateLanding'

export const metadata: Metadata = {
  title: 'Real Estate QR Code Generator | Property Listings & Open Houses - TheQRCode.io',
  description: 'Create QR codes for property listings, yard signs, and open houses. Track buyer interest with analytics. Update details instantly without reprinting. Perfect for real estate agents.',
  keywords: 'real estate qr code, property listing qr code, open house qr code, real estate agent qr, yard sign qr code, property marketing',
  openGraph: {
    title: 'Real Estate QR Code Generator | Turn Signs Into Lead Machines',
    description: 'Track property interest and generate more leads with QR codes for listings and open houses.',
    type: 'website',
  },
}

export default function RealEstateLandingPage() {
  return <RealEstateLanding />
}

