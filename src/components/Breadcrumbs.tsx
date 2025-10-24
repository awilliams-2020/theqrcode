import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  name: string
  url: string
  current?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`}
    >
      <Link 
        href="/" 
        className="flex items-center hover:text-blue-600 transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
          {item.current ? (
            <span 
              className="font-medium text-gray-900"
              aria-current="page"
            >
              {item.name}
            </span>
          ) : (
            <Link 
              href={item.url}
              className="hover:text-blue-600 transition-colors"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

// Helper function to generate breadcrumbs for different page types
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []
  
  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    
    // Convert segment to readable name
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbs.push({
      name,
      url: currentPath,
      current: isLast
    })
  })
  
  return breadcrumbs
}

// Predefined breadcrumbs for common pages
export const commonBreadcrumbs = {
  '/qr-code-generator': [
    { name: 'QR Code Generator', url: '/qr-code-generator', current: true }
  ],
  '/qr-code-analytics': [
    { name: 'QR Code Analytics', url: '/qr-code-analytics', current: true }
  ],
  '/pricing': [
    { name: 'Pricing', url: '/pricing', current: true }
  ],
  '/features': [
    { name: 'Features', url: '/features', current: true }
  ],
  '/blog': [
    { name: 'Blog', url: '/blog', current: true }
  ],
  '/faq': [
    { name: 'FAQ', url: '/faq', current: true }
  ],
  '/contact': [
    { name: 'Contact', url: '/contact', current: true }
  ],
  '/about': [
    { name: 'About', url: '/about', current: true }
  ],
  '/privacy': [
    { name: 'Privacy Policy', url: '/privacy', current: true }
  ],
  '/terms': [
    { name: 'Terms of Service', url: '/terms', current: true }
  ]
}
