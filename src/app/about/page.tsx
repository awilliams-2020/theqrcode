import { Metadata } from 'next'
import Link from 'next/link'
import { QrCode, BarChart3, Shield, Users, Zap, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - TheQRCode.io Team & Mission',
  description: 'Learn about TheQRCode.io mission to make QR code generation and analytics accessible to businesses of all sizes. Meet our team and discover our story.',
  keywords: ['about TheQRCode.io', 'QR code company', 'QR code team', 'QR code mission', 'QR code story'],
  openGraph: {
    title: 'About Us - TheQRCode.io Team & Mission',
    description: 'Learn about TheQRCode.io mission to make QR code generation and analytics accessible to businesses of all sizes.',
    type: 'website',
  },
}

const values = [
  {
    icon: Target,
    title: 'User-Focused',
    description: 'We prioritize user experience and make complex QR code analytics simple and accessible for everyone.'
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Your data security is our top priority. We use enterprise-grade encryption and follow industry best practices.'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We continuously innovate to provide cutting-edge features that help businesses stay ahead of the competition.'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We believe in building a community of users who can learn from each other and grow together.'
  }
]

const team = [
  {
    name: 'Adam Williams',
    role: 'Founder & Senior Software Engineer',
    bio: '8-year Senior Software Engineer with extensive experience in full-stack development, system architecture, and modern web technologies. Passionate about building scalable solutions and making QR code technology accessible to businesses of all sizes.',
    image: '/1662127477733.jpg'
  }
]

const stats = [
  { number: '50K+', label: 'QR Codes Generated' },
  { number: '2M+', label: 'Scans Tracked' },
  { number: '5K+', label: 'Happy Customers' },
  { number: '99.9%', label: 'Uptime' }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About TheQRCode.io
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to make QR code generation and analytics accessible to businesses 
              of all sizes, from startups to enterprise organizations.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  TheQRCode.io was born out of a simple observation: while QR codes were becoming 
                  increasingly popular, most businesses lacked the tools to create professional 
                  QR codes and understand their impact.
                </p>
                <p>
                  Founded in 2024, we set out to solve this problem by creating a comprehensive 
                  platform that combines easy-to-use QR code generation with powerful analytics 
                  and tracking capabilities.
                </p>
                <p className="hidden">
                  Today, we serve thousands of businesses worldwide, from small local shops to 
                  large enterprises, helping them leverage QR codes to connect with their customers 
                  and drive meaningful engagement.
                </p>
              </div>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <QrCode className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Our Mission
              </h3>
              <p className="text-gray-700 text-center">
                To democratize QR code technology by making it accessible, 
                powerful, and easy to use for businesses of all sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Businesses Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Our platform powers QR code campaigns for companies across industries
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <value.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind TheQRCode.io
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <div className="h-48 w-48 mx-auto mb-6 overflow-hidden rounded-full border-4 border-blue-100">
                <img
                  src={team[0].image}
                  alt={team[0].name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {team[0].name}
              </h3>
              <p className="text-blue-600 font-medium mb-4 text-lg">
                {team[0].role}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {team[0].bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-gray-600">
              We use cutting-edge technology to deliver fast, reliable, and secure QR code services
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200">
              <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Real-time Analytics
              </h3>
              <p className="text-gray-600">
                Track QR code performance with real-time data and insights
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-200">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Enterprise Security
              </h3>
              <p className="text-gray-600">
                Bank-level security with encryption and compliance standards
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-200">
              <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Optimized infrastructure for instant QR code generation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start creating professional QR codes with analytics today.
            <span className="hidden"> Join thousands of businesses already using TheQRCode.io.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?plan=pro"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
