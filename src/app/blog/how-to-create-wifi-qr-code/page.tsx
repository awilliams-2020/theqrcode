import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Clock, ArrowLeft, Share2, Wifi, Smartphone, Lock, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Create a WiFi QR Code [Complete Step-by-Step Guide]',
  description: 'Learn how to create a WiFi QR code in 5 minutes. Share your WiFi password instantly without typing. Perfect for restaurants, offices, Airbnb, and home use.',
  keywords: ['wifi qr code', 'wifi qr code generator', 'share wifi password', 'wifi qr code iphone', 'wifi qr code android', 'restaurant wifi qr code'],
  openGraph: {
    title: 'How to Create a WiFi QR Code [Step-by-Step Guide]',
    description: 'Create a WiFi QR code in 5 minutes. Never type your password again.',
    type: 'article',
    publishedTime: '2025-01-18T00:00:00.000Z',
    authors: ['TheQRCode.io Team'],
    tags: ['WiFi', 'Tutorial', 'QR Code', 'How-To'],
  },
}

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/blog" 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Tutorial
            </span>
            <span className="text-sm text-gray-500">7 min read</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How to Create a WiFi QR Code [Step-by-Step]
          </h1>
          
          <div className="flex items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>TheQRCode.io Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>January 18, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>7 min read</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-800 mb-8 leading-relaxed">
            WiFi QR codes let guests connect to your network by scanning a code—no typing passwords required. 
            Perfect for restaurants, offices, Airbnb, hotels, and home use. This guide shows you how to create 
            a WiFi QR code in less than 5 minutes.
          </p>

          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">⚡ Quick Summary</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Time needed:</strong> 5 minutes</li>
              <li><strong>What you need:</strong> WiFi name (SSID) and password</li>
              <li><strong>Works on:</strong> All modern smartphones (iOS 11+, Android 10+)</li>
              <li><strong>Cost:</strong> Free (with most QR code generators)</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            <Wifi className="inline-block mr-2 mb-1" size={32} />
            What is a WiFi QR Code?
          </h2>
          <p className="text-gray-800 mb-6 leading-relaxed">
            A WiFi QR code is a special type of QR code that contains your network name (SSID), password, and 
            encryption type. When someone scans it with their smartphone, their device automatically connects 
            to your WiFi network—no manual password entry required.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How it Works:</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Guest opens camera app on their phone</li>
              <li>Points camera at the WiFi QR code</li>
              <li>Tap the notification that appears</li>
              <li>Instantly connected to WiFi! ✅</li>
            </ol>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Step-by-Step: Create Your WiFi QR Code</h2>

          <div className="space-y-6 mb-8">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Step 1: Gather Your WiFi Information</h3>
              <p className="text-gray-700 mb-3">
                Before creating your QR code, you'll need three pieces of information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Network Name (SSID):</strong> The name people see when searching for WiFi</li>
                <li><strong>Password:</strong> Your WiFi password (case-sensitive)</li>
                <li><strong>Security Type:</strong> Usually WPA/WPA2 (most common), WEP, or None (open network)</li>
              </ul>

              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Don't know your WiFi password?</strong> On Windows: Settings → Network & Internet → WiFi → 
                      Your Network → Show Password. On Mac: Keychain Access → search for network name → Show Password.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Step 2: Use a WiFi QR Code Generator</h3>
              <p className="text-gray-700 mb-3">
                Go to a WiFi QR code generator tool. We recommend using a tool that specializes in WiFi QR codes 
                for the best compatibility.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Recommended tool:</strong> <Link href="/wifi-qr-code-generator" className="text-blue-600 hover:underline">TheQRCode.io WiFi Generator</Link>
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>✓ Free to use</li>
                  <li>✓ No signup required</li>
                  <li>✓ Works on all devices</li>
                  <li>✓ Optional: Track how many times it's scanned</li>
                </ul>
              </div>

              <Link 
                href="/wifi-qr-code-generator"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Create WiFi QR Code →
              </Link>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Step 3: Enter Your WiFi Details</h3>
              <p className="text-gray-700 mb-3">
                Fill in the form with your WiFi information:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="font-mono bg-white px-3 py-1 rounded border">1</div>
                    <div>
                      <strong className="text-gray-900">Network Name (SSID):</strong>
                      <p className="text-gray-600">Enter your WiFi name exactly as it appears (case-sensitive)</p>
                      <code className="text-xs bg-white px-2 py-1 rounded border">Example: CoffeeShop_Guest</code>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="font-mono bg-white px-3 py-1 rounded border">2</div>
                    <div>
                      <strong className="text-gray-900">Password:</strong>
                      <p className="text-gray-600">Enter your WiFi password (case-sensitive)</p>
                      <code className="text-xs bg-white px-2 py-1 rounded border">Example: Welcome2024!</code>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="font-mono bg-white px-3 py-1 rounded border">3</div>
                    <div>
                      <strong className="text-gray-900">Security Type:</strong>
                      <p className="text-gray-600">Select your network security type (usually WPA/WPA2)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg mt-4">
                <div className="flex items-start gap-3">
                  <Lock className="text-red-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Security Note:</strong> Your WiFi password is encoded directly into the QR code. 
                      Anyone who scans it will be able to connect. Use a guest network for public QR codes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Step 4: Generate and Download</h3>
              <p className="text-gray-700 mb-3">
                Click "Generate QR Code" and your WiFi QR code will be created instantly. You'll see a preview 
                of your QR code that you can:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Download as PNG or SVG (for print)</li>
                <li>Copy to clipboard</li>
                <li>Print directly</li>
                <li>Customize colors and add your logo (optional)</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Step 5: Print and Display</h3>
              <p className="text-gray-700 mb-3">
                Save your QR code and place it where guests can easily scan it:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Restaurants:</strong> Table tents, menus, by the door</li>
                <li><strong>Offices:</strong> Reception desk, conference rooms</li>
                <li><strong>Airbnb/Hotels:</strong> Welcome book, by the router, bedroom</li>
                <li><strong>Home:</strong> Fridge magnet, entryway, guest room</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Printing Tips for Best Results</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">✅ Do This:</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Print at least 2x2 inches (5x5 cm)</li>
                <li>• Use high-quality paper or laminate</li>
                <li>• Test scan before mass printing</li>
                <li>• Add context: "Scan for WiFi"</li>
                <li>• Include backup text of SSID</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">❌ Avoid This:</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Printing too small (hard to scan)</li>
                <li>• Low contrast colors</li>
                <li>• Glossy surfaces with glare</li>
                <li>• Placing in hard-to-reach spots</li>
                <li>• Forgetting to test first</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            <Smartphone className="inline-block mr-2 mb-1" size={32} />
            How to Scan a WiFi QR Code
          </h2>

          <div className="space-y-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">On iPhone (iOS 11+):</h3>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Open the Camera app (no QR scanner app needed)</li>
                <li>Point camera at the WiFi QR code</li>
                <li>Tap the "Join [Network Name]" banner that appears</li>
                <li>Connected! ✓</li>
              </ol>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">On Android (10+):</h3>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Open the Camera app</li>
                <li>Point at the WiFi QR code</li>
                <li>Tap the notification or link that appears</li>
                <li>Tap "Connect" to join the network</li>
              </ol>
              <p className="text-sm text-gray-600 mt-3">
                <strong>Alternative:</strong> Settings → Network & Internet → WiFi → Add Network → Scan QR Code
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common Use Cases</h2>
          
          <div className="space-y-6 mb-8">
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🍽️ Restaurants & Cafes</h3>
              <p className="text-gray-700">
                Place WiFi QR codes on table tents, menus, or at the counter. Customers can connect instantly 
                without asking staff for the password. Reduces interruptions and improves customer experience.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🏢 Office & Co-Working Spaces</h3>
              <p className="text-gray-700">
                Perfect for visitor WiFi access. Display at reception or in conference rooms. Visitors can 
                connect without IT support, saving time for everyone.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🏠 Airbnb & Vacation Rentals</h3>
              <p className="text-gray-700">
                Include in your welcome book or post on the fridge. Guests can connect immediately without 
                messaging you for the password. Add this to your 5-star hosting checklist.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🏨 Hotels & Resorts</h3>
              <p className="text-gray-700">
                Reduce front desk questions by placing WiFi QR codes in rooms. Guests can connect without 
                calling reception or entering complex passwords.
              </p>
            </div>

            <div className="border-l-4 border-pink-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">💡 Home Use</h3>
              <p className="text-gray-700">
                Stop spelling out your WiFi password to guests. Print a WiFi QR code and display it in your 
                entryway or guest room. Friends and family can connect instantly.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Security Best Practices</h2>
          
          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              <Lock className="inline-block mr-2 mb-1" size={24} />
              Keep Your Network Secure
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Use a Guest Network:</strong> Create a separate guest network for QR code access. 
                This keeps your main network and devices secure.
              </li>
              <li>
                <strong>Change Password Regularly:</strong> If you display WiFi QR codes publicly, change your 
                guest network password every few months.
              </li>
              <li>
                <strong>Limit Bandwidth:</strong> Set bandwidth limits on guest networks to ensure your main 
                network stays fast.
              </li>
              <li>
                <strong>Monitor Connected Devices:</strong> Check your router regularly to see who's connected 
                to your network.
              </li>
              <li>
                <strong>Don't Share Main Network:</strong> Never create a QR code for your primary network if 
                you're sharing it publicly.
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Troubleshooting Common Issues</h2>
          
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Problem: QR code won't scan</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Print larger (minimum 2x2 inches)</li>
                <li>• Ensure high contrast (dark code on light background)</li>
                <li>• Check for smudges or damage</li>
                <li>• Try scanning from different angles</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Problem: Phone won't connect after scanning</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Verify password is correct (case-sensitive)</li>
                <li>• Check SSID matches exactly</li>
                <li>• Ensure security type is correct (usually WPA/WPA2)</li>
                <li>• Make sure router is powered on and working</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Problem: iPhone not showing WiFi option</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Update to iOS 11 or later</li>
                <li>• Ensure Camera has permissions</li>
                <li>• Try scanning in Settings → WiFi → Other → Scan QR Code</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Advanced Tips</h2>
          
          <ul className="list-disc pl-6 mb-8 text-gray-800 space-y-3">
            <li>
              <strong>Add Your Logo:</strong> Customize your WiFi QR code with your business logo for branding 
              (works with error correction).
            </li>
            <li>
              <strong>Track Scans:</strong> Use a QR code generator with analytics to see how many people connect 
              to your WiFi via the QR code.
            </li>
            <li>
              <strong>Multiple Locations:</strong> Create separate QR codes for different areas (e.g., "CoffeeShop-Floor1" 
              and "CoffeeShop-Floor2") to manage bandwidth.
            </li>
            <li>
              <strong>Time-Limited Access:</strong> For events, create temporary guest networks that expire after 
              the event ends.
            </li>
            <li>
              <strong>Branded Materials:</strong> Design professional table tents or signs with your WiFi QR code 
              and branding for a polished look.
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
          <p className="text-gray-800 mb-8 leading-relaxed">
            Creating a WiFi QR code takes just 5 minutes but saves countless hours of typing passwords and answering 
            "What's the WiFi?" questions. Whether you run a business or just want to make your home more 
            guest-friendly, WiFi QR codes are a simple, modern solution.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Recap:</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Gather WiFi info (SSID, password, security type)</li>
              <li>Use a WiFi QR code generator</li>
              <li>Enter your details</li>
              <li>Download and print</li>
              <li>Display where guests can scan it</li>
            </ol>
          </div>
        </div>

        {/* Share and CTA */}
        <div className="border-t border-gray-200 pt-8 mt-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Share this article:</span>
              <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Create Your WiFi QR Code?
            </h3>
            <p className="text-gray-700 mb-6">
              Generate a professional WiFi QR code in seconds. Free, no signup required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/wifi-qr-code-generator"
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create WiFi QR Code
              </Link>
              <Link
                href="/qr-code-generator"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
              >
                View All QR Types
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

