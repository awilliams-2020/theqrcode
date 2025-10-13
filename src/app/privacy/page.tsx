import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - TheQRCode.io Data Protection',
  description: 'Learn how TheQRCode.io protects your privacy and handles your data. Our comprehensive privacy policy explains our data collection, usage, and protection practices.',
  keywords: ['privacy policy', 'data protection', 'GDPR compliance', 'QR code privacy', 'user data'],
  openGraph: {
    title: 'Privacy Policy - TheQRCode.io Data Protection',
    description: 'Learn how TheQRCode.io protects your privacy and handles your data with our comprehensive privacy policy.',
    type: 'website',
  },
}

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>
        
        <p className="text-gray-600 mb-8">
          <strong>Last updated:</strong> January 15, 2024
        </p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">1. Introduction</h2>
          <p className="text-gray-700 mb-6">
            TheQRCode.io ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
            explains how we collect, use, disclose, and safeguard your information when you use our website 
            and services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2.1 Personal Information</h3>
          <p className="text-gray-700 mb-4">
            We may collect personal information that you voluntarily provide to us, including:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Name and email address when you create an account</li>
            <li>Payment information when you subscribe to our services</li>
            <li>Profile information and preferences</li>
            <li>Communications with our support team</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2.2 Usage Information</h3>
          <p className="text-gray-700 mb-4">
            We automatically collect certain information about your use of our services:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>QR code generation and usage data</li>
            <li>Analytics data from QR code scans</li>
            <li>Device information and browser type</li>
            <li>IP address and location data</li>
            <li>Website usage patterns and preferences</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">3. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Provide and maintain our services</li>
            <li>Process payments and manage subscriptions</li>
            <li>Generate QR codes and track analytics</li>
            <li>Improve our services and user experience</li>
            <li>Send important updates and notifications</li>
            <li>Provide customer support</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">4. Information Sharing and Disclosure</h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your 
            information only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
            <li>With service providers who assist in our operations</li>
            <li>In connection with a business transfer or merger</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">5. Data Security</h2>
          <p className="text-gray-700 mb-6">
            We implement appropriate technical and organizational security measures to protect your 
            personal information against unauthorized access, alteration, disclosure, or destruction. 
            This includes:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication measures</li>
            <li>Secure data centers and infrastructure</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">6. Data Retention</h2>
          <p className="text-gray-700 mb-6">
            We retain your personal information for as long as necessary to provide our services and 
            fulfill the purposes outlined in this Privacy Policy. We may retain certain information 
            for longer periods to comply with legal obligations or for legitimate business purposes.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">7. Your Rights</h2>
          <p className="text-gray-700 mb-4">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Right to access your personal information</li>
            <li>Right to correct inaccurate information</li>
            <li>Right to delete your personal information</li>
            <li>Right to restrict processing of your information</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw consent</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">8. Cookies and Tracking</h2>
          <p className="text-gray-700 mb-6">
            We use cookies and similar tracking technologies to enhance your experience on our website. 
            You can control cookie settings through your browser preferences. Some features may not 
            function properly if cookies are disabled.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">9. Third-Party Services</h2>
          <p className="text-gray-700 mb-6">
            Our services may integrate with third-party services such as payment processors, analytics 
            providers, and cloud storage services. These third parties have their own privacy policies, 
            and we encourage you to review them.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">10. International Data Transfers</h2>
          <p className="text-gray-700 mb-6">
            Your information may be transferred to and processed in countries other than your own. 
            We ensure appropriate safeguards are in place to protect your information in accordance 
            with applicable data protection laws.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">11. Children's Privacy</h2>
          <p className="text-gray-700 mb-6">
            Our services are not intended for children under 13 years of age. We do not knowingly 
            collect personal information from children under 13. If we become aware that we have 
            collected personal information from a child under 13, we will take steps to delete 
            such information.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">12. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 mb-6">
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last updated" date. 
            We encourage you to review this Privacy Policy periodically.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">13. Contact Us</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> privacy@theqrcode.io
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Address:</strong> 123 Tech Street, San Francisco, CA 94105, United States
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
