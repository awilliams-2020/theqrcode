'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface RelatedItem {
  title: string
  url: string
  description: string
}

interface RelatedContentProps {
  title?: string
  items: RelatedItem[]
  className?: string
}

export default function RelatedContent({ 
  title = "Related Pages", 
  items, 
  className = '' 
}: RelatedContentProps) {
  if (!items || items.length === 0) return null

  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {item.description}
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                Learn more
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
