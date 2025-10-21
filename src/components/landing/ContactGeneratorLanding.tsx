'use client'

import { User, QrCode, Users, Phone, Mail, MapPin, CheckCircle2, Smartphone, Calendar, Building, Share2, Zap } from 'lucide-react'
import Link from 'next/link'
import { useLandingPageTracking } from '@/hooks/useLandingPageTracking'
import PublicQRGenerator from '../PublicQRGenerator'

export default function ContactGeneratorLanding() {
  const { trackCTA, trackDemo } = useLandingPageTracking('contact-generator');
  const useCases = [
    {
      icon: Users,
      title: 'Business Cards',
      description: 'Add QR codes to business cards for instant contact sharing. Never run out of cards again.'
    },
    {
      icon: Calendar,
      title: 'Networking Events',
      description: 'Share contact information quickly at conferences, meetups, and professional gatherings.'
    },
    {
      icon: Building,
      title: 'Remote Meetings',
      description: 'Include QR codes in video call backgrounds, email signatures, and presentation slides.'
    },
    {
      icon: Share2,
      title: 'Social Media',
      description: 'Share vCard QR codes on LinkedIn, Twitter, and other platforms for easy contact exchange.'
    }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Instant Contact Sharing',
      description: 'Share complete contact information with a single scan. No typing, no mistakes, no delays.'
    },
    {
      icon: Phone,
      title: 'Complete Contact Details',
      description: 'Include name, phone numbers, email addresses, company info, and website in one QR code.'
    },
    {
      icon: Smartphone,
      title: 'Universal Compatibility',
      description: 'Works with all smartphones and automatically opens contacts app for easy saving.'
    },
    {
      icon: CheckCircle2,
      title: 'Professional Appearance',
      description: 'Customizable designs with your logo and colors to match your professional brand.'
    },
    {
      icon: User,
      title: 'Multiple Formats',
      description: 'vCard 2.1 and 3.0 formats supported for maximum compatibility across all devices.'
    },
    {
      icon: Share2,
      title: 'Easy Updates',
      description: 'Dynamic QR codes allow you to update contact information without reprinting materials.'
    }
  ]

  const contactFields = [
    { icon: User, field: 'Full Name', description: 'First name, last name, and title' },
    { icon: Phone, field: 'Phone Numbers', description: 'Work, mobile, and fax numbers' },
    { icon: Mail, field: 'Email Addresses', description: 'Work, personal, and additional emails' },
    { icon: Building, field: 'Company Info', description: 'Company name, job title, department' },
    { icon: MapPin, field: 'Address Details', description: 'Work address, city, state, zip code' },
    { icon: Share2, field: 'Web & Social', description: 'Website, LinkedIn, Twitter handles' }
  ]

  const steps = [
    {
      number: '1',
      title: 'Enter Contact Information',
      description: 'Add your name, phone, email, company, and address details in our easy form'
    },
    {
      number: '2',
      title: 'Customize Your QR Code',
      description: 'Choose colors, add your logo, and select a professional frame style'
    },
    {
      number: '3',
      title: 'Download & Print',
      description: 'Get high-resolution files in PNG format, perfect for business cards and materials'
    },
    {
      number: '4',
      title: 'Share & Network',
      description: 'Print on business cards, display at events, or share digitally for instant contact exchange'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Hero Section with Contact Generator */}
      <section className="px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              📇 Contact QR Code Generator
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Professional vCard QR Codes
              <span className="block text-blue-600 mt-2">in Seconds</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Generate contact QR codes instantly for business cards, networking events, and professional sharing. Include all your contact details in one scannable code with customizable designs.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Free to create</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>All devices supported</span>
              </div>
            </div>
          </div>

          {/* Embedded Contact QR Generator */}
          <PublicQRGenerator 
            defaultType="contact"
            title="Generate Your Contact QR Code"
            description="Create a professional vCard QR code for instant contact sharing"
            allowedTypes={['contact', 'url', 'text']}
          />
        </div>
      </section>

      {/* Contact Fields Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Include All Your Contact Information
            </h2>
            <p className="text-xl text-gray-600">
              Professional vCard formats with complete contact details
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactFields.map((field, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                <field.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{field.field}</h3>
                <p className="text-gray-600">{field.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perfect for Professional Networking
            </h2>
            <p className="text-xl text-gray-600">
              From business cards to events – make contact sharing effortless
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <useCase.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Contact QR Code Generator
            </h2>
            <p className="text-xl text-gray-600">
              Professional features designed for modern networking and business communication
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
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
              Create Your Contact QR Code in 4 Steps
            </h2>
            <p className="text-xl text-gray-600">
              Simple, fast, and professional contact code generation
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                  <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-blue-300">
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

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Start Creating Contact QR Codes Today
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join professionals worldwide using QR codes for instant contact sharing and networking.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Free contact QR code creation with all basic features</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Professional vCard formats compatible with all devices</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Customizable designs and bulk creation available</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/qr-code-generator?type=contact'}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors shadow-lg"
            >
              Create Contact QR Code →
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
                Professional QR code generation for all contact sharing needs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/qr-code-generator" className="text-gray-400 hover:text-white transition-colors">Generator</Link></li>
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
            <p>© 2025 TheQRCode.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
