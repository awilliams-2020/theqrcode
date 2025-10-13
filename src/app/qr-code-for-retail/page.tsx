import { Metadata } from 'next'
import RetailLanding from '@/components/landing/RetailLanding'

export const metadata: Metadata = {
  title: 'Small Retail QR Code Generator | Product Info & Reviews - TheQRCode.io',
  description: 'Create QR codes for product information, customer reviews, loyalty programs, and special offers. Track customer engagement with analytics. Perfect for boutiques and local shops.',
  keywords: 'retail qr code, boutique qr code, product qr code, customer reviews qr, loyalty program qr, small business qr',
  openGraph: {
    title: 'Retail QR Code Generator | Connect Shoppers to Products',
    description: 'Bridge physical and digital retail with QR codes for product info, reviews, and offers.',
    type: 'website',
  },
}

export default function RetailLandingPage() {
  return <RetailLanding />
}

