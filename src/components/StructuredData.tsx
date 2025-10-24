'use client'

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'SoftwareApplication' | 'FAQPage' | 'BreadcrumbList' | 'Product' | 'Service' | 'Article' | 'HowTo' | 'TechArticle' | 'Course'
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
          "screenshot": "https://theqrcode.io/og",
          "dateModified": new Date().toISOString().split('T')[0],
          "author": {
            "@type": "Organization",
            "name": "TheQRCode.io"
          },
          "offers": [
            {
              "@type": "Offer",
              "name": "Free Plan",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "description": "Free QR code generation with basic analytics"
            },
            {
              "@type": "Offer",
              "name": "Pro Plan",
              "price": "9",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "description": "Advanced analytics and unlimited QR codes"
            }
          ],
          "featureList": [
            "QR Code Generation",
            "Analytics Tracking",
            "Custom Branding",
            "API Access",
            "Bulk Generation"
          ],
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
      
      case 'TechArticle':
        return {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": data.headline || "QR Code Generation Guide",
          "description": data.description || "Complete guide to QR code generation and analytics",
          "author": {
            "@type": "Person",
            "name": data.author || "TheQRCode.io Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "TheQRCode.io",
            "logo": {
              "@type": "ImageObject",
              "url": "https://theqrcode.io/logo.png"
            }
          },
          "datePublished": data.datePublished || new Date().toISOString(),
          "dateModified": data.dateModified || new Date().toISOString(),
          "image": data.image || "https://theqrcode.io/og",
          "url": data.url || "https://theqrcode.io",
          "wordCount": data.wordCount || 1000,
          "timeRequired": data.timeRequired || "PT5M",
          "proficiencyLevel": data.proficiencyLevel || "Beginner",
          ...data
        }
      
      case 'Course':
        return {
          "@context": "https://schema.org",
          "@type": "Course",
          "name": data.name || "QR Code Marketing Masterclass",
          "description": data.description || "Learn how to use QR codes effectively for business marketing",
          "provider": {
            "@type": "Organization",
            "name": "TheQRCode.io",
            "url": "https://theqrcode.io"
          },
          "courseMode": "online",
          "educationalLevel": "beginner",
          "timeRequired": "PT2H",
          "coursePrerequisites": "Basic computer skills",
          "syllabusSections": data.syllabus || [
            {
              "@type": "Syllabus",
              "name": "Introduction to QR Codes",
              "description": "Understanding QR code basics"
            }
          ],
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
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
