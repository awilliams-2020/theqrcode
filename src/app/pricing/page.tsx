import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import PricingPage from '@/components/PricingPage'
import { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'QR Code IO Pricing: Free Plan + $9/mo Starter | 14-Day Trial - TheQRCode.io',
  description: 'Is QR Code IO free? Yes — free plan: 10 QR codes, 1,000 scans/month. QR.io pricing: Starter $9/mo, Pro $29/mo. 14-day trial, no credit card. Compare plans →',
  keywords: [
    'qr code io pricing', 'qr code pricing', 'qr code generator pricing',
    'qr code cost', 'qr code plans', 'qr code subscription', 'free qr code',
    'qr code.io pricing', 'qrcode.io pricing', 'qr-code.io pricing', 'qr io pricing',
    'qr code io free', 'is qr code io free', 'qr code io pricing plans',
    'free qr code generator', 'qr code free plan', 'qr code pricing comparison',
    'theqrcode pricing', 'theqrcode.io pricing', 'theqrcode io pricing',
    'qr.io pricing', 'qr.io free', 'qr.io plans', 'qr.io cost',
    'theqrcode free', 'theqrcode plans', 'theqrcode cost'
  ],
  openGraph: {
    title: 'QR Code IO Pricing: Free Plan + $9/mo Starter | 14-Day Trial',
    description: 'Is QR Code IO free? Yes. Free plan: 10 QR codes. QR.io pricing: Starter $9/mo, 14-day trial. No credit card required.',
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
      {/* Product Schema for Pricing Plans */}
      <StructuredData 
        type="Product" 
        data={{
          name: "QR Code Generator - Free Plan",
          description: "Free QR code generation with basic analytics. Perfect for trying out QR codes.",
          url: "https://theqrcode.io/pricing",
          image: "https://theqrcode.io/og",
          brand: {
            "@type": "Brand",
            "name": "TheQRCode.io"
          },
          offers: {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://theqrcode.io/pricing"
          }
        }} 
      />
      <StructuredData
        type="Product"
        data={{
          name: "QR Code Generator - Starter Plan",
          description: "100 QR codes, 10,000 scans per month, advanced analytics, all QR code types. Great for small businesses.",
          url: "https://theqrcode.io/pricing",
          image: "https://theqrcode.io/og",
          brand: {
            "@type": "Brand",
            "name": "TheQRCode.io"
          },
          offers: {
            "@type": "Offer",
            "price": "9",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://theqrcode.io/pricing"
          }
        }}
      />
      <StructuredData
        type="Product"
        data={{
          name: "QR Code Generator - Developer Plan",
          description: "500 QR codes, 500,000 scans per month, full REST API access at 5,000 req/hr, authenticated MCP server for Claude and Cursor, webhooks and sandbox. Built for developers and AI integrations.",
          url: "https://theqrcode.io/pricing",
          image: "https://theqrcode.io/og",
          brand: {
            "@type": "Brand",
            "name": "TheQRCode.io"
          },
          offers: {
            "@type": "Offer",
            "price": "19",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://theqrcode.io/pricing"
          }
        }}
      />
      <StructuredData
        type="Product"
        data={{
          name: "QR Code Generator - Pro Plan",
          description: "500 QR codes, 500,000 scans per month, real-time analytics, API access. Best for growing companies.",
          url: "https://theqrcode.io/pricing",
          image: "https://theqrcode.io/og",
          brand: {
            "@type": "Brand",
            "name": "TheQRCode.io"
          },
          offers: {
            "@type": "Offer",
            "price": "29",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://theqrcode.io/pricing"
          }
        }} 
      />
      <StructuredData 
        type="FAQPage" 
        data={{
          faqs: [
            {
              question: "Is QR Code IO free?",
              answer: "Yes. TheQRCode.io (QR Code IO) has a free plan: 10 QR codes, 1,000 scans per month, basic QR types (URL, Text, WiFi, Contact). No credit card required. Paid plans start at $9/mo with a 14-day free trial."
            },
            {
              question: "What is QR.io pricing?",
              answer: "QR Code IO pricing: Free plan (10 QR codes). Starter $9/mo (100 QR codes, 10K scans). Pro $29/mo (500 QR codes, 500K scans). 14-day free trial on paid plans."
            },
            {
              question: "Does QR Code IO have a free plan?",
              answer: "Yes. The free plan includes 10 QR codes and 1,000 scans per month forever. No expiration. Upgrade anytime for more QR codes and scans."
            },
            {
              question: "What's included in the free plan?",
              answer: "The free plan includes 10 QR codes, 1,000 scans per month, basic analytics, and access to basic QR code types (URL, Text, WiFi, Contact). Email and Menu QR codes are available on paid plans. Perfect for trying out our platform or small personal projects."
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

