import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - TheQRCode.io User Agreement',
  description: 'Read TheQRCode.io Terms of Service to understand your rights and responsibilities when using our QR code generation and analytics platform.',
  keywords: ['terms of service', 'user agreement', 'QR code terms', 'service terms', 'legal terms'],
  openGraph: {
    title: 'Terms of Service - TheQRCode.io User Agreement',
    description: 'Read TheQRCode.io Terms of Service to understand your rights and responsibilities when using our platform.',
    type: 'website',
  },
}

export default function TermsPage() {
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
          Terms of Service
        </h1>
        
        <p className="text-gray-600 mb-8">
          <strong>Last updated:</strong> January 15, 2024
        </p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-6">
            By accessing and using TheQRCode.io ("the Service"), you accept and agree to be bound by 
            the terms and provision of this agreement. If you do not agree to abide by the above, 
            please do not use this service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">2. Description of Service</h2>
          <p className="text-gray-700 mb-6">
            TheQRCode.io provides QR code generation, analytics, and tracking services. Our platform 
            allows users to create, customize, and track QR codes for various purposes including 
            marketing, business operations, and personal use.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">3. User Accounts</h2>
          <p className="text-gray-700 mb-4">
            To access certain features of the Service, you must create an account. You agree to:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Be responsible for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
            <li>Be at least 18 years old or have parental consent</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">4. Acceptable Use</h2>
          <p className="text-gray-700 mb-4">
            You agree to use the Service only for lawful purposes and in accordance with these Terms. 
            You agree NOT to:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit harmful or malicious content</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with the proper functioning of the Service</li>
            <li>Use the Service to spam or harass others</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">5. Content and Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            You retain ownership of content you create using our Service. However, you grant us a 
            limited license to:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Process and store your content to provide the Service</li>
            <li>Generate QR codes based on your content</li>
            <li>Track analytics related to your QR codes</li>
            <li>Improve our services using aggregated, anonymized data</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">6. Payment Terms</h2>
          <p className="text-gray-700 mb-4">
            Paid subscriptions are billed in advance on a recurring basis. You agree to:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Pay all fees associated with your chosen plan</li>
            <li>Provide accurate payment information</li>
            <li>Authorize automatic billing for recurring charges</li>
            <li>Understand that fees are non-refundable except as required by law</li>
            <li>Notify us of any billing disputes within 30 days</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">7. Service Availability</h2>
          <p className="text-gray-700 mb-6">
            We strive to maintain high service availability but cannot guarantee uninterrupted access. 
            We may temporarily suspend the Service for maintenance, updates, or other operational reasons. 
            We are not liable for any downtime or service interruptions.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">8. Data and Privacy</h2>
          <p className="text-gray-700 mb-6">
            Your privacy is important to us. Our collection and use of personal information is governed 
            by our Privacy Policy, which is incorporated into these Terms by reference. By using the 
            Service, you consent to the collection and use of information as described in our Privacy Policy.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">9. Limitation of Liability</h2>
          <p className="text-gray-700 mb-6">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, THEQRCODE.IO SHALL NOT BE LIABLE FOR ANY INDIRECT, 
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, 
            LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE 
            OF THE SERVICE.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">10. Indemnification</h2>
          <p className="text-gray-700 mb-6">
            You agree to defend, indemnify, and hold harmless TheQRCode.io and its officers, directors, 
            employees, and agents from and against any claims, damages, obligations, losses, liabilities, 
            costs, or debt, and expenses (including attorney's fees) arising from your use of the Service 
            or violation of these Terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">11. Termination</h2>
          <p className="text-gray-700 mb-4">
            We may terminate or suspend your account and access to the Service immediately, without 
            prior notice or liability, for any reason whatsoever, including without limitation if 
            you breach the Terms. Upon termination:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Your right to use the Service will cease immediately</li>
            <li>We may delete your account and data</li>
            <li>You remain liable for all amounts due up to the date of termination</li>
            <li>Certain provisions of these Terms will survive termination</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">12. Changes to Terms</h2>
          <p className="text-gray-700 mb-6">
            We reserve the right to modify these Terms at any time. We will notify users of any 
            material changes via email or through the Service. Your continued use of the Service 
            after such modifications constitutes acceptance of the updated Terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">13. Governing Law</h2>
          <p className="text-gray-700 mb-6">
            These Terms shall be governed by and construed in accordance with the laws of the State 
            of California, without regard to its conflict of law provisions. Any disputes arising from 
            these Terms or the Service shall be resolved in the courts of San Francisco, California.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">14. Severability</h2>
          <p className="text-gray-700 mb-6">
            If any provision of these Terms is held to be invalid or unenforceable, the remaining 
            provisions will remain in full force and effect. The invalid provision will be replaced 
            with a valid provision that most closely approximates the intent of the original provision.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">15. Contact Information</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> legal@theqrcode.io
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
