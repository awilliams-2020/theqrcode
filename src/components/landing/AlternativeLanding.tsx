'use client'

import { Shield, ShieldCheck, CheckCircle2, QrCode, XCircle, DollarSign, Code2, BarChart3, Lock, Eye, ArrowRight, Smartphone, Palette, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { useLandingPageTracking } from '@/hooks/useLandingPageTracking'
import { useState } from 'react'

export default function AlternativeLanding() {
  const { trackCTA, trackDemo } = useLandingPageTracking('alternative');
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const competitors = [
    {
      name: 'TheQRCode.io',
      highlight: true,
      freeTier: 'Yes - 10 QR codes, 1K scans/mo',
      lowestPaid: '$9/mo',
      freeCodesExpire: false,
      trustpilot: 'New',
      dynamicQr: true,
      analytics: true,
      apiAccess: true,
      staticPermanent: true,
    },
    {
      name: 'QR Code Generator (Bitly)',
      highlight: false,
      freeTier: '14-day trial only',
      lowestPaid: '$10/mo',
      freeCodesExpire: true,
      trustpilot: '1.6/5 (9,156 reviews)',
      dynamicQr: true,
      analytics: true,
      apiAccess: true,
      staticPermanent: false,
    },
    {
      name: 'QR.io',
      highlight: false,
      freeTier: '7-day trial only',
      lowestPaid: '$35/mo',
      freeCodesExpire: true,
      trustpilot: 'Heavily negative',
      dynamicQr: true,
      analytics: true,
      apiAccess: true,
      staticPermanent: false,
    },
    {
      name: 'QR-Code.io',
      highlight: false,
      freeTier: 'No free tier',
      lowestPaid: '$19.95/mo',
      freeCodesExpire: true,
      trustpilot: '4.6/5 (5,924 reviews)',
      dynamicQr: true,
      analytics: true,
      apiAccess: false,
      staticPermanent: false,
    },
    {
      name: 'QR Tiger',
      highlight: false,
      freeTier: '3 dynamic codes, 500 scans',
      lowestPaid: '$7/mo',
      freeCodesExpire: false,
      trustpilot: '4.6/5 (153 reviews)',
      dynamicQr: true,
      analytics: true,
      apiAccess: true,
      staticPermanent: true,
    },
    {
      name: 'Flowcode',
      highlight: false,
      freeTier: '2 codes, 500 scans',
      lowestPaid: '$25/mo',
      freeCodesExpire: true,
      trustpilot: '3.4/5 (35 reviews)',
      dynamicQr: true,
      analytics: true,
      apiAccess: false,
      staticPermanent: false,
    },
    {
      name: 'Beaconstac',
      highlight: false,
      freeTier: 'Static only',
      lowestPaid: '$9/mo',
      freeCodesExpire: true,
      trustpilot: '3.5/5 (16 reviews)',
      dynamicQr: true,
      analytics: true,
      apiAccess: false,
      staticPermanent: false,
    },
  ]

  const whySwitchReasons = [
    {
      icon: Shield,
      title: 'Free Means Free Forever',
      description: 'Unlike competitors that deactivate "free" codes after 7-14 days, our free tier includes 10 QR codes and 1,000 scans per month with no expiration. No credit card required. No surprise charges.',
      versus: 'vs. competitors who deactivate codes after trial',
    },
    {
      icon: Eye,
      title: 'Transparent Pricing',
      description: 'Every plan, every feature, every limit is listed on our pricing page. No hidden fees, no surprise renewals at higher rates, no paywalls that appear after you\'ve printed your materials.',
      versus: 'vs. surprise charges of $35-$102',
    },
    {
      icon: Lock,
      title: 'Static Codes Never Expire',
      description: 'Static QR codes you create work forever, even if you cancel your account. They encode your content directly - no server dependency, no subscription needed to keep them alive.',
      versus: 'vs. subscription lock-in for basic codes',
    },
    {
      icon: Code2,
      title: 'Developer-First API',
      description: 'Public API with no authentication required (100 req/hr), plus a full REST API with webhooks, OpenAPI spec, and sandbox environment for paid plans. Most competitors paywall API access.',
      versus: 'vs. paywalled or nonexistent APIs',
    },
  ]

  const steps = [
    {
      number: '1',
      title: 'Sign Up Free',
      description: 'Create your account in seconds. No credit card required. Get 10 QR codes and 1,000 scans per month immediately.',
    },
    {
      number: '2',
      title: 'Create Your QR Code',
      description: 'Choose your content type - URL, WiFi, Contact, Email, Text, or Menu. Enter your content and choose static or dynamic.',
    },
    {
      number: '3',
      title: 'Customize & Download',
      description: 'Add your brand colors, logo, and frame style. Download in high-resolution PNG format, ready for print or digital use.',
    },
    {
      number: '4',
      title: 'Track & Update',
      description: 'Monitor scans in real-time with analytics. Update dynamic QR code content anytime without reprinting.',
    },
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      qrCodes: '10 QR codes',
      scans: '1,000 scans/mo',
      features: ['URL, Text, WiFi, Contact', 'Basic analytics', 'Basic customization', 'Static & dynamic codes'],
      cta: 'Start Free',
      plan: 'free',
      popular: false,
    },
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      qrCodes: '100 QR codes',
      scans: '10,000 scans/mo',
      features: ['All QR types', 'Advanced analytics', 'Custom styling', 'Email support'],
      cta: 'Start 14-Day Trial',
      plan: 'starter',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      qrCodes: '500 QR codes',
      scans: '500,000 scans/mo',
      features: ['Logo embedding', 'SVG/PDF downloads', 'API access', 'Priority support'],
      cta: 'Start 14-Day Trial',
      plan: 'pro',
      popular: true,
    },
  ]

  const faqs = [
    {
      question: 'Why do some QR code generators deactivate codes?',
      answer: 'Many QR code generators use a deceptive "free trial" model. They let you create QR codes for free during a 7-14 day trial, knowing you\'ll print them on physical materials. After the trial expires, your codes stop working and you\'re forced to pay $35-$50/month to reactivate them. This has been documented in thousands of negative reviews on Trustpilot and other review platforms. TheQRCode.io does not do this - our free tier is genuinely free forever.',
    },
    {
      question: 'Is TheQRCode.io really free?',
      answer: 'Yes. Our free plan includes 10 QR codes and 1,000 scans per month with no time limit, no credit card required, and no expiration. Static QR codes created on any plan work forever. We make money from our paid plans ($9-$29/month) which offer more QR codes, higher scan limits, and advanced features like API access and logo embedding.',
    },
    {
      question: 'What happens to my QR codes if I cancel my paid plan?',
      answer: 'Static QR codes continue working forever regardless of your subscription status - they encode content directly and don\'t depend on our servers. Dynamic QR codes continue redirecting to their destination even after you cancel. You\'ll be downgraded to the free plan, which means you won\'t be able to create new codes beyond the free tier limit, but all your existing codes keep working. Scan analytics recording is subject to your plan\'s scan limits.',
    },
    {
      question: 'How is TheQRCode.io different from QR.io and QR Code Generator?',
      answer: 'The biggest difference is trust. QR.io and QR Code Generator (by Bitly/Egoditor) have been widely criticized for deactivating "free" QR codes after short trial periods, trapping users who\'ve already printed materials. TheQRCode.io offers a genuine free-forever tier, transparent pricing, and static codes that never expire. We also offer lower paid pricing ($9/mo vs $35/mo) and a developer API that competitors paywall.',
    },
    {
      question: 'Do static QR codes expire?',
      answer: 'No. Static QR codes encode your content (URL, WiFi password, contact info, etc.) directly into the QR pattern itself. They don\'t depend on any server or subscription. Once created, they work forever - even if you delete your account. Dynamic QR codes, which enable tracking and content updates, do require an active account.',
    },
    {
      question: 'Can I switch from another QR code generator?',
      answer: 'Yes. If your current QR codes are static, they\'ll continue working regardless. For dynamic codes, you\'ll need to create new QR codes on TheQRCode.io since dynamic codes are tied to each platform\'s redirect system. We recommend starting with our free plan to test the platform before committing to a paid plan.',
    },
    {
      question: 'What\'s the difference between static and dynamic QR codes?',
      answer: 'Static QR codes embed your content directly - the URL, WiFi password, or contact info is encoded in the pattern itself. They work forever but can\'t be changed or tracked. Dynamic QR codes use a short redirect URL, so you can update the destination, track scans (device, location, time), and view analytics. Both types are available on all plans, including free.',
    },
    {
      question: 'Is there a catch with the free plan?',
      answer: 'No catch. The free plan is limited to 10 QR codes and 1,000 scans per month - that\'s the only restriction. You get access to URL, Text, WiFi, and Contact QR types, basic analytics, basic customization, and both static and dynamic codes. We don\'t require a credit card, there\'s no trial period, and your codes never expire. If you need more capacity or advanced features, paid plans start at $9/month.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6">
                The Trustworthy Alternative
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                The QR Code Generator
                <span className="block text-emerald-600 mt-2">You Can Actually Trust</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Tired of QR code generators that deactivate your codes after a &quot;free trial&quot; and demand payment? TheQRCode.io offers a <strong>genuine free tier</strong>, transparent pricing, and static codes that <strong>never expire</strong>. No bait-and-switch. No surprise charges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => {
                    trackCTA('Start Free - No Tricks', 'hero', 'free');
                    window.location.href = '/auth/signup';
                  }}
                  className="px-8 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  Start Free - No Tricks
                </button>
                <button
                  onClick={() => {
                    trackDemo();
                    window.location.href = '/qr-code-generator';
                  }}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 transition-colors bg-white"
                >
                  Try the Generator
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Free tier never expires</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border-2 border-emerald-200">
                <div className="text-center mb-6">
                  <ShieldCheck className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your QR Codes Are Safe</h3>
                  <p className="text-gray-600">No deactivation. No tricks.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">Free forever - 10 QR codes</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">Static codes never expire</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">Paid plans from $9/mo</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">Cancel anytime, no lock-in</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Problem Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            The QR Code Industry Has a Trust Problem
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Thousands of users have been burned by QR code generators that use deceptive &quot;free trial&quot; tactics.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-3xl font-bold text-red-600 mb-2">9,156</p>
              <p className="text-lg text-gray-700">negative Trustpilot reviews for the largest QR code generator - users report codes deactivated after a &quot;free trial&quot; they didn&apos;t know about</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-3xl font-bold text-red-600 mb-2">$35-$50/mo</p>
              <p className="text-lg text-gray-700">demanded to reactivate codes after users have already printed wedding invitations, business cards, and marketing materials</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-3xl font-bold text-red-600 mb-2">7-14 days</p>
              <p className="text-lg text-gray-700">is all the &quot;free&quot; lasts at most competitors - just long enough for you to print materials before codes stop working</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-emerald-600 mt-12">
            We built TheQRCode.io because you deserve better.
          </p>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Honest Comparison
            </h2>
            <p className="text-xl text-gray-600">
              See how TheQRCode.io stacks up against the competition - no spin, just facts
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl border border-gray-200 shadow-md">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-4 text-left text-gray-600 font-semibold">Feature</th>
                  {competitors.map((c) => (
                    <th
                      key={c.name}
                      className={`p-4 text-center text-sm font-semibold ${
                        c.highlight
                          ? 'bg-emerald-50 text-emerald-700 border-x-2 border-t-2 border-emerald-200'
                          : 'text-gray-600'
                      }`}
                    >
                      {c.name}
                      {c.highlight && (
                        <span className="block text-xs text-emerald-500 font-normal mt-1">Recommended</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Free Tier</td>
                  {competitors.map((c) => (
                    <td
                      key={c.name}
                      className={`p-4 text-center text-sm ${
                        c.highlight ? 'bg-emerald-50 border-x-2 border-emerald-200 font-semibold text-emerald-700' : 'text-gray-600'
                      }`}
                    >
                      {c.freeTier}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Lowest Paid Plan</td>
                  {competitors.map((c) => (
                    <td
                      key={c.name}
                      className={`p-4 text-center text-sm ${
                        c.highlight ? 'bg-emerald-50 border-x-2 border-emerald-200 font-semibold text-emerald-700' : 'text-gray-600'
                      }`}
                    >
                      {c.lowestPaid}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Free Codes Expire?</td>
                  {competitors.map((c) => (
                    <td
                      key={c.name}
                      className={`p-4 text-center ${
                        c.highlight ? 'bg-emerald-50 border-x-2 border-emerald-200' : ''
                      }`}
                    >
                      {c.freeCodesExpire ? (
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Trustpilot Rating</td>
                  {competitors.map((c) => (
                    <td
                      key={c.name}
                      className={`p-4 text-center text-sm ${
                        c.highlight ? 'bg-emerald-50 border-x-2 border-emerald-200 text-emerald-700' : 'text-gray-600'
                      }`}
                    >
                      {c.trustpilot}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Dynamic QR Codes</td>
                  {competitors.map((c) => (
                    <td
                      key={c.name}
                      className={`p-4 text-center ${
                        c.highlight ? 'bg-emerald-50 border-x-2 border-emerald-200' : ''
                      }`}
                    >
                      <CheckCircle2 className={`h-5 w-5 mx-auto ${c.highlight ? 'text-emerald-500' : 'text-green-500'}`} />
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Analytics</td>
                  {competitors.map((c) => (
                    <td
                      key={c.name}
                      className={`p-4 text-center ${
                        c.highlight ? 'bg-emerald-50 border-x-2 border-emerald-200' : ''
                      }`}
                    >
                      <CheckCircle2 className={`h-5 w-5 mx-auto ${c.highlight ? 'text-emerald-500' : 'text-green-500'}`} />
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">API Access</td>
                  {competitors.map((c) => (
                    <td
                      key={c.name}
                      className={`p-4 text-center ${
                        c.highlight ? 'bg-emerald-50 border-x-2 border-emerald-200' : ''
                      }`}
                    >
                      {c.apiAccess ? (
                        <CheckCircle2 className={`h-5 w-5 mx-auto ${c.highlight ? 'text-emerald-500' : 'text-green-500'}`} />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-700">Static Codes Permanent</td>
                  {competitors.map((c) => (
                    <td
                      key={c.name}
                      className={`p-4 text-center ${
                        c.highlight ? 'bg-emerald-50 border-x-2 border-b-2 border-emerald-200' : ''
                      }`}
                    >
                      {c.staticPermanent ? (
                        <CheckCircle2 className={`h-5 w-5 mx-auto ${c.highlight ? 'text-emerald-500' : 'text-green-500'}`} />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why Switch Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why People Are Switching to TheQRCode.io
            </h2>
            <p className="text-xl text-gray-600">
              Real differentiators, not marketing fluff
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {whySwitchReasons.map((reason, index) => (
              <div key={index} className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-200 hover:shadow-lg transition-shadow">
                <reason.icon className="h-12 w-12 text-emerald-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{reason.title}</h3>
                <p className="text-gray-600 mb-3">{reason.description}</p>
                <p className="text-sm text-emerald-600 font-medium">{reason.versus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get Started in 4 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              From signup to scanning in under 5 minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                  <div className="h-12 w-12 bg-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-emerald-300">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              No hidden fees. No surprise charges. Cancel anytime.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-xl border p-6 ${
                  plan.popular
                    ? 'border-emerald-500 border-2 shadow-xl bg-emerald-50'
                    : 'border-gray-200 bg-white shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{plan.qrCodes} &middot; {plan.scans}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    trackCTA(plan.cta, 'pricing', plan.plan);
                    window.location.href = plan.plan === 'free' ? '/auth/signup' : `/auth/signup?plan=${plan.plan}`;
                  }}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1">
              View full pricing details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know before switching
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Switch?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands who chose the trustworthy QR code generator.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Free forever - 10 QR codes, no credit card</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Static codes never expire, even if you cancel</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Transparent pricing from $9/mo, cancel anytime</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>14-day free trial on all paid plans</span>
              </div>
            </div>
            <button
              onClick={() => {
                trackCTA('Start Free Today', 'cta-footer', 'free');
                window.location.href = '/auth/signup';
              }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors shadow-lg"
            >
              Start Free Today
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <QrCode className="h-6 w-6" />
                <span className="text-xl font-bold">TheQRCode.io</span>
              </div>
              <p className="text-gray-400">
                The trustworthy QR code generator.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/qr-code-generator" className="text-gray-400 hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TheQRCode.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
