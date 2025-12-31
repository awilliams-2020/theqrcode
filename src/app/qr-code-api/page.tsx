import { Metadata } from 'next'
import APILanding from '@/components/landing/APILanding'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'QR Code API | Programmatic QR Code Generation & Analytics - TheQRCode.io',
  description: 'Powerful QR Code API for developers. Generate QR codes programmatically, track analytics, manage webhooks. RESTful API with comprehensive documentation. Start free!',
  keywords: 'qr code api, qr code generation api, qr api, qr code rest api, developer qr code, programmatic qr code, webhook api, real-time notifications',
  openGraph: {
    title: 'QR Code API for Developers | TheQRCode.io',
    description: 'Powerful REST API for generating and managing QR codes programmatically with real-time webhook notifications',
    type: 'website',
  },
}

export default function APILandingPage() {
  return (
    <>
      <StructuredData 
        type="FAQPage" 
        data={{
          faqs: [
            {
              question: "What is the QR Code API?",
              answer: "TheQRCode.io API is a RESTful API that allows developers to programmatically generate, manage, and track QR codes. It provides endpoints for creating QR codes, retrieving analytics, managing webhooks, and performing bulk operations."
            },
            {
              question: "How do I get API access?",
              answer: "API access is included with our Pro plan ($29/month) and Business plan ($99/month). After subscribing, you can generate API keys from your dashboard and start making API calls immediately."
            },
            {
              question: "What programming languages are supported?",
              answer: "Our REST API works with any programming language that can make HTTP requests. We provide code examples in JavaScript, Python, PHP, Ruby, and cURL. The API uses standard JSON for requests and responses."
            },
            {
              question: "Is there rate limiting on the API?",
              answer: "Yes, API rate limits vary by plan. Pro plan includes 1,000 requests per hour, while Business plan includes 10,000 requests per hour. Rate limit headers are included in all API responses."
            },
            {
              question: "Can I track QR code scans via API?",
              answer: "Yes! The API provides endpoints to retrieve analytics data including scan counts, locations, device types, and timestamps. You can also set up webhooks to receive real-time notifications when QR codes are scanned."
            },
            {
              question: "Is there API documentation?",
              answer: "Yes, comprehensive API documentation is available with code examples, endpoint descriptions, authentication details, and webhook setup instructions. Documentation is accessible from your dashboard after subscribing to a Pro or Business plan."
            }
          ]
        }} 
      />
      <APILanding />
    </>
  )
}

