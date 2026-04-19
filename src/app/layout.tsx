import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import { Providers } from './providers'
import dynamic from 'next/dynamic'
import StructuredData from '@/components/StructuredData'
import Script from 'next/script'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Suspense } from 'react'
import { GclidCapture } from '@/components/GclidCapture'

// Import components dynamically to avoid SSR issues
const ConditionalNavbar = dynamic(() => import('@/components/ConditionalNavbar'), {
  ssr: true,
  loading: () => <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200" />
})

const ConditionalMain = dynamic(() => import('@/components/ConditionalMain'), {
  ssr: true,
  loading: () => <main className="pt-16 bg-white min-h-screen" />
})

const inter = Inter({ subsets: ['latin'] })

// Note: For dev subdomain blocking, we need to check hostname at runtime
// This will be handled in the RootLayout component below
export const metadata: Metadata = {
  title: {
    default: 'TheQRCode.io | QR Code API for Developers & AI Agents',
    template: '%s | TheQRCode.io'
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  description:
    'QR code API and MCP server for developers and AI agents — REST and OpenAPI, optional auth, MCP for Claude and Cursor. Generate and track QR codes with analytics, dynamic links, and dashboards. Public tier: try without an API key (rate limited). URL, WiFi, vCard, text, and email types.',
  keywords: [
    'qr code api',
    'qr code mcp',
    'mcp server qr code',
    'cursor qr code',
    'claude qr code',
    'free qr code api',
    'qr code rest api',
    'openapi qr code',
    'qr code generator',
    'dynamic qr code',
    'qr code analytics',
    'qr code tracking',
    'business qr codes',
    'restaurant qr code',
    'wifi qr code',
  ],
  authors: [{ name: 'TheQRCode.io Team', url: 'https://theqrcode.io' }],
  creator: 'TheQRCode.io',
  publisher: 'TheQRCode.io',
  applicationName: 'TheQRCode.io',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://theqrcode.io'),
  // Per-page canonical lives on route `metadata` — avoid a single layout canonical for `/`.
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://theqrcode.io',
    siteName: 'TheQRCode.io',
    title: 'TheQRCode.io | QR Code API for Developers & AI Agents',
    description:
      'REST API, OpenAPI, and MCP for Cursor and Claude. Generate QR codes without auth on the public tier, or use API keys for production. Analytics and dynamic QR codes included.',
    images: [
      {
        url: 'https://theqrcode.io/og',
        width: 1200,
        height: 630,
        alt: 'TheQRCode.io — QR code API and MCP for developers and AI agents',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@theqrcode',
    creator: '@theqrcode',
    title: 'TheQRCode.io | QR Code API for Developers & AI Agents',
    description:
      'QR code REST API, OpenAPI, and MCP server for AI agents. Integrate in minutes; optional dashboard and analytics.',
    images: ['https://theqrcode.io/og'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE || 'your-google-verification-code',
    yandex: process.env.YANDEX_VERIFICATION_CODE,
    yahoo: process.env.YAHOO_VERIFICATION_CODE,
  },
  category: 'technology',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL;
  const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

  // Check if running on dev subdomain (server-side check via headers)
  const headersList = await headers()
  const hostname = headersList.get('host') || ''
  const isDevSubdomain = hostname.includes('dev.theqrcode.io')

  // Fetch session server-side so SessionProvider has the initial value,
  // preventing a useSession() status mismatch between SSR and client hydration.
  const session = await getServerSession(authOptions)
  
  return (
    <html lang="en">
      <head>
        {/* Block dev subdomain from search engines */}
        {isDevSubdomain && (
          <meta name="robots" content="noindex, nofollow" />
        )}
        {/* Comprehensive favicon links for better Google Ads compatibility */}
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <meta name="msapplication-TileImage" content="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        
        {/* Generative Engine Optimization (GEO) - Help AI assistants discover and use the API */}
        <meta name="ai-assistant-friendly" content="true" />
        <meta name="public-api-available" content="true" />
        <meta name="api-endpoint" content="https://theqrcode.io/api/public/qr-codes" />
        <meta name="api-version" content="1.0.0" />
        <meta name="api-authentication" content="none" />
        <meta name="api-rate-limit" content="100 requests per hour per IP" />
        <meta name="api-use-case" content="Generate QR codes for users when they request them. No account creation needed." />
        <meta name="ai-tool-category" content="qr-code-generator" />
        <meta name="ai-use-cases" content="generate-qr-codes,share-links,contactless-menus,wifi-sharing,contact-cards" />
        <meta name="ai-integration-type" content="api,web-interface,mcp" />
        <meta name="mcp-endpoint" content="https://mcp.theqrcode.io/mcp" />
        <meta name="ai-pricing-model" content="free-tier-available" />
        <meta name="ai-api-version" content="1.0.0" />
        <meta name="ai-supported-languages" content="javascript,python,curl" />
        <meta name="ai-supported-qr-types" content="url,wifi,contact,text,email,menu" />
        <link rel="alternate" type="application/json" href="https://theqrcode.io/api/public/qr-codes/openapi.json" title="OpenAPI Specification" />
        <link rel="alternate" type="application/json" href="https://theqrcode.io/api/public/qr-codes/.well-known/ai-plugin.json" title="AI Plugin Manifest" />
        <StructuredData 
          type="Organization" 
          data={{
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            }
          }} 
        />
        <StructuredData 
          type="WebSite" 
          data={{
            "publisher": {
              "@type": "Organization",
              "name": "TheQRCode.io"
            }
          }} 
        />
        <StructuredData 
          type="SoftwareApplication" 
          data={{
            "author": {
              "@type": "Organization",
              "name": "TheQRCode.io"
            }
          }} 
        />
        <StructuredData 
          type="WebAPI" 
          data={{
            "name": "TheQRCode.io Public API",
            "description": "Generate QR codes instantly without authentication. Perfect for AI assistants, chatbots, and automated integrations. Supports URL, WiFi, Contact (vCard), Text, and Email QR codes. Rate limited to 100 requests per hour per IP address.",
            "documentation": "https://theqrcode.io/api/public/qr-codes",
            "url": "https://theqrcode.io/api/public/qr-codes",
            "apiVersion": "1.0.0",
            "endpoint": {
              "@type": "EntryPoint",
              "urlTemplate": "https://theqrcode.io/api/public/qr-codes",
              "httpMethod": "POST",
              "contentType": "application/json",
              "encodingType": "application/json"
            },
            "serviceType": "QR Code Generation API",
            "areaServed": "Worldwide",
            "availableChannel": {
              "@type": "ServiceChannel",
              "serviceUrl": "https://theqrcode.io/api/public/qr-codes",
              "serviceSmsNumber": null,
              "servicePhone": null
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "reviewCount": "1000+"
            }
          }} 
        />
        
        {/* Matomo Analytics - Only load in production */}
        {matomoUrl && matomoSiteId && (
          <>
            <Script id="matomo-init" strategy="beforeInteractive">
              {`
                var _paq = window._paq = window._paq || [];
                _paq.push(['setTrackerUrl', '${matomoUrl}/matomo.php']);
                _paq.push(['setSiteId', '${matomoSiteId}']);
                _paq.push(['enableLinkTracking']);
                _paq.push(['enableHeartBeatTimer']);
              `}
            </Script>
            <Script 
              id="matomo-tracker"
              src={`${matomoUrl}/matomo.js`}
              strategy="beforeInteractive"
            />
          </>
        )}

        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-4895240961864343" />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4895240961864343"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

      </head>
      <body className={inter.className}>
        <Providers session={session}>
          <Suspense fallback={null}>
            <GclidCapture />
          </Suspense>
          <ConditionalNavbar />
          <ConditionalMain>
            {children}
          </ConditionalMain>
        </Providers>
      </body>
    </html>
  )
}