import { Metadata } from 'next'
import RestaurantLanding from '@/components/landing/RestaurantLanding'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Restaurant Menu QR Code Generator | Update Prices Instantly - TheQRCode.io',
  description: 'Restaurant menu QR code generator - Create dynamic QR codes for your restaurant menu, WiFi, and reviews. Update anytime without reprinting. Perfect for restaurants, cafes, and food businesses. Track customer engagement with analytics. Start free!',
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
      <StructuredData 
        type="FAQPage" 
        data={{
          faqs: [
            {
              question: "How do restaurant QR codes work?",
              answer: "Restaurant QR codes allow customers to scan and access your digital menu, WiFi password, or review page instantly. When scanned, they open the content on the customer's phone - no app download required. You can update menu prices and items anytime without printing new menus."
            },
            {
              question: "Can I update my menu without reprinting QR codes?",
              answer: "Yes! With dynamic QR codes, you can update your menu content, prices, and items anytime through our dashboard. The QR code itself stays the same, so you never need to reprint. This saves time and money compared to traditional printed menus."
            },
            {
              question: "What information can I include in a restaurant QR code?",
              answer: "You can create QR codes for your digital menu, WiFi network credentials, contact information, review pages, special offers, and more. Many restaurants use multiple QR codes - one for menus, one for WiFi, and one for reviews."
            },
            {
              question: "How much does a restaurant QR code cost?",
              answer: "Our free plan includes 10 QR codes perfect for small restaurants. Paid plans start at $9/month and include unlimited QR codes, advanced analytics, custom branding, and priority support. No setup fees or long-term contracts."
            },
            {
              question: "Do customers need to download an app to scan?",
              answer: "No! Customers can scan QR codes using their phone's built-in camera app (iPhone) or any QR code scanner app (Android). No special app download is required, making it easy for all customers to use."
            },
            {
              question: "Can I track how many customers scan my QR code?",
              answer: "Yes! Our analytics dashboard shows you how many times your QR codes are scanned, when they're scanned, and from which locations. This helps you understand customer behavior and measure the effectiveness of your QR code campaigns."
            }
          ]
        }} 
      />
      <RestaurantLanding />
    </>
  )
}

