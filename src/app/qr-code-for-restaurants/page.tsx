import { Metadata } from 'next'
import RestaurantLanding from '@/components/landing/RestaurantLanding'

export const metadata: Metadata = {
  title: 'Restaurant Menu QR Code Generator | Update Prices Instantly - TheQRCode.io',
  description: 'Create dynamic QR codes for your restaurant menu, WiFi, and reviews. Update anytime without reprinting. Perfect for restaurants, cafes, and food businesses. Track customer engagement with analytics.',
  keywords: 'restaurant qr code, menu qr code, digital menu qr, restaurant menu generator, cafe qr code, food menu qr, contactless menu',
  openGraph: {
    title: 'Restaurant QR Code Generator | Stop Printing New Menus',
    description: 'Update your menu prices instantly without reprinting. Create QR codes for menus, WiFi, and reviews.',
    type: 'website',
  },
}

export default function RestaurantLandingPage() {
  return <RestaurantLanding />
}

