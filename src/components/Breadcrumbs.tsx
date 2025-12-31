'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import StructuredData from './StructuredData'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Always include home as first item
  const allItems = [
    { name: 'Home', url: '/' },
    ...items
  ]

  const breadcrumbSchema = {
    breadcrumbs: allItems.map((item, index) => ({
      name: item.name,
      url: `https://theqrcode.io${item.url}`
    }))
  }

  return (
    <>
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          
          return (
            <div key={item.url} className="flex items-center">
              {index === 0 ? (
                <Link 
                  href={item.url}
                  className="hover:text-gray-900 transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                  {isLast ? (
                    <span className="text-gray-900 font-medium" aria-current="page">
                      {item.name}
                    </span>
                  ) : (
                    <Link 
                      href={item.url}
                      className="hover:text-gray-900 transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </>
              )}
            </div>
          )
        })}
      </nav>
      
      <StructuredData type="BreadcrumbList" data={breadcrumbSchema} />
    </>
  )
}

