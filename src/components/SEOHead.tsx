import { Metadata } from 'next'
import StructuredData from './StructuredData'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: string
  structuredData?: {
    type: string
    data: any
  }[]
  noindex?: boolean
  breadcrumbs?: Array<{ name: string; url: string }>
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = 'https://theqrcode.io/og',
  ogType = 'website',
  structuredData = [],
  noindex = false,
  breadcrumbs = []
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | TheQRCode.io` : 'TheQRCode.io - Professional QR Code Generator with Analytics'
  const fullDescription = description || 'Generate beautiful QR codes and track their performance with detailed analytics. Perfect for businesses, marketers, and developers. Free trial available.'
  const fullKeywords = [
    'QR code generator',
    'QR code analytics',
    'QR code tracking',
    'QR code marketing',
    'business QR codes',
    'free QR code generator',
    ...keywords
  ].join(', ')

  return (
    <>
      {/* Enhanced Meta Tags */}
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content="TheQRCode.io Team" />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="googlebot" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="bingbot" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical || 'https://theqrcode.io'} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="TheQRCode.io" />
      <meta property="og:locale" content="en_US" />
      
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Mobile Optimization */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="TheQRCode.io" />
      
      {/* Structured Data */}
      {breadcrumbs.length > 0 && (
        <StructuredData
          type="BreadcrumbList"
          data={{ breadcrumbs }}
        />
      )}
      
      {structuredData.map((item, index) => (
        <StructuredData
          key={index}
          type={item.type as any}
          data={item.data}
        />
      ))}
      
      {/* Default structured data for all pages */}
      <StructuredData
        type="Organization"
        data={{
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "US"
          }
        }}
      />
    </>
  )
}

// Helper function to generate metadata for pages
export function generatePageMetadata({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  ogType = 'website',
  noindex = false
}: SEOHeadProps): Metadata {
  const fullTitle = title ? `${title} | TheQRCode.io` : 'TheQRCode.io - Professional QR Code Generator with Analytics'
  const fullDescription = description || 'Generate beautiful QR codes and track their performance with detailed analytics. Perfect for businesses, marketers, and developers. Free trial available.'

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: [
      'QR code generator',
      'QR code analytics',
      'QR code tracking',
      'QR code marketing',
      'business QR codes',
      'free QR code generator',
      ...keywords
    ],
    robots: noindex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      type: ogType as 'website' | 'article' | 'profile',
      url: canonical || 'https://theqrcode.io',
      images: [
        {
          url: ogImage || 'https://theqrcode.io/og',
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      siteName: 'TheQRCode.io',
    },
    alternates: {
      canonical: canonical || 'https://theqrcode.io',
    },
  }
}
