import { Metadata } from 'next'
import AlternativeLanding from '@/components/landing/AlternativeLanding'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Best QR Code Generator Alternative | Trustworthy & Free | TheQRCode.io',
  description: 'Looking for a QR code generator that won\'t deactivate your codes or surprise you with charges? TheQRCode.io offers a genuine free tier, transparent pricing from $9/mo, and static codes that never expire. The trustworthy alternative to QR.io, QR Code Generator, and more.',
  keywords: [
    'qr code generator alternative', 'best qr code generator', 'qr code generator free',
    'qr.io alternative', 'qr code generator no scam', 'free qr code generator no trial',
    'trustworthy qr code generator', 'qr code generator comparison', 'best free qr code generator',
    'qr code generator no signup', 'qr code generator no expiration', 'qr code generator honest',
    'qr-code.io alternative', 'qr tiger alternative', 'flowcode alternative',
    'beaconstac alternative', 'qr code generator transparent pricing',
    'free qr code generator forever', 'qr code generator no credit card',
    'qr code generator no bait and switch', 'best qr code generator 2026',
    'qr code generator review', 'qr code generator trustpilot',
    'dynamic qr code generator free', 'static qr code generator permanent',
    'qr code generator for business', 'qr code generator with analytics',
    'qr code generator with api', 'reliable qr code generator',
  ],
  openGraph: {
    title: 'Best QR Code Generator Alternative | Trustworthy & Free',
    description: 'Free QR code generator with no deactivation tricks. 10 free QR codes forever, transparent pricing, and static codes that never expire. Compare us with QR.io, QR Code Generator, and more.',
    type: 'website',
    url: 'https://theqrcode.io/qr-code-alternative',
    images: [
      {
        url: 'https://theqrcode.io/og-alternative',
        width: 1200,
        height: 630,
        alt: 'TheQRCode.io - The Trustworthy QR Code Generator Alternative',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The QR Code Generator You Can Actually Trust',
    description: 'Free forever. No bait-and-switch. No surprise charges. Compare TheQRCode.io with QR.io, QR Code Generator, and more.',
    images: ['https://theqrcode.io/og-alternative'],
  },
  alternates: {
    canonical: '/qr-code-alternative',
  },
}

export default function QRCodeAlternativePage() {
  return (
    <>
      <StructuredData
        type="Service"
        data={{
          name: "TheQRCode.io - Trustworthy QR Code Generator",
          description: "The honest alternative to QR code generators that deactivate free codes. Genuine free tier with 10 QR codes, transparent pricing from $9/month, and static codes that never expire.",
          serviceType: "QR Code Generation Platform",
          areaServed: { "@type": "Country", "name": "Worldwide" },
        }}
      />
      <StructuredData
        type="FAQPage"
        data={{
          faqs: [
            {
              question: "Why do some QR code generators deactivate codes?",
              answer: "Many QR code generators use a deceptive 'free trial' model. They let you create QR codes for free during a 7-14 day trial, knowing you'll print them on physical materials. After the trial expires, your codes stop working and you're forced to pay $35-$50/month to reactivate them. This has been documented in thousands of negative reviews. TheQRCode.io does not do this - our free tier is genuinely free forever."
            },
            {
              question: "Is TheQRCode.io really free?",
              answer: "Yes. Our free plan includes 10 QR codes and 1,000 scans per month with no time limit, no credit card required, and no expiration. Static QR codes created on any plan work forever. We make money from our paid plans ($9-$29/month) which offer more QR codes, higher scan limits, and advanced features like API access and logo embedding."
            },
            {
              question: "What happens to my QR codes if I cancel my paid plan?",
              answer: "Static QR codes continue working forever regardless of your subscription status - they encode content directly and don't depend on our servers. Dynamic QR codes continue redirecting to their destination even after you cancel. You'll be downgraded to the free plan, which means you won't be able to create new codes beyond the free tier limit, but all your existing codes keep working. Scan analytics recording is subject to your plan's scan limits."
            },
            {
              question: "How is TheQRCode.io different from QR.io and QR Code Generator?",
              answer: "The biggest difference is trust. QR.io and QR Code Generator (by Bitly/Egoditor) have been widely criticized for deactivating 'free' QR codes after short trial periods, trapping users who've already printed materials. TheQRCode.io offers a genuine free-forever tier, transparent pricing, and static codes that never expire. We also offer lower paid pricing ($9/mo vs $35/mo) and a developer API."
            },
            {
              question: "Do static QR codes expire?",
              answer: "No. Static QR codes encode your content (URL, WiFi password, contact info, etc.) directly into the QR pattern itself. They don't depend on any server or subscription. Once created, they work forever - even if you delete your account. Dynamic QR codes, which enable tracking and content updates, do require an active account."
            },
            {
              question: "Can I switch from another QR code generator?",
              answer: "Yes. If your current QR codes are static, they'll continue working regardless. For dynamic codes, you'll need to create new QR codes on TheQRCode.io since dynamic codes are tied to each platform's redirect system. We recommend starting with our free plan to test the platform before committing to a paid plan."
            },
            {
              question: "What's the difference between static and dynamic QR codes?",
              answer: "Static QR codes embed your content directly - the URL, WiFi password, or contact info is encoded in the pattern itself. They work forever but can't be changed or tracked. Dynamic QR codes use a short redirect URL, so you can update the destination, track scans (device, location, time), and view analytics. Both types are available on all plans, including free."
            },
            {
              question: "Is there a catch with the free plan?",
              answer: "No catch. The free plan is limited to 10 QR codes and 1,000 scans per month - that's the only restriction. You get access to URL, Text, WiFi, and Contact QR types, basic analytics, basic customization, and both static and dynamic codes. We don't require a credit card, there's no trial period, and your codes never expire."
            }
          ]
        }}
      />
      <AlternativeLanding />
    </>
  )
}
