import { Metadata } from 'next'
import QRGeneratorLanding from '@/components/landing/QRGeneratorLanding'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Free QR Code Generator | Create Custom QR Codes Instantly - TheQRCode.io',
  description: 'Generate free QR codes in seconds. Create custom QR codes for URLs, WiFi, contacts, and more. Track scans with advanced analytics. No credit card required. Start creating now!',
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
      <StructuredData 
        type="FAQPage" 
        data={{
          faqs: [
            {
              question: "Is the QR code generator really free?",
              answer: "Yes! Our QR code generator is completely free to use. You can create unlimited QR codes without signing up. For advanced features like analytics tracking and custom branding, we offer paid plans starting at $9/month."
            },
            {
              question: "What types of QR codes can I create?",
              answer: "You can create URL QR codes, WiFi QR codes, Contact (vCard) QR codes, Text QR codes, and Email QR codes. Each type serves different purposes and can be customized with colors and logos."
            },
            {
              question: "Can I track QR code scans?",
              answer: "Yes! With our paid plans, you get access to advanced analytics that track when, where, and how your QR codes are scanned. This includes location data, device types, and scan timestamps."
            },
            {
              question: "What file formats can I download?",
              answer: "You can download QR codes in PNG format on the free plan. Paid plans also support SVG and PDF formats for higher quality and scalability."
            },
            {
              question: "Do QR codes expire?",
              answer: "No, QR codes created with our generator don't expire. They will work indefinitely as long as the destination URL or content remains accessible. Dynamic QR codes can be updated anytime without reprinting."
            },
            {
              question: "Can I customize QR code colors and add a logo?",
              answer: "Yes! Our paid plans include customization options like custom colors, frame styles, and logo embedding. Free users can choose from preset color schemes."
            }
          ]
        }} 
      />
      <QRGeneratorLanding />
    </>
  )
}

