import { Metadata } from 'next'
import QRGeneratorLanding from '@/components/landing/QRGeneratorLanding'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Free QR Code Generator | Create Custom QR Codes Instantly - TheQRCode.io',
  description: 'Generate free QR codes in seconds. Create custom QR codes for URLs, WiFi, contacts, and more. Track scans with advanced analytics. No credit card required to start.',
  keywords: [
    'qr code generator', 'create qr code', 'qr code maker', 'free qr code', 
    'custom qr code', 'qr code creator', 'qr code builder', 'qr code tool',
    'online qr generator', 'qr code online', 'qr code free', 'qr code maker online'
  ],
  openGraph: {
    title: 'Free QR Code Generator | Create Custom QR Codes',
    description: 'Generate free QR codes in seconds with advanced analytics tracking',
    type: 'website',
    url: 'https://theqrcode.io/qr-code-generator',
    images: [
      {
        url: 'https://theqrcode.io/og-generator',
        width: 1200,
        height: 630,
        alt: 'Free QR Code Generator - Create Custom QR Codes with Analytics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free QR Code Generator | Create Custom QR Codes',
    description: 'Generate free QR codes in seconds with advanced analytics tracking',
    images: ['https://theqrcode.io/og-generator'],
  },
  alternates: {
    canonical: '/qr-code-generator',
  },
}

export default function QRGeneratorLandingPage() {
  return (
    <>
      <StructuredData 
        type="Product" 
        data={{
          name: "QR Code Generator",
          description: "Free online QR code generator for URLs, WiFi, contacts, and more. Create custom QR codes with advanced analytics tracking.",
          url: "https://theqrcode.io/qr-code-generator",
          image: "https://theqrcode.io/og-generator",
          price: "0",
        }} 
      />
      <StructuredData 
        type="HowTo" 
        data={{
          name: "How to Create QR Codes",
          description: "Step-by-step guide to creating custom QR codes for any use case",
          steps: [
            {
              name: "Choose QR Code Type",
              text: "Select from URL, WiFi, Contact, or Text QR codes",
              url: "https://theqrcode.io/qr-code-generator"
            },
            {
              name: "Enter Your Content",
              text: "Input the text, URL, or contact information for your QR code",
              url: "https://theqrcode.io/qr-code-generator"
            },
            {
              name: "Customize Design",
              text: "Choose colors, add logo, and customize the appearance",
              url: "https://theqrcode.io/qr-code-generator"
            },
            {
              name: "Generate & Download",
              text: "Create your QR code and download in high resolution",
              url: "https://theqrcode.io/qr-code-generator"
            }
          ]
        }} 
      />
      <QRGeneratorLanding />
    </>
  )
}

