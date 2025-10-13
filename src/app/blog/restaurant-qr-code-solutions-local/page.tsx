import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Clock, ArrowLeft, Share2, MapPin, Utensils, TrendingUp, Wifi } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Restaurant QR Code Solutions: Complete Local Guide [2025]',
  description: 'Complete guide to QR codes for restaurants. Digital menus, WiFi sharing, contactless payments, and customer reviews. Setup in minutes.',
  keywords: ['restaurant qr code', 'qr code menu restaurant', 'restaurant menu qr code', 'contactless menu', 'restaurant qr code solutions', 'digital menu qr'],
  openGraph: {
    title: 'Restaurant QR Code Solutions: Complete Local Guide',
    description: 'Everything restaurants need to know about QR codes for menus, WiFi, payments, and customer engagement.',
    type: 'article',
    publishedTime: '2025-01-25T00:00:00.000Z',
    authors: ['TheQRCode.io Team'],
    tags: ['Restaurant', 'QR Code', 'Local Business', 'Digital Menu'],
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
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Local Business
            </span>
            <span className="text-sm text-gray-500">11 min read</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Restaurant QR Code Solutions: Complete Guide for Local Restaurants
          </h1>
          
          <div className="flex items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>TheQRCode.io Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>January 25, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>11 min read</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-800 mb-8 leading-relaxed">
            QR codes have become essential for modern restaurants, from digital menus to WiFi sharing and customer 
            reviews. This comprehensive guide covers everything local restaurants need to know about implementing 
            QR code solutions that improve customer experience and reduce operational costs.
          </p>

          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              <Utensils className="inline-block mr-2 mb-1" size={24} />
              What You'll Learn
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Digital menu QR codes (update prices instantly)</li>
              <li>• WiFi QR codes for guest access</li>
              <li>• Review QR codes to boost online ratings</li>
              <li>• Table ordering and payment solutions</li>
              <li>• Real restaurant case studies</li>
              <li>• Complete setup instructions</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            <MapPin className="inline-block mr-2 mb-1" size={32} />
            Why Restaurants Need QR Codes
          </h2>
          
          <p className="text-gray-800 mb-6 leading-relaxed">
            The restaurant industry has permanently changed. Diners expect digital options, and QR codes provide 
            the perfect bridge between physical dining and digital convenience.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Benefits</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ View menu on their own device</li>
                <li>✓ See high-quality food photos</li>
                <li>✓ Filter by dietary restrictions</li>
                <li>✓ Translate menu to their language</li>
                <li>✓ Connect to WiFi instantly</li>
                <li>✓ Leave reviews easily</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Restaurant Benefits</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Update prices anytime (no reprinting)</li>
                <li>✓ Reduce printing costs by 80%+</li>
                <li>✓ Get more Google/Yelp reviews</li>
                <li>✓ Track menu viewing analytics</li>
                <li>✓ Reduce staff questions</li>
                <li>✓ Promote specials instantly</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              <TrendingUp className="inline-block mr-2 mb-1" size={24} />
              Real Results from Local Restaurants
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Local Bistro (Chicago):</strong> Saved $4,800/year on menu printing, increased average 
                order value by 18% with menu photos
              </p>
              <p>
                <strong>Taco Shop (Austin):</strong> Got 150+ new Google reviews in 3 months using QR code 
                table tents, rating improved from 3.8 to 4.6 stars
              </p>
              <p>
                <strong>Family Restaurant (Denver):</strong> Reduced "What's the WiFi password?" questions by 95%, 
                freed up staff for better service
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">1. Digital Menu QR Codes</h2>
          
          <p className="text-gray-800 mb-6 leading-relaxed">
            Digital menu QR codes are the most popular use case. Customers scan a code on their table to view 
            your menu on their phone.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works:</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Create your digital menu (PDF, website, or menu platform)</li>
              <li>Generate a QR code that links to your menu</li>
              <li>Print QR codes on table tents, window stickers, or place cards</li>
              <li>Customers scan and view menu instantly</li>
            </ol>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Menu QR Code Options:</h3>

          <div className="space-y-6 mb-8">
            <div className="border-l-4 border-blue-500 pl-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Option 1: PDF Menu (Easiest)</h4>
              <p className="text-gray-700 mb-3">
                Upload your existing menu as a PDF and generate a QR code.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2"><strong>Pros:</strong></p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Quick to set up (5 minutes)</li>
                  <li>• Use your existing menu design</li>
                  <li>• Free to host (Google Drive, Dropbox)</li>
                </ul>
                <p className="text-sm text-gray-700 mt-3 mb-2"><strong>Cons:</strong></p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Not mobile-optimized</li>
                  <li>• Can't track views</li>
                  <li>• Harder to update</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Option 2: Simple Website Menu (Best)</h4>
              <p className="text-gray-700 mb-3">
                Create a mobile-optimized menu website with photos and descriptions.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2"><strong>Pros:</strong></p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Mobile-optimized viewing</li>
                  <li>• Easy to update prices/items</li>
                  <li>• Add photos and descriptions</li>
                  <li>• Track views and popular items</li>
                </ul>
                <p className="text-sm text-gray-700 mt-3 mb-2"><strong>Tools:</strong></p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Canva (free menu templates)</li>
                  <li>• Google Sites (free website builder)</li>
                  <li>• Your existing website</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Option 3: Menu Platform (Most Features)</h4>
              <p className="text-gray-700 mb-3">
                Use a dedicated digital menu platform with ordering capabilities.
              </p>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2"><strong>Pros:</strong></p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Built-in ordering system</li>
                  <li>• Automatic menu updates</li>
                  <li>• Analytics dashboard</li>
                  <li>• Multi-language support</li>
                </ul>
                <p className="text-sm text-gray-700 mt-3 mb-2"><strong>Cost:</strong> $30-100/month</p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Step-by-Step: Create Your Menu QR Code</h3>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <ol className="list-decimal pl-6 space-y-4 text-gray-700">
              <li>
                <strong>Create your digital menu:</strong>
                <ul className="text-sm mt-2 ml-4 space-y-1">
                  <li>• Design in Canva (free templates available)</li>
                  <li>• Export as PDF or create web page</li>
                  <li>• Upload to Google Drive or your website</li>
                  <li>• Get the shareable link (make sure it's public)</li>
                </ul>
              </li>
              <li>
                <strong>Generate QR code:</strong>
                <ul className="text-sm mt-2 ml-4 space-y-1">
                  <li>• Go to <Link href="/qr-code-for-restaurants" className="text-blue-600 hover:underline">TheQRCode.io/restaurants</Link></li>
                  <li>• Paste your menu URL</li>
                  <li>• Customize with your logo/colors</li>
                  <li>• Download high-resolution image</li>
                </ul>
              </li>
              <li>
                <strong>Design table materials:</strong>
                <ul className="text-sm mt-2 ml-4 space-y-1">
                  <li>• Create 4x6 inch table tents</li>
                  <li>• Add text: "Scan for Menu"</li>
                  <li>• Include your logo and branding</li>
                  <li>• Print on cardstock or laminate</li>
                </ul>
              </li>
              <li>
                <strong>Test before printing:</strong>
                <ul className="text-sm mt-2 ml-4 space-y-1">
                  <li>• Print one test copy</li>
                  <li>• Scan with 3-5 different phones</li>
                  <li>• Check menu loads quickly</li>
                  <li>• Verify all pages work</li>
                </ul>
              </li>
              <li>
                <strong>Print and display:</strong>
                <ul className="text-sm mt-2 ml-4 space-y-1">
                  <li>• Print table tents (one per table)</li>
                  <li>• Add window stickers for takeout</li>
                  <li>• Place signs at entrance</li>
                  <li>• Train staff to help customers</li>
                </ul>
              </li>
            </ol>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            <Wifi className="inline-block mr-2 mb-1" size={32} />
            2. WiFi QR Codes
          </h2>
          
          <p className="text-gray-800 mb-6 leading-relaxed">
            WiFi QR codes eliminate the #1 question restaurants hear: "What's the WiFi password?"
          </p>

          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits:</h3>
            <ul className="text-gray-700 space-y-2">
              <li>✓ Customers connect instantly (no typing)</li>
              <li>✓ Reduces staff interruptions by 90%+</li>
              <li>✓ Better experience for international visitors</li>
              <li>✓ Easy to update if password changes</li>
              <li>✓ Can be combined with menu QR code</li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How to Create WiFi QR Code:</h3>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <ol className="list-decimal pl-6 space-y-3 text-gray-700">
              <li>Go to <Link href="/wifi-qr-code-generator" className="text-blue-600 hover:underline">TheQRCode.io/wifi</Link></li>
              <li>Enter your WiFi network name (SSID)</li>
              <li>Enter password</li>
              <li>Select security type (usually WPA/WPA2)</li>
              <li>Download QR code</li>
              <li>Print and place by entrance, bathrooms, or on tables</li>
            </ol>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg mb-8">
            <p className="text-sm text-gray-700">
              <strong>Pro Tip:</strong> Create separate guest and staff networks. Only share guest network via QR code. 
              This keeps your main network secure while providing easy access for customers.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">3. Review Collection QR Codes</h2>
          
          <p className="text-gray-800 mb-6 leading-relaxed">
            Getting online reviews is crucial for local restaurants. Review QR codes make it easy for happy customers 
            to leave reviews.
          </p>

          <div className="bg-purple-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Why It Works:</h3>
            <p className="text-gray-700 mb-3">
              Most satisfied customers don't leave reviews because it's inconvenient. QR codes remove the friction:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Customer scans QR code on receipt or table tent</li>
              <li>Taken directly to your Google/Yelp review page</li>
              <li>Write review in 30 seconds</li>
              <li>Your rating improves, bringing more customers</li>
            </ol>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Setup Instructions:</h3>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Google Reviews:</h4>
            <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-700">
              <li>Search your restaurant on Google Maps</li>
              <li>Scroll to reviews section</li>
              <li>Click "Share" → Copy the review link</li>
              <li>Create QR code with this link</li>
              <li>Print on receipts or table tents with text: "Loved your meal? Leave us a review!"</li>
            </ol>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Yelp Reviews:</h4>
            <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-700">
              <li>Go to your Yelp business page</li>
              <li>Copy the URL</li>
              <li>Add "/writeareview" to the end</li>
              <li>Example: yelp.com/biz/your-restaurant-name/writeareview</li>
              <li>Create QR code with this URL</li>
            </ol>
          </div>

          <div className="bg-red-50 p-4 rounded-lg mb-8">
            <p className="text-sm text-gray-700">
              <strong>Important:</strong> Only ask happy customers for reviews. Use staff judgment - if they loved 
              their meal, mention the QR code. Never incentivize reviews (against Google/Yelp policies).
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">4. Additional Restaurant QR Code Uses</h2>
          
          <div className="space-y-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🍷 Wine List & Specials</h3>
              <p className="text-gray-700">
                Create separate QR codes for wine lists, daily specials, or seasonal menus. Update anytime without reprinting.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🎉 Event Reservations</h3>
              <p className="text-gray-700">
                Link to reservation system (OpenTable, Resy) or event signup forms. Makes booking instant and easy.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💳 Contactless Payment</h3>
              <p className="text-gray-700">
                Generate payment QR codes (Venmo, PayPal, Square) for easy tipping or bill splitting.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📱 Social Media</h3>
              <p className="text-gray-700">
                Link to Instagram for food photos or Facebook for events. Grow your social following effortlessly.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🎁 Loyalty Programs</h3>
              <p className="text-gray-700">
                Direct customers to loyalty signup or rewards app. Build a database of repeat customers.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Complete Setup Checklist</h2>
          
          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Week 1: Basic Implementation</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Create digital menu (PDF or website)</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Generate menu QR code</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Design and print table tents</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Create WiFi QR code</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Test with staff and first customers</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Week 2: Optimization</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Create review collection QR codes</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Add QR codes to receipts</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Place window stickers for takeout</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Train staff on helping customers</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Gather customer feedback</span>
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Cost Breakdown</h2>
          
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Item</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Cost</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">QR Code Generation</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800 font-semibold">Free - $29/mo</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">Static codes free; $9-29/mo for analytics</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">Table Tents (20)</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">$30-60</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">One-time cost, laminated cardstock</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">Window Stickers</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">$15-30</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">One-time cost</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">Menu Platform (optional)</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">$0-100/mo</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">Free options available</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="border border-gray-300 px-4 py-3 text-gray-800 font-bold">Total First Year</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800 font-bold">$45-$1,500</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">Saves $3,000-5,000 on printing</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common Mistakes to Avoid</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">❌ Don't Do This:</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• QR codes without context ("Scan Me" - for what?)</li>
                <li>• Low-quality menu PDFs (blurry, hard to read)</li>
                <li>• Forgetting to test on multiple phones</li>
                <li>• Printing QR codes too small</li>
                <li>• Using dead links or broken pages</li>
                <li>• Not training staff to help customers</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">✅ Best Practices:</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Clear instructions: "Scan for Menu"</li>
                <li>• Mobile-optimized menu pages</li>
                <li>• Test with 5+ different phones</li>
                <li>• QR codes minimum 2x2 inches</li>
                <li>• Keep fallback menus available</li>
                <li>• Have staff explain to first-timers</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
          <p className="text-gray-800 mb-8 leading-relaxed">
            QR codes are no longer optional for restaurants—they're expected. Whether you start with a simple menu 
            QR code or implement a full digital system, the benefits far outweigh the minimal setup cost. Most 
            restaurants see ROI within the first month through reduced printing costs alone.
          </p>

          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Start (This Weekend):</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Upload your menu to Google Drive as PDF (make it public)</li>
              <li>Create QR code at <Link href="/qr-code-for-restaurants" className="text-blue-600 hover:underline">TheQRCode.io/restaurants</Link></li>
              <li>Print 5 table tents as a test</li>
              <li>Try it out Monday morning</li>
              <li>Expand based on customer feedback</li>
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
              Ready to Set Up QR Codes for Your Restaurant?
            </h3>
            <p className="text-gray-700 mb-6">
              Create restaurant-optimized QR codes in minutes. Free to start, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/qr-code-for-restaurants"
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Restaurant QR Code
              </Link>
              <Link
                href="/wifi-qr-code-generator"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
              >
                Create WiFi QR Code
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

