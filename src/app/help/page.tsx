import type { Metadata } from 'next'
import { HelpCircle, MessageCircle, BookOpen, LayoutDashboard, Mail, DollarSign } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Help & Support - TheQRCode.io',
  description: 'Get help with QR code generation, analytics tracking, and account management. Find answers to common questions and contact our support team.',
  keywords: ['QR code help', 'QR code support', 'QR code documentation', 'QR code troubleshooting', 'QR code guide'],
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions, learn how to use our QR code platform, 
            and get support when you need it.
          </p>
        </div>


        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Link 
            href="/qr-code-generator" 
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
          >
            <BookOpen className="w-12 h-12 text-blue-600 mb-4 group-hover:text-blue-700 transition-colors" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Create QR Code</h3>
            <p className="text-gray-600">
              Generate your first QR code quickly and easily with our free generator.
            </p>
          </Link>

          <Link 
            href="/blog" 
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
          >
            <HelpCircle className="w-12 h-12 text-green-600 mb-4 group-hover:text-green-700 transition-colors" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Blog & Tutorials</h3>
            <p className="text-gray-600">
              Learn best practices and discover creative ways to use QR codes.
            </p>
          </Link>

          <Link 
            href="/dashboard" 
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
          >
            <LayoutDashboard className="w-12 h-12 text-purple-600 mb-4 group-hover:text-purple-700 transition-colors" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dashboard</h3>
            <p className="text-gray-600">
              Access your QR codes and view analytics in your personal dashboard.
            </p>
          </Link>
        </div>

        {/* Popular Topics */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Help Topics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Link href="/how-to-create-qr-code" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-gray-900">How to Create a QR Code</h3>
                <p className="text-sm text-gray-600">Step-by-step guide to creating your first QR code</p>
              </Link>
              <Link href="/blog/qr-code-best-practices" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-gray-900">QR Code Best Practices</h3>
                <p className="text-sm text-gray-600">Learn the best practices for effective QR code usage</p>
              </Link>
              <Link href="/blog/do-qr-codes-expire" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-gray-900">Do QR Codes Expire?</h3>
                <p className="text-sm text-gray-600">Understanding QR code longevity and expiration</p>
              </Link>
            </div>
            <div className="space-y-4">
              <Link href="/dashboard" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-gray-900">Analytics Dashboard</h3>
                <p className="text-sm text-gray-600">Understanding your QR code performance metrics</p>
              </Link>
              <Link href="/blog/qr-code-analytics-tutorial" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-gray-900">Analytics Tutorial</h3>
                <p className="text-sm text-gray-600">Learn how to interpret your QR code analytics</p>
              </Link>
              <Link href="/faq" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-gray-900">Frequently Asked Questions</h3>
                <p className="text-sm text-gray-600">Find answers to common questions about QR codes</p>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I track QR code scans?</h3>
              <p className="text-gray-600">
                All QR codes created with TheQRCode.io automatically include tracking capabilities. 
                You can view detailed analytics in your dashboard, including scan counts, locations, 
                devices, and timestamps.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I edit a QR code after creating it?</h3>
              <p className="text-gray-600">
                QR codes created with our platform are static and cannot be edited after creation. 
                If you need to change the destination URL, you'll need to create a new QR code.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do QR codes work?</h3>
              <p className="text-gray-600">
                QR codes are two-dimensional barcodes that can store various types of data. 
                When scanned with a smartphone camera, they instantly redirect users to websites, 
                display text, or perform other actions.
              </p>
            </div>
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a limit to the number of QR codes I can create?</h3>
              <p className="text-gray-600">
                Our platform allows you to create QR codes for free. There are no limits on the number 
                of QR codes you can generate, and all features are available to all users.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you succeed. Get in touch with us through any of these channels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Support
            </Link>
            <Link 
              href="/faq" 
              className="inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              View FAQ
            </Link>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/blog" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Blog & Tutorials</h3>
              <p className="text-sm text-gray-600">Latest tips, tutorials, and best practices</p>
            </Link>
            <Link href="/features" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <HelpCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
              <p className="text-sm text-gray-600">Explore all the features we offer</p>
            </Link>
            <Link href="/pricing" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
              <p className="text-sm text-gray-600">View our pricing plans and options</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
