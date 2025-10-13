'use client'

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'SoftwareApplication' | 'FAQPage'
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
