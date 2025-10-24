import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'QR Code Size Calculator - Perfect Size Every Time | TheQRCode.io',
  description: 'Calculate the perfect QR code size for any use case. Free QR code size calculator with guidelines for business cards, posters, billboards, and digital displays.',
  keywords: [
    'QR code size calculator',
    'QR code size guide',
    'QR code dimensions',
    'QR code size for business card',
    'QR code size for poster',
    'QR code minimum size',
    'QR code resolution calculator'
  ],
  openGraph: {
    title: 'QR Code Size Calculator - Perfect Size Every Time',
    description: 'Calculate the perfect QR code size for any use case. Free calculator with guidelines for business cards, posters, and digital displays.',
    images: ['/og-qr-size-calculator.jpg']
  }
}

export default function QRCodeSizeCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        QR Code Size Calculator - Perfect Size Every Time
      </h1>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-green-900 mb-3">
          Free QR Code Size Calculator
        </h2>
        <p className="text-green-800 mb-4">
          Calculate the perfect QR code size for your specific use case. Our calculator 
          considers viewing distance, error correction, and scanning device capabilities.
        </p>
        <Link 
          href="/qr-code-generator"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Use Our QR Code Generator
        </Link>
      </div>

      <div className="prose max-w-none">
        <h2>QR Code Size Guidelines by Use Case</h2>
        
        <h3>📱 Business Cards</h3>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p><strong>Recommended Size:</strong> 1.5" x 1.5" (38mm x 38mm)</p>
          <p><strong>Minimum Size:</strong> 1" x 1" (25mm x 25mm)</p>
          <p><strong>Viewing Distance:</strong> 6-12 inches</p>
          <p><strong>Error Correction:</strong> Medium (M) or High (H)</p>
        </div>

        <h3>📄 Flyers & Brochures</h3>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p><strong>Recommended Size:</strong> 2" x 2" (50mm x 50mm)</p>
          <p><strong>Minimum Size:</strong> 1.5" x 1.5" (38mm x 38mm)</p>
          <p><strong>Viewing Distance:</strong> 12-24 inches</p>
          <p><strong>Error Correction:</strong> Medium (M)</p>
        </div>

        <h3>🖼️ Posters & Banners</h3>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p><strong>Recommended Size:</strong> 4" x 4" (100mm x 100mm)</p>
          <p><strong>Minimum Size:</strong> 3" x 3" (75mm x 75mm)</p>
          <p><strong>Viewing Distance:</strong> 3-6 feet</p>
          <p><strong>Error Correction:</strong> Low (L) or Medium (M)</p>
        </div>

        <h3>🏢 Billboards & Large Displays</h3>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p><strong>Recommended Size:</strong> 12" x 12" (300mm x 300mm)</p>
          <p><strong>Minimum Size:</strong> 8" x 8" (200mm x 200mm)</p>
          <p><strong>Viewing Distance:</strong> 10-50 feet</p>
          <p><strong>Error Correction:</strong> Low (L)</p>
        </div>

        <h3>💻 Digital Displays & Websites</h3>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p><strong>Recommended Size:</strong> 200px x 200px</p>
          <p><strong>Minimum Size:</strong> 150px x 150px</p>
          <p><strong>Viewing Distance:</strong> 18-24 inches</p>
          <p><strong>Error Correction:</strong> Medium (M)</p>
        </div>

        <h2>QR Code Size Calculator Formula</h2>
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3>Basic Calculation:</h3>
          <p><strong>QR Code Size = Viewing Distance ÷ 10</strong></p>
          <p className="text-sm text-gray-600 mt-2">
            This formula ensures your QR code is scannable from the intended viewing distance.
          </p>
        </div>

        <h3>Example Calculations:</h3>
        <ul>
          <li><strong>Business Card (6" viewing distance):</strong> 6 ÷ 10 = 0.6" minimum</li>
          <li><strong>Poster (36" viewing distance):</strong> 36 ÷ 10 = 3.6" minimum</li>
          <li><strong>Billboard (120" viewing distance):</strong> 120 ÷ 10 = 12" minimum</li>
        </ul>

        <h2>Factors That Affect QR Code Size</h2>
        
        <h3>1. Data Amount</h3>
        <p>
          More data = more modules = larger QR code. URL QR codes are typically larger 
          than text QR codes due to the amount of information stored.
        </p>

        <h3>2. Error Correction Level</h3>
        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Level</th>
              <th className="border border-gray-300 p-2 text-left">Recovery</th>
              <th className="border border-gray-300 p-2 text-left">Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">Low (L)</td>
              <td className="border border-gray-300 p-2">~7%</td>
              <td className="border border-gray-300 p-2">Clean environments, large displays</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Medium (M)</td>
              <td className="border border-gray-300 p-2">~15%</td>
              <td className="border border-gray-300 p-2">General purpose, most common</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Quartile (Q)</td>
              <td className="border border-gray-300 p-2">~25%</td>
              <td className="border border-gray-300 p-2">Damaged or dirty environments</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">High (H)</td>
              <td className="border border-gray-300 p-2">~30%</td>
              <td className="border border-gray-300 p-2">Maximum error correction</td>
            </tr>
          </tbody>
        </table>

        <h3>3. Scanning Device Capabilities</h3>
        <ul>
          <li><strong>Modern smartphones:</strong> Can scan smaller QR codes</li>
          <li><strong>Older devices:</strong> May need larger QR codes</li>
          <li><strong>Camera quality:</strong> Higher resolution cameras can scan smaller codes</li>
        </ul>

        <h2>Common QR Code Size Mistakes</h2>
        
        <h3>❌ Too Small</h3>
        <p>
          QR codes that are too small are difficult to scan, especially on mobile devices. 
          This leads to poor user experience and low scan rates.
        </p>

        <h3>❌ Too Large</h3>
        <p>
          Oversized QR codes waste space and can look unprofessional. They may also 
          overwhelm the design of your marketing materials.
        </p>

        <h3>❌ Wrong Aspect Ratio</h3>
        <p>
          QR codes must be square. Stretching or compressing them will make them unscannable.
        </p>

        <h2>Testing Your QR Code Size</h2>
        
        <h3>Print Test</h3>
        <ol>
          <li>Print your QR code at the intended size</li>
          <li>Test scanning from the expected viewing distance</li>
          <li>Try scanning with different devices (iPhone, Android, tablet)</li>
          <li>Test in different lighting conditions</li>
        </ol>

        <h3>Digital Test</h3>
        <ol>
          <li>View your QR code on the intended screen size</li>
          <li>Test scanning from the expected viewing distance</li>
          <li>Check readability on different screen resolutions</li>
          <li>Test on both desktop and mobile browsers</li>
        </ol>

        <h2>Industry-Specific Size Recommendations</h2>
        
        <h3>Restaurant QR Codes</h3>
        <p>
          <strong>Table tent cards:</strong> 2" x 2" minimum<br/>
          <strong>Window stickers:</strong> 3" x 3" minimum<br/>
          <strong>Menu inserts:</strong> 1.5" x 1.5" minimum
        </p>

        <h3>Real Estate QR Codes</h3>
        <p>
          <strong>For sale signs:</strong> 4" x 4" minimum<br/>
          <strong>Property flyers:</strong> 2" x 2" minimum<br/>
          <strong>Business cards:</strong> 1.5" x 1.5" minimum
        </p>

        <h3>Event QR Codes</h3>
        <p>
          <strong>Name badges:</strong> 1" x 1" minimum<br/>
          <strong>Event banners:</strong> 6" x 6" minimum<br/>
          <strong>Program booklets:</strong> 1.5" x 1.5" minimum
        </p>

        <h2>Quick Reference Chart</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Use Case</th>
                <th className="border border-gray-300 p-2 text-left">Minimum Size</th>
                <th className="border border-gray-300 p-2 text-left">Recommended Size</th>
                <th className="border border-gray-300 p-2 text-left">Viewing Distance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Business Card</td>
                <td className="border border-gray-300 p-2">1" x 1"</td>
                <td className="border border-gray-300 p-2">1.5" x 1.5"</td>
                <td className="border border-gray-300 p-2">6-12 inches</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Flyer</td>
                <td className="border border-gray-300 p-2">1.5" x 1.5"</td>
                <td className="border border-gray-300 p-2">2" x 2"</td>
                <td className="border border-gray-300 p-2">12-24 inches</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Poster</td>
                <td className="border border-gray-300 p-2">3" x 3"</td>
                <td className="border border-gray-300 p-2">4" x 4"</td>
                <td className="border border-gray-300 p-2">3-6 feet</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Billboard</td>
                <td className="border border-gray-300 p-2">8" x 8"</td>
                <td className="border border-gray-300 p-2">12" x 12"</td>
                <td className="border border-gray-300 p-2">10-50 feet</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Website</td>
                <td className="border border-gray-300 p-2">150px x 150px</td>
                <td className="border border-gray-300 p-2">200px x 200px</td>
                <td className="border border-gray-300 p-2">18-24 inches</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">💡 Pro Tip</h3>
          <p className="text-yellow-800">
            When in doubt, make your QR code slightly larger rather than smaller. 
            It's better to have a QR code that's easy to scan than one that frustrates users.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">Ready to Create Perfectly Sized QR Codes?</h3>
          <p className="text-green-800 mb-4">
            Use our QR code generator with built-in size recommendations for your specific use case.
          </p>
          <Link 
            href="/qr-code-generator"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Generate QR Code with Perfect Size
          </Link>
        </div>
      </div>
    </div>
  )
}
