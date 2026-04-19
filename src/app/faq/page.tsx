import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Minus } from 'lucide-react'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - QR Code Generator',
  description: 'Find answers to common questions about QR code generation, analytics, pricing, and features. Get help with TheQRCode.io platform.',
  keywords: ['QR code FAQ', 'QR code questions', 'QR code help', 'QR code generator FAQ', 'QR code analytics FAQ'],
  openGraph: {
    title: 'Frequently Asked Questions - QR Code Generator',
    description: 'Find answers to common questions about QR code generation, analytics, pricing, and features.',
    type: 'website',
  },
}

const faqs = [
  {
    question: "What types of QR codes can I create?",
    answer: "You can create various types of QR codes including URL QR codes, WiFi QR codes, Contact (vCard) QR codes, Text QR codes, and Email QR codes. Each type is designed for specific use cases and provides different functionality when scanned."
  },
  {
    question: "How do QR code analytics work?",
    answer: "Our analytics track when and where your QR codes are scanned, providing insights into scan counts, geographic locations, device types, and timing patterns. This data helps you understand your audience and optimize your QR code campaigns for better results."
  },
  {
    question: "Is there a free plan available?",
    answer: "Yes! We offer a free plan that includes 10 QR codes and 1,000 scans per month. This is perfect for trying out our platform and for small personal projects. You can upgrade to paid plans for more features and higher limits."
  },
  {
    question: "Can I customize the appearance of my QR codes?",
    answer: "Absolutely! Our paid plans include customization options such as custom colors, frame styles (square, rounded, circle, dashed), and logo embedding. You can also choose from different sizes to fit your design needs."
  },
  {
    question: "How secure is my data?",
    answer: "We take security seriously and use enterprise-grade encryption to protect your data. All data is encrypted in transit and at rest, and we follow industry best practices for data protection and privacy compliance."
  },
  {
    question: "Can I track QR codes created before upgrading?",
    answer: "Yes! When you upgrade your plan, you'll gain access to analytics for all your existing QR codes. Your historical data will be preserved and you'll be able to see analytics going forward for all your QR codes."
  },
  {
    question: "What file formats can I download my QR codes in?",
    answer: "You can download your QR codes in PNG format on all plans. Pro plan also supports SVG and PDF formats, giving you more flexibility for different use cases and print requirements."
  },
  {
    question: "What is the Developer plan?",
    answer: "The Developer plan ($19/mo) is Headless Pro — you get the same full analytics, all QR code types, and the same API access as Pro, but everything is managed through code rather than a visual dashboard. There is no bulk management UI, no real-time visual charts, and no CSV/SVG/PDF export UI. Instead you get a dev console with API keys, usage counters, and docs. You also get all three MCP tools (generate, list_qr_codes, get_analytics), 250,000 scans/month, 2,000 API req/hr, and a sandbox environment plus webhooks. If you manage QR codes through code, choose Developer. If you manage them through a browser, choose Pro."
  },
  {
    question: "Do you offer API access?",
    answer: "Yes! Both the Developer plan ($19/mo) and the Pro plan ($29/mo) include authenticated API access. The Developer plan is specifically designed for API-first use — it gives you 2,000 req/hr, full analytics via the API, all three MCP tools (including list_qr_codes and get_analytics), and a sandbox environment. The Pro plan gives you 5,000 req/hr and the MCP generate tool, alongside the full visual dashboard. All plans also include the public API at 100 req/hr with no authentication required."
  },
  {
    question: "Can I use QR codes for marketing campaigns?",
    answer: "Absolutely! QR codes are excellent for marketing campaigns. You can track campaign performance, A/B test different QR codes, and gain insights into customer behavior. Our analytics help you measure ROI and optimize your marketing efforts."
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer: "If you exceed your plan limits, you'll receive notifications and can upgrade to a higher plan. We don't immediately block access, but we recommend upgrading to ensure uninterrupted service and access to additional features."
  },
  {
    question: "Can I export my analytics data?",
    answer: "It depends on your plan. Pro plan users can export analytics as CSV directly from the visual dashboard. Developer plan users access the same analytics data programmatically via the get_analytics API and MCP tool — no CSV export UI, but full data access through code. Starter and Free plan users do not have data export."
  },
  {
    question: "How do I get support?",
    answer: "Free plan users can access our knowledge base and community support. Starter plan users get email support, while Pro plan users receive priority support with faster response times."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. Your account will remain active until the end of your current billing period, and you'll retain access to all your QR codes and data."
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about QR code generation, analytics, and our platform features.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      <Plus className="w-5 h-5 text-gray-500 group-open:hidden" />
                      <Minus className="w-5 h-5 text-gray-500 hidden group-open:block" />
                    </div>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/qr-code-generator"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 transition-colors"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Create your first QR code in minutes. No credit card required for the free trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?plan=pro"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Structured Data for FAQ */}
      <StructuredData 
        type="FAQPage" 
        data={{
          faqs: faqs
        }} 
      />
    </div>
  )
}
