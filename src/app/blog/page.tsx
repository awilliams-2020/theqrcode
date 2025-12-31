import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import StructuredData from '@/components/StructuredData'
import BlogContent from '@/components/BlogContent'

export const metadata: Metadata = {
  title: 'QR Code Blog - Tips, Tutorials & Best Practices | TheQRCode.io',
  description: 'Learn everything about QR codes with our comprehensive blog. Get tips, tutorials, best practices, and guides for QR code marketing, analytics, and implementation.',
  keywords: [
    'qr code blog', 'qr code tips', 'qr code tutorials', 'qr code guides', 
    'qr code best practices', 'qr code marketing', 'qr code analytics',
    'how to use qr codes', 'qr code examples', 'qr code strategies'
  ],
  openGraph: {
    title: 'QR Code Blog - Tips, Tutorials & Best Practices',
    description: 'Learn everything about QR codes with our comprehensive blog. Get tips, tutorials, and best practices for QR code marketing and analytics.',
    type: 'website',
    url: 'https://theqrcode.io/blog',
  },
  alternates: {
    canonical: '/blog',
  },
}

const blogPosts = [
  {
    id: 'free-qr-code-generator-no-signup',
    title: 'Free QR Code Generator - No Sign Up Required',
    excerpt: 'Generate QR codes instantly without creating an account. Free QR code generator with analytics, multiple formats, and no registration required.',
    date: '2025-12-03',
    author: 'TheQRCode.io Team',
    readTime: '4 min read',
    category: 'Tools',
    tags: ['Free', 'Generator', 'No Signup', 'Tools'],
    featured: true,
  },
  {
    id: 'best-qr-code-generators-2025',
    title: 'Best QR Code Generators 2025 (We Tested 15)',
    excerpt: 'We tested 15 popular QR code generators to find the best options. Honest comparison covering features, pricing, analytics, and ease of use.',
    date: '2025-01-15',
    author: 'TheQRCode.io Team',
    readTime: '12 min read',
    category: 'Tools',
    tags: ['Comparison', 'Review', 'Tools', 'Best'],
    featured: true,
  },
  {
    id: 'how-to-create-wifi-qr-code',
    title: 'How to Create a WiFi QR Code [Complete Step-by-Step Guide]',
    excerpt: 'Learn how to create a WiFi QR code in 5 minutes. Share your WiFi password instantly without typing. Perfect for restaurants, offices, Airbnb, and home use.',
    date: '2025-01-18',
    author: 'TheQRCode.io Team',
    readTime: '7 min read',
    category: 'Tutorial',
    tags: ['WiFi', 'Tutorial', 'How-To', 'Guide'],
    featured: true,
  },
  {
    id: 'how-to-create-a-restaurant-qr-code',
    title: 'How to Create a Restaurant QR Code [Complete Step-by-Step Guide]',
    excerpt: 'Learn how to create a restaurant QR code in minutes. Step-by-step guide for digital menus, contactless ordering, WiFi sharing, and customer engagement. Free QR code generator included.',
    date: '2025-01-28',
    author: 'TheQRCode.io Team',
    readTime: '10 min read',
    category: 'Tutorial',
    tags: ['Restaurant', 'Tutorial', 'How-To', 'Guide', 'Menu'],
    featured: true,
  },
  {
    id: 'how-to-create-pro-plan-restaurant-menu-qr-code',
    title: 'How to Create a Pro Plan Restaurant Menu QR Code [Complete Guide]',
    excerpt: 'Learn how to create professional restaurant menu QR codes using the Pro plan menu builder. Build beautiful, mobile-optimized digital menus directly in TheQRCode.io. No external hosting needed.',
    date: '2025-01-30',
    author: 'TheQRCode.io Team',
    readTime: '12 min read',
    category: 'Tutorial',
    tags: ['Restaurant', 'Tutorial', 'Pro Plan', 'Menu Builder', 'How-To'],
    featured: true,
  },
  {
    id: 'qr-code-size-guide',
    title: 'QR Code Size Guide: How Big Should a QR Code Be?',
    excerpt: 'Learn the optimal QR code size for print, billboards, business cards, and posters. Includes formula, distance calculator, and real-world examples.',
    date: '2025-01-20',
    author: 'TheQRCode.io Team',
    readTime: '9 min read',
    category: 'Design',
    tags: ['Design', 'Guide', 'Print', 'Best Practices'],
    featured: true,
  },
  {
    id: 'qr-code-size-calculator-guide',
    title: 'QR Code Size Calculator - Perfect Size Every Time',
    excerpt: 'Calculate the perfect QR code size for any use case. Free QR code size calculator with guidelines for business cards, posters, billboards, and digital displays.',
    date: '2024-01-20',
    author: 'TheQRCode.io Team',
    readTime: '8 min read',
    category: 'Tools',
    tags: ['Calculator', 'Tools', 'Size', 'Guide'],
    featured: true,
  },
  {
    id: 'do-qr-codes-expire',
    title: 'Do QR Codes Expire? (And How to Make Permanent Ones)',
    excerpt: 'Learn if QR codes expire, the difference between static and dynamic codes, and how to create permanent QR codes that never expire.',
    date: '2025-01-22',
    author: 'TheQRCode.io Team',
    readTime: '8 min read',
    category: 'Guide',
    tags: ['Guide', 'Static', 'Dynamic', 'FAQ'],
    featured: true,
  },
  {
    id: 'restaurant-qr-code-solutions-local',
    title: 'Restaurant QR Code Solutions: Complete Local Guide',
    excerpt: 'Complete guide to QR codes for restaurants. Digital menus, WiFi sharing, contactless payments, and customer reviews. Setup in minutes.',
    date: '2025-01-25',
    author: 'TheQRCode.io Team',
    readTime: '11 min read',
    category: 'Industry',
    tags: ['Restaurant', 'Local Business', 'Tutorial', 'Guide'],
    featured: true,
  },
  {
    id: 'restaurant-qr-code-menu-setup-5-minutes',
    title: 'Restaurant Menu QR Code Setup in 5 Minutes',
    excerpt: 'Complete guide to setting up QR code menus for restaurants. Free QR code generator, step-by-step instructions, and best practices for contactless dining.',
    date: '2024-01-25',
    author: 'TheQRCode.io Team',
    readTime: '5 min read',
    category: 'Tutorial',
    tags: ['Restaurant', 'Tutorial', 'Quick Setup', 'Menu'],
    featured: true,
  },
  {
    id: 'qr-code-roi-guide',
    title: 'Maximizing QR Code ROI: Complete Guide to Measuring and Improving Returns',
    excerpt: 'Learn how to calculate, track, and optimize ROI from your QR code campaigns. Proven strategies for maximizing returns with real-world examples.',
    date: '2025-10-11',
    author: 'TheQRCode.io Team',
    readTime: '10 min read',
    category: 'Analytics',
    tags: ['ROI', 'Analytics', 'Business', 'Strategy'],
    featured: false,
  },
  {
    id: 'qr-code-best-practices',
    title: 'QR Code Best Practices: Design Tips for Maximum Engagement',
    excerpt: 'Learn the essential design principles and best practices for creating QR codes that drive engagement and deliver results.',
    date: '2024-01-15',
    author: 'TheQRCode.io Team',
    readTime: '5 min read',
    category: 'Design',
    tags: ['Design', 'Best Practices', 'Tips'],
    featured: false,
  },
  {
    id: 'qr-code-marketing-guide',
    title: 'Complete Guide to QR Code Marketing in 2024',
    excerpt: 'Discover how to use QR codes effectively in your marketing campaigns with real-world examples and proven strategies.',
    date: '2024-01-10',
    author: 'TheQRCode.io Team',
    readTime: '8 min read',
    category: 'Marketing',
    tags: ['Marketing', 'Strategy', 'Campaigns'],
    featured: false,
  },
  {
    id: 'qr-code-analytics-tutorial',
    title: 'Understanding QR Code Analytics: What Data Matters Most',
    excerpt: 'Learn how to interpret QR code analytics data to optimize your campaigns and improve ROI.',
    date: '2024-01-05',
    author: 'TheQRCode.io Team',
    readTime: '6 min read',
    category: 'Analytics',
    tags: ['Analytics', 'Data', 'ROI'],
    featured: false,
  },
  {
    id: 'qr-code-restaurant-marketing',
    title: 'QR Code Marketing for Restaurants: Menu & Contactless Solutions',
    excerpt: 'How restaurants can leverage QR codes for contactless menus, loyalty programs, and customer engagement.',
    date: '2024-01-01',
    author: 'TheQRCode.io Team',
    readTime: '7 min read',
    category: 'Industry',
    tags: ['Restaurant', 'Industry', 'Contactless'],
    featured: false,
  },
  {
    id: 'qr-code-event-marketing',
    title: 'Event Marketing with QR Codes: Registration & Networking',
    excerpt: 'Boost event attendance and engagement with strategic QR code implementation for registration and networking.',
    date: '2023-12-28',
    author: 'TheQRCode.io Team',
    readTime: '4 min read',
    category: 'Events',
    tags: ['Events', 'Networking', 'Registration'],
    featured: false,
  },
  {
    id: 'qr-code-security-tips',
    title: 'QR Code Security: Protecting Your Business and Customers',
    excerpt: 'Essential security considerations when implementing QR codes in business applications.',
    date: '2023-12-25',
    author: 'TheQRCode.io Team',
    readTime: '6 min read',
    category: 'Security',
    tags: ['Security', 'Protection', 'Cybersecurity'],
    featured: false,
  },
]

const categories = ['All', 'Guide', 'Tutorial', 'Tools', 'Design', 'Marketing', 'Analytics', 'Industry', 'Events', 'Security']

// Get all unique tags from blog posts
const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)))

export default function BlogPage() {
  return (
    <>
      <BlogContent 
        blogPosts={blogPosts}
        categories={categories}
        allTags={allTags}
      />
      {/* Structured Data for Blog */}
      <StructuredData 
        type="WebSite" 
        data={{
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://theqrcode.io/blog?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "TheQRCode.io",
            "url": "https://theqrcode.io"
          }
        }} 
      />
    </>
  )
}
