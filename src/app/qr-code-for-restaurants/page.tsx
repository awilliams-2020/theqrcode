import { Metadata } from 'next'
import RestaurantLanding from '@/components/landing/RestaurantLanding'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Restaurant Menu QR Code Generator | Update Prices Instantly - TheQRCode.io',
  description: 'Create dynamic QR codes for your restaurant menu, WiFi, and reviews. Update anytime without reprinting. Perfect for restaurants, cafes, and food businesses. Track customer engagement with analytics.',
  keywords: [
    'restaurant qr code', 'menu qr code', 'digital menu qr', 'restaurant menu generator', 
    'cafe qr code', 'food menu qr', 'contactless menu', 'restaurant technology',
    'food service qr', 'restaurant marketing', 'menu updates', 'contactless dining'
  ],
  openGraph: {
    title: 'Restaurant QR Code Generator | Stop Printing New Menus',
    description: 'Update your menu prices instantly without reprinting. Create QR codes for menus, WiFi, and reviews.',
    type: 'website',
    url: 'https://theqrcode.io/qr-code-for-restaurants',
    images: [
      {
        url: 'https://theqrcode.io/og-restaurant',
        width: 1200,
        height: 630,
        alt: 'Restaurant QR Code Generator - Contactless Menu Solution',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Restaurant QR Code Generator | Stop Printing New Menus',
    description: 'Update your menu prices instantly without reprinting. Create QR codes for menus, WiFi, and reviews.',
    images: ['https://theqrcode.io/og-restaurant'],
  },
  alternates: {
    canonical: '/qr-code-for-restaurants',
  },
}

export default function RestaurantLandingPage() {
  return (
    <>
      <StructuredData 
        type="Service" 
        data={{
          name: "Restaurant QR Code Generation Service",
          description: "Professional QR code generation for restaurant menus, WiFi access, and customer reviews. Update content instantly without reprinting.",
          serviceType: "Restaurant QR Code Solutions",
          areaServed: { "@type": "Country", "name": "Worldwide" },
        }} 
      />
      <RestaurantLanding />
    </>
  )
}

