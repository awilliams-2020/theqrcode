import { Metadata } from 'next'

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = 'https://theqrcode.io'
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Generate Open Graph image URL
 */
export function getOGImageUrl(slug?: string): string {
  const baseUrl = 'https://theqrcode.io'
  if (slug) {
    return `${baseUrl}/og-${slug}`
  }
  return `${baseUrl}/og`
}

/**
 * Generate article metadata
 */
export function generateArticleMetadata({
  title,
  description,
  slug,
  publishedTime,
  modifiedTime,
  author = 'TheQRCode.io Team',
  tags = [],
}: {
  title: string
  description: string
  slug: string
  publishedTime: string
  modifiedTime?: string
  author?: string
  tags?: string[]
}): Metadata {
  const url = getCanonicalUrl(`/blog/${slug}`)
  const image = getOGImageUrl(slug)

  return {
    title: `${title} | TheQRCode.io`,
    description,
    keywords: tags,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: [author],
      tags,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  }
}

/**
 * Generate page metadata with defaults
 */
export function generatePageMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
}: {
  title: string
  description: string
  path: string
  keywords?: string[]
  image?: string
}): Metadata {
  const url = getCanonicalUrl(path)
  const ogImage = image || getOGImageUrl()

  return {
    title: `${title} | TheQRCode.io`,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  }
}

/**
 * Calculate reading time from word count
 */
export function calculateReadingTime(wordCount: number): string {
  const wordsPerMinute = 200
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

/**
 * Generate breadcrumb items for a path
 */
export function generateBreadcrumbs(path: string): Array<{ name: string; url: string }> {
  const segments = path.split('/').filter(Boolean)
  const breadcrumbs: Array<{ name: string; url: string }> = []

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbs.push({
      name,
      url: currentPath,
    })
  })

  return breadcrumbs
}

/**
 * Get related content suggestions based on tags/category
 */
export function getRelatedContent(
  currentSlug: string,
  category?: string,
  tags?: string[]
): Array<{ title: string; url: string; description?: string }> {
  // This would typically come from a CMS or database
  // For now, return a static list based on category
  const relatedMap: Record<string, Array<{ title: string; url: string; description?: string }>> = {
    'qr-code-generator': [
      {
        title: 'How to Create a Restaurant QR Code',
        url: '/blog/how-to-create-a-restaurant-qr-code',
        description: 'Step-by-step guide to creating QR codes for restaurant menus.',
      },
      {
        title: 'QR Code Size Calculator Guide',
        url: '/blog/qr-code-size-calculator-guide',
        description: 'Learn how to calculate the perfect QR code size.',
      },
    ],
    'restaurant': [
      {
        title: 'Restaurant QR Code Menu Setup in 5 Minutes',
        url: '/blog/restaurant-qr-code-menu-setup-5-minutes',
        description: 'Quick guide to setting up QR code menus for restaurants.',
      },
      {
        title: 'QR Code for Restaurants',
        url: '/qr-code-for-restaurants',
        description: 'Complete guide to using QR codes in restaurants.',
      },
    ],
  }

  if (category && relatedMap[category]) {
    return relatedMap[category].filter(item => item.url !== currentSlug)
  }

  // Default related content
  return [
    {
      title: 'QR Code Generator',
      url: '/qr-code-generator',
      description: 'Create custom QR codes with advanced analytics.',
    },
    {
      title: 'Pricing',
      url: '/pricing',
      description: 'View our pricing plans and features.',
    },
  ]
}

