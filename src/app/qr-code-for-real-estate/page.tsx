import { Metadata } from 'next'
import RealEstateLanding from '@/components/landing/RealEstateLanding'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Real Estate QR Code Generator | Property Listings & Open Houses - TheQRCode.io',
  description: 'Create QR codes for property listings, yard signs, and open houses. Track buyer interest with analytics. Update details instantly without reprinting. Perfect for real estate agents.',
  keywords: [
    'real estate qr code', 'property listing qr code', 'open house qr code', 'real estate agent qr', 
    'yard sign qr code', 'property marketing', 'real estate technology', 'property signs',
    'real estate leads', 'property listing tool', 'real estate marketing'
  ],
  openGraph: {
    title: 'Real Estate QR Code Generator | Turn Signs Into Lead Machines',
    description: 'Track property interest and generate more leads with QR codes for listings and open houses.',
    type: 'website',
    url: 'https://theqrcode.io/qr-code-for-real-estate',
    images: [
      {
        url: 'https://theqrcode.io/og-real-estate',
        width: 1200,
        height: 630,
        alt: 'Real Estate QR Code Generator - Property Marketing Solution',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate QR Code Generator | Turn Signs Into Lead Machines',
    description: 'Track property interest and generate more leads with QR codes for listings and open houses.',
    images: ['https://theqrcode.io/og-real-estate'],
  },
  alternates: {
    canonical: '/qr-code-for-real-estate',
  },
}

export default function RealEstateLandingPage() {
  return (
    <>
      <StructuredData 
        type="Service" 
        data={{
          name: "Real Estate QR Code Generation Service",
          description: "Professional QR code solutions for real estate agents including property listings, open houses, and yard signs with lead tracking analytics.",
          serviceType: "Real Estate Marketing Technology",
          areaServed: { "@type": "Country", "name": "Worldwide" },
        }} 
      />
      <RealEstateLanding />
    </>
  )
}

