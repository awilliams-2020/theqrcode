import { Metadata } from 'next'
import FoodTruckLanding from '@/components/landing/FoodTruckLanding'

export const metadata: Metadata = {
  title: 'Food Truck QR Code Generator | Menu & Location Sharing - TheQRCode.io',
  description: 'Create QR codes for your food truck menu, location schedule, reviews, and social media. Update from your phone anytime. Perfect for mobile food vendors.',
  keywords: 'food truck qr code, mobile menu qr, food truck location qr, food vendor qr, street food qr code, food truck marketing',
  openGraph: {
    title: 'Food Truck QR Code Generator | Update Menu Anywhere',
    description: 'Share menus, locations, and grow your following with QR codes designed for food trucks.',
    type: 'website',
  },
}

export default function FoodTruckLandingPage() {
  return <FoodTruckLanding />
}

