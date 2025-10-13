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
    answer: "You can download your QR codes in PNG format on all plans. Pro and Business plans also support SVG and PDF formats, giving you more flexibility for different use cases and print requirements."
  },
  {
    question: "Do you offer API access?",
    answer: "Yes! Pro and Business plans include API access. The Pro plan includes basic API access with rate limiting, while the Business plan provides full API access with higher rate limits and advanced features like webhook management."
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
    answer: "Yes! All paid plans include the ability to export your analytics data in CSV format. This allows you to perform additional analysis in external tools or create custom reports for stakeholders."
  },
  {
    question: "Do you offer white-label solutions?",
    answer: "Yes! Our Business plan includes white-label options that allow you to customize the platform with your own branding. This is perfect for agencies and enterprises that want to offer QR code services under their own brand."
  },
  {
    question: "How do I get support?",
    answer: "Free plan users can access our knowledge base and community support. Starter plan users get email support, while Pro and Business plan users receive priority support with faster response times. Business plan users also get 24/7 support."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. Your account will remain active until the end of your current billing period, and you'll retain access to all your QR codes and data."
  },
  {
    question: "Do you offer team collaboration features?",
    answer: "Yes! Business plan users get access to team collaboration features including user management, role-based permissions, and shared QR code libraries. This makes it easy for teams to work together on QR code campaigns."
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
