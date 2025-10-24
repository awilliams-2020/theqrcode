import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Google OAuth Data Usage - TheQRCode.io',
  description: 'Learn how TheQRCode.io uses Google user data for authentication and service functionality. Transparent data usage policy for Google OAuth integration.',
  keywords: ['Google OAuth', 'data usage', 'Google authentication', 'privacy', 'QR code service'],
  openGraph: {
    title: 'Google OAuth Data Usage - TheQRCode.io',
    description: 'Learn how TheQRCode.io uses Google user data for authentication and service functionality.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function GoogleOAuthPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Google OAuth Data Usage
          </h1>
          <p className="text-xl text-gray-600">
            How TheQRCode.io uses your Google account information
          </p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          {/* Purpose Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Purpose of Our Application</h2>
            <p className="text-gray-700 mb-6">
              TheQRCode.io is a professional QR code generation and analytics platform that helps businesses, 
              marketers, and developers create, manage, and track QR codes with detailed performance analytics. 
              Our service enables users to generate dynamic QR codes, monitor scan statistics, and optimize 
              their marketing campaigns.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Key Features:</h3>
              <ul className="list-disc pl-6 text-blue-800">
                <li>Generate dynamic and static QR codes</li>
                <li>Track QR code scan analytics and performance</li>
                <li>Create QR codes for restaurants, real estate, events, and more</li>
                <li>WiFi QR code generation for easy network access</li>
                <li>Contact QR codes for business cards</li>
                <li>Advanced analytics dashboard with detailed insights</li>
              </ul>
            </div>
          </section>

          {/* Google Data Usage Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Use Your Google Data</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Data We Request from Google:</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Basic Profile Information:</strong> Name and email address for account creation and identification</li>
                <li><strong>Profile Picture:</strong> To personalize your account experience</li>
                <li><strong>Account Verification:</strong> To ensure secure authentication</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">How We Use This Data:</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Account Management</h4>
                <ul className="list-disc pl-4 text-gray-700 text-sm">
                  <li>Create and maintain your user account</li>
                  <li>Provide personalized dashboard experience</li>
                  <li>Enable secure login and authentication</li>
                  <li>Send important service notifications</li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Service Functionality</h4>
                <ul className="list-disc pl-4 text-gray-700 text-sm">
                  <li>Associate QR codes with your account</li>
                  <li>Track analytics and scan data</li>
                  <li>Provide customer support</li>
                  <li>Generate reports and insights</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Protection Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Protection & Security</h2>
            
            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Our Commitment to Your Privacy:</h3>
              <ul className="list-disc pl-6 text-green-800">
                <li>We never sell, trade, or rent your personal information</li>
                <li>Your Google data is used only for the purposes described above</li>
                <li>We implement industry-standard security measures</li>
                <li>All data is encrypted in transit and at rest</li>
                <li>We comply with GDPR, CCPA, and other privacy regulations</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Security Measures:</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>OAuth 2.0 secure authentication protocol</li>
              <li>HTTPS encryption for all data transmission</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Secure data centers with physical security</li>
            </ul>
          </section>

          {/* Data Retention Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your Google account information for as long as your account is active and you 
              continue to use our services. You can request account deletion at any time, and we will 
              remove your personal information within 30 days of your request.
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Your Rights:</h3>
              <ul className="list-disc pl-6 text-yellow-800">
                <li>Access your personal data at any time</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Withdraw consent for data processing</li>
                <li>Export your data in a portable format</li>
              </ul>
            </div>
          </section>

          {/* Third-Party Integration Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              Our application integrates with Google OAuth for secure authentication. We do not share 
              your Google data with any other third parties except as necessary to provide our services. 
              Google's use of your data is governed by their own privacy policy.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Google Services We Use:</h3>
              <ul className="list-disc pl-6 text-gray-700">
                <li><strong>Google OAuth 2.0:</strong> For secure user authentication</li>
                <li><strong>Google Identity Platform:</strong> For account verification and management</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Questions About Your Data?</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about how we use your Google data or want to exercise your 
              privacy rights, please don't hesitate to contact us:
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information:</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Support:</strong> support@theqrcode.io
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Privacy Resources:</h3>
                  <p className="text-gray-700 mb-2">
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                      View our complete Privacy Policy →
                    </Link>
                  </p>
                  <p className="text-gray-700 mb-2">
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                      Read our Terms of Service →
                    </Link>
                  </p>
                  <p className="text-gray-700">
                    <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                      Contact our privacy team →
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-500 text-sm">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
