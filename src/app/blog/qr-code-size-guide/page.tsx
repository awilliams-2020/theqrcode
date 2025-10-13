import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Clock, ArrowLeft, Share2, Ruler, Eye, Maximize2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'QR Code Size Guide: How Big Should a QR Code Be? [2025 Standards]',
  description: 'Learn the optimal QR code size for print, billboards, business cards, and posters. Includes formula, distance calculator, and real-world examples.',
  keywords: ['qr code size', 'qr code dimensions', 'how big should qr code be', 'qr code print size', 'minimum qr code size', 'qr code billboard size'],
  openGraph: {
    title: 'QR Code Size Guide: How Big Should a QR Code Be?',
    description: 'Complete guide to QR code sizing for any use case. Includes formulas and calculators.',
    type: 'article',
    publishedTime: '2025-01-20T00:00:00.000Z',
    authors: ['TheQRCode.io Team'],
    tags: ['QR Code', 'Guide', 'Design', 'Print'],
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
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              Guide
            </span>
            <span className="text-sm text-gray-500">9 min read</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            QR Code Size Guide: How Big Should a QR Code Be?
          </h1>
          
          <div className="flex items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>TheQRCode.io Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>January 20, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>9 min read</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-800 mb-8 leading-relaxed">
            The perfect QR code size depends on where it's being used and how far away people will scan it. 
            Too small, and it won't scan. Too large, and it wastes space. This guide covers the optimal size 
            for every use case, with a simple formula to calculate the perfect dimensions.
          </p>

          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              <Ruler className="inline-block mr-2 mb-1" size={24} />
              Quick Answer
            </h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Minimum size:</strong> 2 x 2 cm (0.8 x 0.8 inches)</p>
              <p><strong>Business card:</strong> 2.5 x 2.5 cm (1 x 1 inch)</p>
              <p><strong>Poster/Flyer:</strong> 3-5 cm (1.2-2 inches)</p>
              <p><strong>Billboard:</strong> 150+ cm (60+ inches)</p>
              <p><strong>Formula:</strong> QR Code Size = Scanning Distance ÷ 10</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Golden Rule: Distance ÷ 10</h2>
          <p className="text-gray-800 mb-6 leading-relaxed">
            There's a simple formula to calculate the optimal QR code size based on scanning distance:
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-8 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-4">
              QR Code Size = Scanning Distance ÷ 10
            </div>
            <p className="text-gray-700 text-sm">
              This is the industry-standard formula used by professional designers and marketers
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Examples Using the Formula:</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <div className="font-mono bg-white px-3 py-1 rounded border text-sm">1</div>
                <div>
                  <p><strong>Business Card (scanned at 20cm / 8 inches):</strong></p>
                  <p className="text-sm">20cm ÷ 10 = <strong>2cm (0.8 inches)</strong></p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="font-mono bg-white px-3 py-1 rounded border text-sm">2</div>
                <div>
                  <p><strong>Table Tent (scanned at 30cm / 12 inches):</strong></p>
                  <p className="text-sm">30cm ÷ 10 = <strong>3cm (1.2 inches)</strong></p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="font-mono bg-white px-3 py-1 rounded border text-sm">3</div>
                <div>
                  <p><strong>Poster on Wall (scanned at 50cm / 20 inches):</strong></p>
                  <p className="text-sm">50cm ÷ 10 = <strong>5cm (2 inches)</strong></p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="font-mono bg-white px-3 py-1 rounded border text-sm">4</div>
                <div>
                  <p><strong>Billboard (scanned at 6 meters / 20 feet):</strong></p>
                  <p className="text-sm">600cm ÷ 10 = <strong>60cm (24 inches)</strong></p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            <Eye className="inline-block mr-2 mb-1" size={32} />
            QR Code Size by Use Case
          </h2>

          <div className="space-y-6 mb-8">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">📇 Business Cards</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Recommended Size:</strong> 2-2.5 cm (0.8-1 inch)</p>
                <p className="text-gray-700 mb-2"><strong>Scanning Distance:</strong> 20-25 cm (8-10 inches)</p>
                <p className="text-sm text-gray-600">
                  Business cards are scanned up close, so you can use smaller QR codes. However, don't go below 
                  2cm or older phones may struggle to scan.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">📄 Flyers & Brochures</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Recommended Size:</strong> 3-4 cm (1.2-1.5 inches)</p>
                <p className="text-gray-700 mb-2"><strong>Scanning Distance:</strong> 30-40 cm (12-16 inches)</p>
                <p className="text-sm text-gray-600">
                  Flyers are typically held at arm's length. A 3-4cm QR code is easy to scan while still 
                  leaving room for your content.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🪧 Posters</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Recommended Size:</strong> 5-8 cm (2-3 inches)</p>
                <p className="text-gray-700 mb-2"><strong>Scanning Distance:</strong> 50-80 cm (20-30 inches)</p>
                <p className="text-sm text-gray-600">
                  Wall posters are scanned from a standing distance. Make sure your QR code is large enough to 
                  be noticed and scanned without approaching too closely.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🍽️ Restaurant Table Tents</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Recommended Size:</strong> 4-5 cm (1.5-2 inches)</p>
                <p className="text-gray-700 mb-2"><strong>Scanning Distance:</strong> 40-50 cm (16-20 inches)</p>
                <p className="text-sm text-gray-600">
                  Diners scan from their seats. Make QR codes prominent and large enough to scan comfortably 
                  across the table.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-red-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🏪 Store Window Displays</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Recommended Size:</strong> 10-15 cm (4-6 inches)</p>
                <p className="text-gray-700 mb-2"><strong>Scanning Distance:</strong> 1-1.5 meters (3-5 feet)</p>
                <p className="text-sm text-gray-600">
                  Window shoppers scan from outside the store. Larger QR codes ensure they don't need to press 
                  their face against the glass.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-yellow-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🚗 Vehicle Wraps</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Recommended Size:</strong> 15-30 cm (6-12 inches)</p>
                <p className="text-gray-700 mb-2"><strong>Scanning Distance:</strong> 1.5-3 meters (5-10 feet)</p>
                <p className="text-sm text-gray-600">
                  Vehicle QR codes are scanned while parked. Make them large enough to be seen and scanned from 
                  a reasonable distance. Never expect scanning while driving!
                </p>
              </div>
            </div>

            <div className="border-l-4 border-pink-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🏟️ Billboards & Large Signage</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Recommended Size:</strong> 60-150 cm (24-60 inches)</p>
                <p className="text-gray-700 mb-2"><strong>Scanning Distance:</strong> 6-15 meters (20-50 feet)</p>
                <p className="text-sm text-gray-600">
                  Billboard QR codes need to be massive. Most effective when people can approach (at bus stops, 
                  building sides) rather than highway billboards.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-indigo-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">📱 Digital Screens (Tablets/Phones)</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Recommended Size:</strong> 200-400 pixels</p>
                <p className="text-gray-700 mb-2"><strong>Scanning Distance:</strong> 30-40 cm (12-16 inches)</p>
                <p className="text-sm text-gray-600">
                  For digital displays, think in pixels. 200x200px minimum, but 300x300px or larger is ideal 
                  for retina displays.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Complete Size Reference Table</h2>
          
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Use Case</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Scanning Distance</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Minimum Size</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Recommended Size</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">Business Card</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">20cm (8")</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">2cm (0.8")</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800 font-semibold">2.5cm (1")</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">Flyer/Brochure</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">30cm (12")</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">3cm (1.2")</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800 font-semibold">4cm (1.5")</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">Table Tent</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">40cm (16")</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">4cm (1.5")</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800 font-semibold">5cm (2")</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">Poster (A3/A2)</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">50cm (20")</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">5cm (2")</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800 font-semibold">7cm (2.75")</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">Store Window</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">1m (3.3')</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">10cm (4")</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800 font-semibold">15cm (6")</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">Vehicle Wrap</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">2m (6.5')</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">20cm (8")</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800 font-semibold">25cm (10")</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">Billboard</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">6m (20')</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">60cm (24")</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800 font-semibold">100cm (40")</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Factors That Affect QR Code Size</h2>
          
          <div className="space-y-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                <Maximize2 className="inline-block mr-2 mb-1" size={20} />
                1. Data Complexity
              </h3>
              <p className="text-gray-700 mb-3">
                QR codes with more data have more modules (the small black/white squares). More modules = 
                harder to scan at small sizes.
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• <strong>Short URL (20 characters):</strong> Can be smaller</li>
                <li>• <strong>Long URL (100+ characters):</strong> Needs to be larger</li>
                <li>• <strong>Tip:</strong> Use a URL shortener for simpler, more scannable codes</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Error Correction Level</h3>
              <p className="text-gray-700 mb-3">
                Higher error correction allows codes to work even if partially damaged, but adds more modules.
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• <strong>Low (7%):</strong> Smallest, but fragile</li>
                <li>• <strong>Medium (15%):</strong> Good balance (most common)</li>
                <li>• <strong>High (30%):</strong> Largest, but most reliable</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Print Quality & Contrast</h3>
              <p className="text-gray-700 mb-3">
                Poor print quality requires larger codes to compensate for imperfections.
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• <strong>High-quality printer (600+ DPI):</strong> Can go smaller</li>
                <li>• <strong>Low-quality printer (300 DPI):</strong> Add 20-30% to size</li>
                <li>• <strong>Newspaper print:</strong> Add 50% to compensate for dot gain</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common Mistakes to Avoid</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">❌ Too Small</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Going below 2cm (0.8") minimum</li>
                <li>• Assuming all phones scan small codes easily</li>
                <li>• Not accounting for print quality degradation</li>
                <li>• Using high-data URLs in tiny spaces</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">❌ Too Large</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Wasting valuable design space</li>
                <li>• Making QR codes the dominant element</li>
                <li>• Not considering the scanning distance</li>
                <li>• Using billboard sizes on brochures</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">❌ Poor Placement</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Placing in corners where they bend</li>
                <li>• Putting on glossy surfaces with glare</li>
                <li>• Positioning too high or too low to scan</li>
                <li>• Obscuring with other design elements</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">❌ Skipping Testing</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Not testing before printing thousands</li>
                <li>• Only testing with one phone model</li>
                <li>• Not testing at actual scanning distance</li>
                <li>• Ignoring lighting conditions</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Best Practices Checklist</h2>
          
          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Before You Print:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Calculate size using Distance ÷ 10 formula</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Add 20% buffer for safety (especially for outdoor use)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Test print a sample at actual size</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Scan test print with 3-5 different phone models</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Test at the actual scanning distance and angle</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Ensure high contrast (dark on light, not inverted)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Include clear call-to-action text ("Scan for menu")</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Leave adequate white space (quiet zone) around the code</span>
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Digital vs. Print Considerations</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💻 Digital Screens</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li><strong>Resolution:</strong> 300x300px minimum, 500x500px ideal</li>
                <li><strong>File format:</strong> PNG or SVG (vector)</li>
                <li><strong>Retina displays:</strong> Double resolution (@2x)</li>
                <li><strong>Dark mode:</strong> Invert colors (light code on dark)</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🖨️ Print Materials</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li><strong>Resolution:</strong> 300 DPI minimum at final size</li>
                <li><strong>File format:</strong> Vector (SVG, EPS, PDF) preferred</li>
                <li><strong>Color mode:</strong> CMYK for professional printing</li>
                <li><strong>Bleed:</strong> Add 3mm bleed if near edge</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
          <p className="text-gray-800 mb-8 leading-relaxed">
            The perfect QR code size isn't one-size-fits-all. Use the <strong>Distance ÷ 10 formula</strong> as 
            your starting point, add a 20% buffer for safety, and always test before mass production. When in doubt, 
            go slightly larger—a too-large QR code works fine, but a too-small one is useless.
          </p>

          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Remember:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Absolute minimum: 2 x 2 cm (0.8 x 0.8 inches)</li>
              <li>• Sweet spot for most uses: 3-5 cm (1.2-2 inches)</li>
              <li>• Use the formula: Scanning Distance ÷ 10</li>
              <li>• Always test before printing in bulk</li>
              <li>• When in doubt, go bigger</li>
            </ul>
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
              Create Perfectly-Sized QR Codes
            </h3>
            <p className="text-gray-700 mb-6">
              Our QR code generator creates high-resolution codes optimized for any size. Download in multiple formats.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/qr-code-generator"
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create QR Code
              </Link>
              <Link
                href="/auth/signup?plan=pro"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

