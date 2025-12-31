import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import BlogArticleSchema from '@/components/BlogArticleSchema'
import RelatedContent from '@/components/RelatedContent'

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
    images: ['/og-qr-size-calculator.jpg'],
    type: 'article',
    publishedTime: '2024-01-20T00:00:00.000Z',
    modifiedTime: '2024-01-20T00:00:00.000Z',
  },
  alternates: {
    canonical: '/blog/qr-code-size-calculator-guide',
  },
}

const publishDate = '2024-01-20T00:00:00.000Z'
const articleUrl = '/blog/qr-code-size-calculator-guide'

export default function QRCodeSizeCalculatorPage() {
  return (
    <>
      <BlogArticleSchema
        title="QR Code Size Calculator - Perfect Size Every Time"
        description="Calculate the perfect QR code size for any use case. Free QR code size calculator with guidelines for business cards, posters, billboards, and digital displays."
        datePublished={publishDate}
        dateModified={publishDate}
        url={articleUrl}
        wordCount={2000}
        timeRequired="PT8M"
        proficiencyLevel="Intermediate"
      />
      
      <div className="min-h-screen bg-white">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <Breadcrumbs 
            items={[
              { name: 'Blog', url: '/blog' },
              { name: 'QR Code Size Calculator Guide', url: articleUrl }
            ]}
            className="mb-6"
          />
          
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              QR Code Size Calculator - Perfect Size Every Time
            </h1>
            <div className="flex items-center text-sm text-gray-600 space-x-4">
              <time dateTime={publishDate}>January 20, 2024</time>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </header>
      
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

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-800 mb-8 leading-relaxed">
              Choosing the right QR code size is crucial for successful scanning. Too small, and users 
              will struggle to scan it. Too large, and it might overwhelm your design. This guide helps 
              you calculate the perfect size for any use case.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">QR Code Size Guidelines by Use Case</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">📱 Business Cards</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-gray-800"><strong>Recommended Size:</strong> 2-2.5 cm (0.8-1 inch)</p>
              <p className="text-gray-800"><strong>Minimum Size:</strong> 2 cm (0.8 inch)</p>
              <p className="text-gray-800"><strong>Scanning Distance:</strong> 20-25 cm (8-10 inches)</p>
              <p className="text-gray-800"><strong>Error Correction:</strong> Medium (M) or High (H)</p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">📄 Flyers & Brochures</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-gray-800"><strong>Recommended Size:</strong> 3-4 cm (1.2-1.5 inches)</p>
              <p className="text-gray-800"><strong>Minimum Size:</strong> 3 cm (1.2 inches)</p>
              <p className="text-gray-800"><strong>Scanning Distance:</strong> 30-40 cm (12-16 inches)</p>
              <p className="text-gray-800"><strong>Error Correction:</strong> Medium (M)</p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">🖼️ Posters & Banners</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-gray-800"><strong>Recommended Size:</strong> 5-8 cm (2-3 inches)</p>
              <p className="text-gray-800"><strong>Minimum Size:</strong> 5 cm (2 inches)</p>
              <p className="text-gray-800"><strong>Scanning Distance:</strong> 50-80 cm (20-30 inches)</p>
              <p className="text-gray-800"><strong>Error Correction:</strong> Low (L) or Medium (M)</p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">🏢 Billboards & Large Displays</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-gray-800"><strong>Recommended Size:</strong> 60-150 cm (24-60 inches)</p>
              <p className="text-gray-800"><strong>Minimum Size:</strong> 60 cm (24 inches)</p>
              <p className="text-gray-800"><strong>Scanning Distance:</strong> 6-15 meters (20-50 feet)</p>
              <p className="text-gray-800"><strong>Error Correction:</strong> Low (L)</p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">💻 Digital Displays & Websites</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-gray-800"><strong>Recommended Size:</strong> 200px x 200px</p>
              <p className="text-gray-800"><strong>Minimum Size:</strong> 150px x 150px</p>
              <p className="text-gray-800"><strong>Viewing Distance:</strong> 18-24 inches</p>
              <p className="text-gray-800"><strong>Error Correction:</strong> Medium (M)</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">QR Code Size Calculator Formula</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Basic Calculation:</h3>
              <p className="text-gray-800"><strong>QR Code Size = Scanning Distance ÷ 10</strong></p>
              <p className="text-sm text-gray-700 mt-2">
                This is the industry-standard formula used by professional designers and marketers. It ensures your 
                QR code is scannable from the intended scanning distance.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Example Calculations:</h3>
            <ul className="list-disc pl-6 mb-8 text-gray-800 space-y-2">
              <li><strong>Business Card (20cm / 8" scanning distance):</strong> 20cm ÷ 10 = 2cm (0.8") minimum</li>
              <li><strong>Poster (50cm / 20" scanning distance):</strong> 50cm ÷ 10 = 5cm (2") minimum</li>
              <li><strong>Billboard (6m / 20' scanning distance):</strong> 600cm ÷ 10 = 60cm (24") minimum</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Factors That Affect QR Code Size</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Data Amount</h3>
            <p className="text-gray-800 mb-6 leading-relaxed">
              More data = more modules = larger QR code. URL QR codes are typically larger 
              than text QR codes due to the amount of information stored.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Error Correction Level</h3>
        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left font-semibold text-gray-900">Level</th>
              <th className="border border-gray-300 p-2 text-left font-semibold text-gray-900">Recovery</th>
              <th className="border border-gray-300 p-2 text-left font-semibold text-gray-900">Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 text-gray-800">Low (L)</td>
              <td className="border border-gray-300 p-2 text-gray-800">~7%</td>
              <td className="border border-gray-300 p-2 text-gray-800">Clean environments, large displays</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-gray-800">Medium (M)</td>
              <td className="border border-gray-300 p-2 text-gray-800">~15%</td>
              <td className="border border-gray-300 p-2 text-gray-800">General purpose, most common</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-gray-800">Quartile (Q)</td>
              <td className="border border-gray-300 p-2 text-gray-800">~25%</td>
              <td className="border border-gray-300 p-2 text-gray-800">Damaged or dirty environments</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-gray-800">High (H)</td>
              <td className="border border-gray-300 p-2 text-gray-800">~30%</td>
              <td className="border border-gray-300 p-2 text-gray-800">Maximum error correction</td>
            </tr>
          </tbody>
        </table>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Scanning Device Capabilities</h3>
            <ul className="list-disc pl-6 mb-8 text-gray-800 space-y-2">
              <li><strong>Modern smartphones:</strong> Can scan smaller QR codes</li>
              <li><strong>Older devices:</strong> May need larger QR codes</li>
              <li><strong>Camera quality:</strong> Higher resolution cameras can scan smaller codes</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common QR Code Size Mistakes</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">❌ Too Small</h3>
            <p className="text-gray-800 mb-6 leading-relaxed">
              QR codes that are too small are difficult to scan, especially on mobile devices. 
              This leads to poor user experience and low scan rates.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">❌ Too Large</h3>
            <p className="text-gray-800 mb-6 leading-relaxed">
              Oversized QR codes waste space and can look unprofessional. They may also 
              overwhelm the design of your marketing materials.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">❌ Wrong Aspect Ratio</h3>
            <p className="text-gray-800 mb-6 leading-relaxed">
              QR codes must be square. Stretching or compressing them will make them unscannable.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Testing Your QR Code Size</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Print Test</h3>
            <ol className="list-decimal pl-6 mb-6 text-gray-800 space-y-3">
              <li>Print your QR code at the intended size</li>
              <li>Test scanning from the expected viewing distance</li>
              <li>Try scanning with different devices (iPhone, Android, tablet)</li>
              <li>Test in different lighting conditions</li>
            </ol>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Digital Test</h3>
            <ol className="list-decimal pl-6 mb-8 text-gray-800 space-y-3">
              <li>View your QR code on the intended screen size</li>
              <li>Test scanning from the expected viewing distance</li>
              <li>Check readability on different screen resolutions</li>
              <li>Test on both desktop and mobile browsers</li>
            </ol>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Industry-Specific Size Recommendations</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Restaurant QR Codes</h3>
            <p className="text-gray-800 mb-6 leading-relaxed">
              <strong>Table tent cards:</strong> 4-5 cm (1.5-2 inches) recommended, 4 cm (1.5") minimum<br/>
              <strong>Window stickers:</strong> 10-15 cm (4-6 inches) recommended, 10 cm (4") minimum<br/>
              <strong>Menu inserts:</strong> 3-4 cm (1.2-1.5 inches) recommended, 3 cm (1.2") minimum
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Real Estate QR Codes</h3>
            <p className="text-gray-800 mb-6 leading-relaxed">
              <strong>For sale signs:</strong> 10-15 cm (4-6 inches) recommended, 10 cm (4") minimum<br/>
              <strong>Property flyers:</strong> 3-4 cm (1.2-1.5 inches) recommended, 3 cm (1.2") minimum<br/>
              <strong>Business cards:</strong> 2-2.5 cm (0.8-1 inch) recommended, 2 cm (0.8") minimum
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Event QR Codes</h3>
            <p className="text-gray-800 mb-6 leading-relaxed">
              <strong>Name badges:</strong> 2 cm (0.8") minimum<br/>
              <strong>Event banners:</strong> 15-30 cm (6-12 inches) recommended, 15 cm (6") minimum<br/>
              <strong>Program booklets:</strong> 3-4 cm (1.2-1.5 inches) recommended, 3 cm (1.2") minimum
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Quick Reference Chart</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-900">Use Case</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-900">Minimum Size</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-900">Recommended Size</th>
                <th className="border border-gray-300 p-2 text-left font-semibold text-gray-900">Viewing Distance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 text-gray-800">Business Card</td>
                <td className="border border-gray-300 p-2 text-gray-800">2 cm (0.8")</td>
                <td className="border border-gray-300 p-2 text-gray-800">2-2.5 cm (0.8-1")</td>
                <td className="border border-gray-300 p-2 text-gray-800">20-25 cm (8-10")</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-gray-800">Flyer/Brochure</td>
                <td className="border border-gray-300 p-2 text-gray-800">3 cm (1.2")</td>
                <td className="border border-gray-300 p-2 text-gray-800">3-4 cm (1.2-1.5")</td>
                <td className="border border-gray-300 p-2 text-gray-800">30-40 cm (12-16")</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-gray-800">Poster</td>
                <td className="border border-gray-300 p-2 text-gray-800">5 cm (2")</td>
                <td className="border border-gray-300 p-2 text-gray-800">5-8 cm (2-3")</td>
                <td className="border border-gray-300 p-2 text-gray-800">50-80 cm (20-30")</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-gray-800">Billboard</td>
                <td className="border border-gray-300 p-2 text-gray-800">60 cm (24")</td>
                <td className="border border-gray-300 p-2 text-gray-800">60-150 cm (24-60")</td>
                <td className="border border-gray-300 p-2 text-gray-800">6-15 m (20-50')</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-gray-800">Website</td>
                <td className="border border-gray-300 p-2 text-gray-800">150px x 150px</td>
                <td className="border border-gray-300 p-2 text-gray-800">200px x 200px</td>
                <td className="border border-gray-300 p-2 text-gray-800">18-24 inches</td>
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
          
          <RelatedContent
          items={[
            {
              title: 'QR Code Size Guide',
              url: '/blog/qr-code-size-guide',
              description: 'Learn the optimal QR code size for print, billboards, business cards, and posters.'
            },
            {
              title: 'QR Code Best Practices',
              url: '/blog/qr-code-best-practices',
              description: 'Learn the essential design principles and best practices for creating QR codes.'
            },
            {
              title: 'Best QR Code Generators 2025',
              url: '/blog/best-qr-code-generators-2025',
              description: 'Compare the top QR code generator tools and find the best one for your needs.'
            }
          ]}
          className="mt-12"
        />
      </article>
      </div>
    </>
  )
}
