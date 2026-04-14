import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy - TheQRCode.io',
  description: 'Learn how TheQRCode.io uses cookies and similar tracking technologies to improve your experience on our platform.',
  keywords: ['cookie policy', 'cookies', 'tracking technologies', 'QR code', 'privacy'],
  openGraph: {
    title: 'Cookie Policy - TheQRCode.io',
    description: 'Learn how TheQRCode.io uses cookies and similar tracking technologies to improve your experience.',
    type: 'website',
  },
}

export default function CookiesPage() {
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
          Cookie Policy
        </h1>

        <p className="text-gray-600 mb-8">
          <strong>Last updated:</strong> February 21, 2026
        </p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">1. What Are Cookies</h2>
          <p className="text-gray-700 mb-6">
            Cookies are small text files placed on your device when you visit a website. They are
            used to keep you signed in, remember preferences, and help us understand how our platform
            is being used. This policy describes exactly which cookies TheQRCode.io sets and why.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">2. Essential Cookies</h2>
          <p className="text-gray-700 mb-6">
            These cookies are required for the platform to function. They are set automatically
            when you use the service and cannot be disabled.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">Cookie</th>
                  <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">Lifetime</th>
                  <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 font-mono text-xs">next-auth.session-token</td>
                  <td className="px-4 py-3">Session / persistent</td>
                  <td className="px-4 py-3">Keeps you signed in to your account</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 font-mono text-xs">next-auth.csrf-token</td>
                  <td className="px-4 py-3">Session</td>
                  <td className="px-4 py-3">Protects against cross-site request forgery attacks</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs">next-auth.callback-url</td>
                  <td className="px-4 py-3">Session</td>
                  <td className="px-4 py-3">Stores where to redirect you after signing in via Google or GitHub</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">3. Functional Cookies</h2>
          <p className="text-gray-700 mb-6">
            These cookies support specific features of the platform. They are short-lived and
            deleted automatically once they have served their purpose.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">Cookie</th>
                  <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">Lifetime</th>
                  <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs">signupPlan</td>
                  <td className="px-4 py-3">10 minutes</td>
                  <td className="px-4 py-3">Temporarily stores your selected pricing plan during the signup flow. Deleted once your subscription is set up.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">4. Analytics Cookies</h2>
          <p className="text-gray-700 mb-6">
            We use analytics to understand how visitors use TheQRCode.io so we can improve the
            platform. We use Matomo, a self-hosted analytics tool, which means your data stays
            on our own infrastructure and is not shared with third-party advertising networks.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">Cookie</th>
                  <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">Lifetime</th>
                  <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 font-mono text-xs">_pk_id</td>
                  <td className="px-4 py-3">13 months</td>
                  <td className="px-4 py-3">Matomo — identifies returning visitors (anonymized)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs">_pk_ses</td>
                  <td className="px-4 py-3">30 minutes</td>
                  <td className="px-4 py-3">Matomo — tracks the current browsing session</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">5. Third-Party Cookies</h2>
          <p className="text-gray-700 mb-6">
            The following third-party services may set their own cookies when you interact with
            certain features. We do not control these cookies and you should refer to each
            provider&apos;s privacy policy for details.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Google Ads</h3>
          <p className="text-gray-700 mb-6">
            We use Google Ads conversion tracking to measure the effectiveness of our advertising.
            Google may set cookies on your device for this purpose. You can opt out via
            Google&apos;s <a href="https://adssettings.google.com" className="text-blue-600 hover:text-blue-700">Ad Settings</a>.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Google &amp; GitHub (Sign-in)</h3>
          <p className="text-gray-700 mb-6">
            If you sign in using Google or GitHub, those providers set their own authentication
            cookies. These are governed by their respective privacy policies.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Stripe (Payments)</h3>
          <p className="text-gray-700 mb-6">
            We use Stripe to process payments. Stripe may set cookies during the checkout process
            for fraud prevention and security purposes. See the{' '}
            <a href="https://stripe.com/privacy" className="text-blue-600 hover:text-blue-700">Stripe Privacy Policy</a> for details.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">6. Managing Cookies</h2>
          <p className="text-gray-700 mb-4">
            You can control and delete cookies through your browser settings. Common options include:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Viewing and deleting cookies stored on your device</li>
            <li>Blocking cookies from specific websites or all third parties</li>
            <li>Setting your browser to notify you when cookies are being set</li>
          </ul>
          <p className="text-gray-700 mb-6">
            Disabling essential cookies will prevent you from signing in and using authenticated
            features of the platform. Analytics and functional cookies can be blocked without
            affecting core functionality.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">7. Changes to This Policy</h2>
          <p className="text-gray-700 mb-6">
            We may update this Cookie Policy when we add or change features that affect cookies.
            The &quot;Last updated&quot; date at the top of this page will reflect any changes.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">8. Contact Us</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions about our use of cookies, please contact us:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong> support@theqrcode.io
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
