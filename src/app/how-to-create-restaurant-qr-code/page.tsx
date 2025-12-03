import type { Metadata } from 'next'
import { QrCode, CheckCircle, ArrowRight, Download, Palette, BarChart3, Wifi, Utensils, Menu, FileText, Smartphone, Star } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Create a Restaurant QR Code - Complete Step-by-Step Guide | TheQRCode.io',
  description: 'Learn how to create restaurant QR codes for menus, WiFi, and contactless ordering. Step-by-step tutorial with examples. Perfect for restaurants, cafes, and food businesses.',
  keywords: [
    'how to create restaurant qr code',
    'restaurant qr code tutorial',
    'menu qr code guide',
    'create restaurant qr code step by step',
    'restaurant qr code instructions',
    'digital menu qr code',
    'contactless menu setup'
  ],
  openGraph: {
    title: 'How to Create a Restaurant QR Code - Complete Guide',
    description: 'Step-by-step guide to creating QR codes for restaurant menus, WiFi, and customer engagement.',
    type: 'article',
  },
}

export default function HowToCreateRestaurantQRCodePage() {
  const steps = [
    {
      number: 1,
      title: 'Choose Your Restaurant QR Code Type',
      description: 'Select the type of QR code that best fits your restaurant needs.',
      icon: Menu,
      details: [
        'Menu QR Code - Link to your digital menu (most common)',
        'WiFi QR Code - Share WiFi access instantly with customers',
        'Contact QR Code - Share restaurant contact information',
        'Review QR Code - Link to Google Reviews or Yelp',
        'Ordering QR Code - Link to online ordering platform'
      ],
      tips: [],
      examples: [
        { type: 'Menu', example: 'https://yourrestaurant.com/menu' },
        { type: 'WiFi', example: 'Network: Restaurant_Guest, Password: Welcome123' },
        { type: 'Contact', example: 'Restaurant Name, Phone, Address, Website' },
        { type: 'Review', example: 'https://g.page/r/your-restaurant/review' }
      ]
    },
    {
      number: 2,
      title: 'Prepare Your Content',
      description: 'Gather and prepare the information you want to encode in your QR code.',
      icon: FileText,
      details: [
        'For Menu QR Codes: Use our Pro plan Menu Builder to create beautiful menus, or link to your existing PDF/website',
        'For WiFi QR Codes: Get your WiFi network name (SSID) and password',
        'For Contact QR Codes: Prepare phone, address, email, and website',
        'For Review QR Codes: Get your Google Business Profile or Yelp URL'
      ],
      tips: [
        'Pro Plan: Use our built-in Menu Builder to create mobile-optimized menus with categories, items, prices, and photos - no coding required!',
        'Free Option: Link to your existing menu (PDF, website, or Google Doc)',
        'Ensure your menu is mobile-friendly and loads quickly',
        'Use a guest WiFi network for public QR codes',
        'Test your menu URL on multiple devices before generating',
        'Make sure all contact information is up to date'
      ],
      examples: []
    },
    {
      number: 3,
      title: 'Generate Your QR Code',
      description: 'Use our free QR code generator to create your restaurant QR code.',
      icon: QrCode,
      details: [
        'Go to our QR code generator',
        'Select the appropriate QR code type (URL, WiFi, Contact, etc.)',
        'Enter your restaurant information',
        'Customize colors to match your brand'
      ],
      tips: [
        'Use your restaurant\'s brand colors for better recognition',
        'Add your logo to the center (Pro feature)',
        'Ensure high contrast for easy scanning',
        'Test the QR code before printing'
      ],
      examples: []
    },
    {
      number: 4,
      title: 'Print & Display',
      description: 'Print your QR code and place it strategically in your restaurant.',
      icon: Download,
      details: [
        'Print at least 2x2 inches (5x5 cm) for table use',
        'Add clear instructions: "Scan for Menu"',
        'Place on table tents, windows, or at the counter',
        'Use high-quality paper or laminate for durability'
      ],
      tips: [
        'Place QR codes at eye level when possible',
        'Ensure good lighting for scanning',
        'Keep physical menus as backup',
        'Train staff to explain the process to customers'
      ],
      examples: []
    }
  ]

  const restaurantUseCases = [
    {
      icon: Menu,
      name: 'Digital Menu QR Codes',
      description: 'Link directly to your digital menu. Use our Pro plan Menu Builder or link to your existing menu. Update prices and items instantly without reprinting.',
      benefits: [
        'Pro Plan: Built-in Menu Builder - create beautiful menus with categories, items, prices, and photos',
        'Free Option: Link to your existing PDF, website, or Google Doc menu',
        'Update menu anytime without reprinting',
        'Add daily specials instantly',
        'Include high-quality food photos',
        'Support multiple languages'
      ]
    },
    {
      icon: Wifi,
      name: 'WiFi QR Codes',
      description: 'Let customers connect to your WiFi instantly without typing passwords.',
      benefits: [
        'No more password sharing interruptions',
        'Faster customer connection',
        'Better customer experience',
        'Reduced staff interruptions'
      ]
    },
    {
      icon: Star,
      name: 'Review QR Codes',
      description: 'Direct customers to your Google Reviews or Yelp page to boost your online reputation.',
      benefits: [
        'Collect more reviews',
        'Improve online reputation',
        'Increase visibility in search results',
        'Build customer trust'
      ]
    },
    {
      icon: Utensils,
      name: 'Contact QR Codes',
      description: 'Share your restaurant contact information instantly. Customers can save it to their phone.',
      benefits: [
        'Easy contact sharing',
        'Improve customer retention',
        'Professional appearance',
        'Quick access to your information'
      ]
    }
  ]

  const bestPractices = [
    {
      title: 'Menu Optimization',
      description: 'Ensure your digital menu works perfectly on mobile devices',
      tips: [
        'Load time under 3 seconds',
        'Large, readable fonts (minimum 14px)',
        'High-quality food photos',
        'Easy navigation and clear categories'
      ]
    },
    {
      title: 'Placement & Size',
      description: 'Place QR codes where customers can easily scan them',
      tips: [
        'Minimum 2x2 inches for table use',
        'Place at eye level when possible',
        'Add clear "Scan for Menu" instructions',
        'Ensure good lighting for scanning'
      ]
    },
    {
      title: 'Customer Experience',
      description: 'Make the scanning process smooth and intuitive',
      tips: [
        'Keep physical menus as backup',
        'Train staff to help customers',
        'Test QR codes regularly',
        'Monitor analytics to improve'
      ]
    }
  ]

  const restaurantTypes = [
    {
      name: 'Fine Dining',
      description: 'Use QR codes for wine lists, seasonal menus, and chef specials',
      examples: ['Wine list QR codes', 'Seasonal menu updates', 'Chef recommendations']
    },
    {
      name: 'Fast Casual',
      description: 'Display QR codes at counters and tables for quick ordering',
      examples: ['Counter displays', 'Table QR codes', 'Online ordering links']
    },
    {
      name: 'Coffee Shops & Cafes',
      description: 'Show drink menus and seasonal specials while customers wait',
      examples: ['Drink menu QR codes', 'Seasonal specials', 'WiFi sharing']
    },
    {
      name: 'Food Trucks',
      description: 'Perfect for mobile businesses with changing menus',
      examples: ['Menu updates', 'Location tracking', 'Social media links']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 text-white rounded-full mb-6">
            <Utensils className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How to Create a Restaurant QR Code
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete step-by-step guide to creating QR codes for your restaurant. 
            Perfect for digital menus, WiFi sharing, and customer engagement.
          </p>
        </div>

        {/* Quick CTA */}
        <div className="max-w-4xl mx-auto mb-16 bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Create your restaurant QR code in minutes. Free, no signup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/qr-code-generator" 
              className="inline-flex items-center px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-lg"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Create Restaurant QR Code
            </Link>
            <Link 
              href="/blog/how-to-create-a-restaurant-qr-code" 
              className="inline-flex items-center px-8 py-4 bg-white text-red-600 border-2 border-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors text-lg"
            >
              <FileText className="w-5 h-5 mr-2" />
              Read Full Blog Post
            </Link>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Step-by-Step Tutorial
          </h2>
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <step.icon className="w-8 h-8 text-red-600" />
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">What to do:</h4>
                        <ul className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Pro Tips:</h4>
                        <ul className="space-y-2">
                          {step.tips && step.tips.length > 0 ? step.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2">
                              <ArrowRight className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{tip}</span>
                            </li>
                          )) : (
                            <li className="text-gray-500 text-sm">No tips for this step</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {step.examples && step.examples.length > 0 && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">Restaurant Examples:</h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {step.examples.map((example, exampleIndex) => (
                            <div key={exampleIndex} className="bg-white p-3 rounded border">
                              <div className="font-medium text-red-600 text-sm">{example.type}</div>
                              <div className="text-gray-700 text-sm">{example.example}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurant Use Cases */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Restaurant QR Code Use Cases
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {restaurantUseCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <useCase.icon className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{useCase.name}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                  <ul className="space-y-1">
                    {useCase.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurant Types */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Perfect for All Restaurant Types
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurantTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{type.description}</p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Examples:</h4>
                  <ul className="space-y-1">
                    {type.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="text-sm text-gray-600">• {example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Restaurant QR Code Best Practices
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {bestPractices.map((practice, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{practice.title}</h3>
                <p className="text-gray-600 mb-4">{practice.description}</p>
                <ul className="space-y-2">
                  {practice.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Plan Feature Section */}
        <div className="max-w-4xl mx-auto mb-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl shadow-lg p-8 text-white">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Menu className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Pro Plan: Built-in Menu Builder</h2>
            <p className="text-xl text-red-100 mb-6">
              Create stunning, mobile-optimized menus without any coding or design skills.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">✓ Easy Menu Creation</h3>
              <p className="text-red-100 text-sm">Add categories, items, prices, descriptions, and photos with our intuitive builder.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">✓ Mobile-Optimized</h3>
              <p className="text-red-100 text-sm">Menus automatically look perfect on all devices - no extra work needed.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">✓ Instant Updates</h3>
              <p className="text-red-100 text-sm">Change prices, add specials, or update items in seconds. No reprinting required.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">✓ Professional Design</h3>
              <p className="text-red-100 text-sm">Beautiful, branded menus that match your restaurant's style and personality.</p>
            </div>
          </div>
          <div className="text-center">
            <Link 
              href="/auth/signup?plan=pro"
              className="inline-flex items-center px-8 py-4 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors text-lg"
            >
              <Menu className="w-5 h-5 mr-2" />
              Try Pro Plan Menu Builder
            </Link>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto mb-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Restaurants Love QR Codes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contactless Experience</h3>
                <p className="text-gray-600">Eliminate physical menu handling and keep customers safe.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cost Savings</h3>
                <p className="text-gray-600">No more printing costs. Update menus instantly without reprinting.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Better Customer Experience</h3>
                <p className="text-gray-600">Customers can view menus on their own devices with zoom and accessibility features.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Easy Updates</h3>
                <p className="text-gray-600">Change prices, add specials, or update items instantly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Restaurant QR Code?</h2>
          <p className="text-xl text-red-100 mb-8">
            Follow our step-by-step guide and create your restaurant QR code in minutes. Free, no signup required!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/qr-code-generator" 
              className="inline-flex items-center px-8 py-4 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors text-lg"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Create QR Code Now
            </Link>
            <Link 
              href="/qr-code-for-restaurants" 
              className="inline-flex items-center px-8 py-4 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition-colors text-lg"
            >
              <Utensils className="w-5 h-5 mr-2" />
              Restaurant Solutions
            </Link>
            <Link 
              href="/blog/how-to-create-a-restaurant-qr-code" 
              className="inline-flex items-center px-8 py-4 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition-colors text-lg"
            >
              <FileText className="w-5 h-5 mr-2" />
              Read Full Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

