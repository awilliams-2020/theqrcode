'use client'

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'SoftwareApplication' | 'FAQPage' | 'BreadcrumbList' | 'Product' | 'Service' | 'Article' | 'HowTo'
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TheQRCode.io",
          "url": "https://theqrcode.io",
          "logo": "https://theqrcode.io/logo.png",
          "description": "Professional QR code generator with advanced analytics and tracking capabilities.",
          "foundingDate": "2024",
          "sameAs": [
            "https://twitter.com/theqrcode",
            "https://linkedin.com/company/theqrcode"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "support@theqrcode.io"
          },
          ...data
        }
      
      case 'WebSite':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "TheQRCode.io",
          "url": "https://theqrcode.io",
          "description": "Generate beautiful QR codes and track their performance with detailed analytics.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://theqrcode.io/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          ...data
        }
      
      case 'SoftwareApplication':
        return {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "TheQRCode.io",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "description": "Professional QR code generator with advanced analytics and tracking capabilities.",
          "url": "https://theqrcode.io",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150"
          },
          ...data
        }
      
      case 'FAQPage':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.faqs.map((faq: any) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }
      
      case 'BreadcrumbList':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.breadcrumbs.map((crumb: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.url
          }))
        }
      
      case 'Product':
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.name || "QR Code Generator",
          "description": data.description || "Professional QR code generator with advanced analytics",
          "url": data.url || "https://theqrcode.io",
          "image": data.image || "https://theqrcode.io/og",
          "brand": {
            "@type": "Brand",
            "name": "TheQRCode.io"
          },
          "offers": {
            "@type": "Offer",
            "price": data.price || "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": data.url || "https://theqrcode.io"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150"
          },
          ...data
        }
      
      case 'Service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": data.name || "QR Code Generation Service",
          "description": data.description || "Professional QR code generation and analytics service",
          "provider": {
            "@type": "Organization",
            "name": "TheQRCode.io",
            "url": "https://theqrcode.io"
          },
          "serviceType": "QR Code Generation",
          "areaServed": "Worldwide",
          "availableChannel": {
            "@type": "ServiceChannel",
            "serviceUrl": "https://theqrcode.io",
            "serviceSmsNumber": "+1-555-0123",
            "servicePhone": "+1-555-0123"
          },
          ...data
        }
      
      case 'HowTo':
        return {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": data.name || "How to Create QR Codes",
          "description": data.description || "Learn how to create professional QR codes with analytics",
          "image": data.image || "https://theqrcode.io/og",
          "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": "0"
          },
          "totalTime": "PT2M",
          "step": data.steps?.map((step: any, index: number) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.name,
            "text": step.text,
            "url": step.url,
            "image": step.image
          })) || [],
          ...data
        }
      
      default:
        return data
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData(), null, 2)
      }}
    />
  )
}
