import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free QR Code Generator - No Sign Up Required | TheQRCode.io',
  description: 'Generate QR codes instantly without creating an account. Free QR code generator with analytics, multiple formats, and no registration required.',
  keywords: [
    'free QR code generator',
    'QR code generator no signup',
    'instant QR code generator',
    'free QR code maker',
    'QR code generator without account',
    'no registration QR code generator'
  ],
  openGraph: {
    title: 'Free QR Code Generator - No Sign Up Required',
    description: 'Generate QR codes instantly without creating an account. Free QR code generator with analytics and multiple formats.',
    images: ['/og-free-qr-generator.jpg']
  }
}

export default function FreeQRCodeGeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Free QR Code Generator - No Sign Up Required
      </h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">
          Generate QR Codes Instantly - No Account Needed
        </h2>
        <p className="text-blue-800 mb-4">
          Create professional QR codes in seconds without signing up. Our free QR code generator 
          works immediately - just enter your content and download your QR code.
        </p>
        <Link 
          href="/qr-code-generator"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Generate Free QR Code Now
        </Link>
      </div>

      <div className="prose max-w-none">
        <h2>Why Choose Our Free QR Code Generator?</h2>
        
        <h3>✅ No Registration Required</h3>
        <p>
          Unlike other QR code generators that force you to create an account, our tool works 
          immediately. No email signup, no credit card, no hidden fees.
        </p>

        <h3>✅ Multiple QR Code Types</h3>
        <ul>
          <li><strong>URL QR Codes:</strong> Link to websites, landing pages, or online content</li>
          <li><strong>WiFi QR Codes:</strong> Share WiFi credentials instantly</li>
          <li><strong>Contact QR Codes:</strong> Share contact information (vCard format)</li>
          <li><strong>Email QR Codes:</strong> Pre-filled email composition</li>
          <li><strong>Text QR Codes:</strong> Plain text messages</li>
        </ul>

        <h3>✅ Professional Quality</h3>
        <p>
          Generate high-resolution QR codes suitable for print and digital use. 
          Perfect for business cards, flyers, posters, and websites.
        </p>

        <h3>✅ Instant Download</h3>
        <p>
          Download your QR code immediately in PNG, SVG, or PDF format. 
          No waiting, no processing time.
        </p>

        <h2>How to Use Our Free QR Code Generator</h2>
        <ol>
          <li><strong>Choose QR Code Type:</strong> Select from URL, WiFi, Contact, Email, or Text</li>
          <li><strong>Enter Your Content:</strong> Type or paste your information</li>
          <li><strong>Customize (Optional):</strong> Adjust colors, size, and error correction</li>
          <li><strong>Generate & Download:</strong> Click generate and download instantly</li>
        </ol>

        <h2>Common Use Cases for Free QR Codes</h2>
        
        <h3>For Restaurants</h3>
        <p>
          Create QR codes for digital menus, contactless ordering, and customer feedback. 
          Perfect for COVID-safe dining experiences.
        </p>

        <h3>For Small Businesses</h3>
        <p>
          Generate QR codes for business cards, store windows, and marketing materials. 
          Drive traffic to your website or social media.
        </p>

        <h3>For Events</h3>
        <p>
          Create QR codes for event information, registration, and networking. 
          Share WiFi passwords and contact details easily.
        </p>

        <h3>For Real Estate</h3>
        <p>
          Generate QR codes for property listings, virtual tours, and contact information. 
          Place on signs and marketing materials.
        </p>

        <h2>Why No Sign Up Required?</h2>
        <p>
          We believe in providing immediate value without barriers. Our free QR code generator 
          is designed for quick, one-time use without the hassle of account creation. 
          However, if you need advanced features like analytics, bulk generation, or custom branding, 
          you can always create a free account later.
        </p>

        <h2>Frequently Asked Questions</h2>
        
        <h3>Is it really free?</h3>
        <p>
          Yes, completely free. No hidden costs, no trial periods, no credit card required. 
          Generate as many QR codes as you need.
        </p>

        <h3>Do I need to download software?</h3>
        <p>
          No software download required. Our QR code generator works entirely in your web browser. 
          Works on any device - desktop, tablet, or mobile.
        </p>

        <h3>What file formats are available?</h3>
        <p>
          Download your QR codes in PNG (for web use), SVG (for scalable graphics), or PDF (for print). 
          All formats are high-quality and print-ready.
        </p>

        <h3>Can I track QR code scans?</h3>
        <p>
          Our free generator creates static QR codes. For analytics and tracking, 
          <Link href="/pricing" className="text-blue-600 hover:underline">upgrade to our Pro plan</Link> 
          to get detailed scan statistics and dynamic QR codes.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-3">Ready to Generate Your Free QR Code?</h3>
          <p className="mb-4">
            Start creating QR codes instantly with our free generator. No signup required, 
            no hidden fees, no limitations.
          </p>
          <Link 
            href="/qr-code-generator"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Generate QR Code Now - It's Free!
          </Link>
        </div>
      </div>
    </div>
  )
}
