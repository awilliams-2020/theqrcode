import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import PricingPage from '@/components/PricingPage'
import { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'QR Code IO Pricing | Affordable QR Code Plans - TheQRCode.io',
  description: 'QR Code IO pricing - Choose from Free, Starter ($9/mo), Pro ($29/mo), or Business ($99/mo) plans. 14-day free trial. No credit card required. Compare features and find the perfect plan. Start free today!',
  keywords: [
    'qr code io pricing', 'qr code pricing', 'qr code generator pricing', 
    'qr code cost', 'qr code plans', 'qr code subscription', 'free qr code'
  ],
  openGraph: {
    title: 'QR Code IO Pricing | Affordable Plans Starting at $9/mo',
    description: 'Choose from Free, Starter, Pro, or Business plans. 14-day free trial. No credit card required.',
    type: 'website',
    url: 'https://theqrcode.io/pricing',
  },
  alternates: {
    canonical: '/pricing',
  },
}

export default async function Pricing() {
  const session = await getServerSession(authOptions)
  
  // If not logged in, show pricing page
  // If logged in, also show pricing page (they can upgrade)
  
  return (
    <>
      <StructuredData 
        type="FAQPage" 
        data={{
          faqs: [
            {
              question: "What's included in the free plan?",
              answer: "The free plan includes 10 QR codes, 1,000 scans per month, basic analytics, and access to all QR code types (URL, Text, WiFi, Contact). Perfect for trying out our platform or small personal projects."
            },
            {
              question: "Can I upgrade or downgrade my plan anytime?",
              answer: "Yes! You can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately, and you'll be charged or credited on a prorated basis."
            },
            {
              question: "Is there a free trial for paid plans?",
              answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start. You can explore all features risk-free and cancel anytime during the trial period."
            },
            {
              question: "What happens if I exceed my plan limits?",
              answer: "If you exceed your plan limits, you'll receive notifications and can upgrade to a higher plan. We don't immediately block access, but we recommend upgrading to ensure uninterrupted service."
            },
            {
              question: "Do you offer annual billing discounts?",
              answer: "Yes! Annual billing saves you 20% compared to monthly billing. You can switch to annual billing anytime from your account settings."
            },
            {
              question: "Can I cancel my subscription anytime?",
              answer: "Yes, you can cancel your subscription at any time from your account settings. Your account will remain active until the end of your current billing period, and you'll retain access to all your QR codes and data."
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept all major credit cards (Visa, Mastercard, American Express) and debit cards through our secure Stripe payment processor. All payments are processed securely and encrypted."
            }
          ]
        }} 
      />
      <PricingPage session={session} />
    </>
  )
}

