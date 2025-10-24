import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: string
  noindex?: boolean
  structuredData?: any[]
  breadcrumbs?: Array<{ name: string; url: string }>
}

// High-value keywords for QR code platform
export const PRIMARY_KEYWORDS = [
  'QR code generator',
  'QR code analytics',
  'QR code tracking',
  'QR code marketing',
  'business QR codes',
  'free QR code generator',
  'QR code maker',
  'QR code API',
  'dynamic QR code',
  'QR code for business'
]

export const LONG_TAIL_KEYWORDS = [
  'free QR code generator no signup',
  'QR code size calculator',
  'restaurant QR code menu',
  'QR code for business cards',
  'QR code for real estate',
  'QR code for restaurants',
  'QR code for events',
  'QR code for retail',
  'QR code for salons',
  'QR code for photographers',
  'QR code for fitness',
  'QR code for healthcare',
  'QR code for education',
  'QR code for hotels',
  'QR code for food trucks',
  'QR code for musicians',
  'QR code for open houses',
  'QR code for weddings'
]

export const LOCAL_KEYWORDS = [
  'QR code services near me',
  'QR code generator [city]',
  'QR code marketing [city]',
  'QR code services [city]',
  'restaurant QR codes [city]',
  'real estate QR codes [city]',
  'retail QR codes [city]'
]

// Generate comprehensive metadata for pages
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage = 'https://theqrcode.io/og',
    ogType = 'website',
    noindex = false
  } = config

  const fullTitle = title.includes('TheQRCode.io') ? title : `${title} | TheQRCode.io`
  const fullDescription = description || 'Generate beautiful QR codes and track their performance with detailed analytics. Perfect for businesses, marketers, and developers. Free trial available.'
  const allKeywords = [...PRIMARY_KEYWORDS, ...keywords]

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    robots: noindex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      type: ogType as 'website' | 'article',
      url: canonical || 'https://theqrcode.io',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      siteName: 'TheQRCode.io',
      locale: 'en_US',
    },
    alternates: {
      canonical: canonical || 'https://theqrcode.io',
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION_CODE,
    },
    category: 'technology',
  }
}

// Generate structured data for different page types
export function generateStructuredData(type: string, data: any) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  }

  return baseStructuredData
}

// Generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `https://theqrcode.io${crumb.url}`
    }))
  }
}

// Generate online service structured data
export function generateOnlineServiceStructuredData(service: {
  name: string
  description: string
  provider: string
  serviceType: string
  url: string
  features: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider,
      url: 'https://theqrcode.io'
    },
    serviceType: service.serviceType,
    areaServed: 'Worldwide',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: service.url,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'QR Code Services',
      itemListElement: service.features.map(feature => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: feature,
          description: `Professional ${feature} service`
        }
      }))
    }
  }
}

// Generate article structured data for blog posts
export function generateArticleStructuredData(article: {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified: string
  image: string
  url: string
  wordCount: number
  readingTime: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'TheQRCode.io',
      logo: {
        '@type': 'ImageObject',
        url: 'https://theqrcode.io/logo.png'
      }
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    image: article.image,
    url: article.url,
    wordCount: article.wordCount,
    timeRequired: `PT${article.readingTime}M`,
    proficiencyLevel: 'Beginner',
    about: {
      '@type': 'Thing',
      name: 'QR Code Technology'
    }
  }
}

// Generate product structured data for QR code tools
export function generateProductStructuredData(product: {
  name: string
  description: string
  price: string
  currency: string
  availability: string
  image: string
  url: string
  features: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    description: product.description,
    url: product.url,
    image: product.image,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: product.availability,
      url: product.url
    },
    featureList: product.features,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1'
    }
  }
}

// Generate service structured data
export function generateServiceStructuredData(service: {
  name: string
  description: string
  provider: string
  areaServed: string
  serviceType: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider,
      url: 'https://theqrcode.io'
    },
    serviceType: service.serviceType,
    areaServed: service.areaServed,
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: service.url
    }
  }
}

// Generate how-to structured data for tutorials
export function generateHowToStructuredData(howTo: {
  name: string
  description: string
  steps: Array<{
    name: string
    text: string
    image?: string
  }>
  totalTime: string
  estimatedCost: string
  image: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    image: howTo.image,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: howTo.estimatedCost
    },
    totalTime: howTo.totalTime,
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image
    }))
  }
}

// Generate course structured data for educational content
export function generateCourseStructuredData(course: {
  name: string
  description: string
  provider: string
  courseMode: string
  educationalLevel: string
  timeRequired: string
  prerequisites: string
  price: string
  currency: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider,
      url: 'https://theqrcode.io'
    },
    courseMode: course.courseMode,
    educationalLevel: course.educationalLevel,
    timeRequired: course.timeRequired,
    coursePrerequisites: course.prerequisites,
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: course.currency,
      availability: 'https://schema.org/InStock'
    }
  }
}

// Utility function to generate meta tags for different page types
export const pageTypes = {
  home: {
    title: 'TheQRCode.io - Professional QR Code Generator with Analytics',
    description: 'Generate beautiful QR codes and track their performance with detailed analytics. Perfect for businesses, marketers, and developers. Free trial available.',
    keywords: [...PRIMARY_KEYWORDS, 'QR code generator free', 'QR code analytics free']
  },
  generator: {
    title: 'Free QR Code Generator - Create & Track QR Codes',
    description: 'Create beautiful QR codes for free with our advanced generator. Track scans, customize design, and get detailed analytics. No signup required.',
    keywords: [...PRIMARY_KEYWORDS, 'free QR code generator', 'QR code maker free', 'create QR code online']
  },
  analytics: {
    title: 'QR Code Analytics - Track QR Code Performance',
    description: 'Advanced QR code analytics and tracking. Monitor scans, locations, devices, and get insights to optimize your QR code campaigns.',
    keywords: [...PRIMARY_KEYWORDS, 'QR code tracking', 'QR code analytics', 'QR code insights', 'QR code performance']
  },
  pricing: {
    title: 'QR Code Generator Pricing - Free & Premium Plans',
    description: 'Choose the perfect plan for your QR code needs. Free plan available with basic analytics. Premium plans for advanced features and unlimited QR codes.',
    keywords: [...PRIMARY_KEYWORDS, 'QR code pricing', 'QR code plans', 'QR code subscription', 'QR code cost']
  },
  blog: {
    title: 'QR Code Blog - Tips, Tutorials & Best Practices',
    description: 'Learn everything about QR codes with our comprehensive blog. Tips, tutorials, best practices, and industry insights for QR code marketing.',
    keywords: [...PRIMARY_KEYWORDS, 'QR code blog', 'QR code tips', 'QR code tutorials', 'QR code best practices']
  }
}

// Generate SEO-friendly URLs
export function generateSEOUrl(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Generate meta descriptions with optimal length
export function generateMetaDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text
  
  const truncated = text.substring(0, maxLength - 3)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
}

// Generate title tags with optimal length
export function generateTitleTag(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) return title
  
  const truncated = title.substring(0, maxLength - 3)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
}
