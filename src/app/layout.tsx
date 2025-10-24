import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import dynamic from 'next/dynamic'
import StructuredData from '@/components/StructuredData'
import Script from 'next/script'

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

export const metadata: Metadata = {
  title: {
    default: 'TheQRCode.io - Create & Track QR Codes with Advanced Analytics',
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
  description: 'Generate beautiful QR codes and track their performance with detailed analytics. Perfect for businesses, marketers, and developers. Free trial available. Dynamic QR codes for restaurants, real estate, events, and more.',
  keywords: [
    'QR code generator', 'QR code analytics', 'QR code tracking', 'QR code marketing', 
    'business QR codes', 'QR code API', 'free QR code generator', 'QR code maker',
    'restaurant QR code', 'real estate QR code', 'event QR code', 'WiFi QR code',
    'contact QR code', 'analytics QR code', 'dynamic QR code', 'static QR code'
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
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://theqrcode.io',
    siteName: 'TheQRCode.io',
    title: 'TheQRCode.io - Professional QR Code Generator with Advanced Analytics',
    description: 'Generate beautiful QR codes and track their performance with detailed analytics. Perfect for businesses, marketers, and developers. Free trial and API available.',
    images: [
      {
        url: 'https://theqrcode.io/og',
        width: 1200,
        height: 630,
        alt: 'TheQRCode.io - Professional QR Code Generator with Analytics Dashboard',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@theqrcode',
    creator: '@theqrcode',
    title: 'TheQRCode.io - Professional QR Code Generator with Analytics',
    description: 'Generate beautiful QR codes and track their performance with detailed analytics. Perfect for businesses, marketers, and developers.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL;
  const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;
  
  return (
    <html lang="en">
      <head>
        {/* Comprehensive favicon links for better Google Ads compatibility */}
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <meta name="msapplication-TileImage" content="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
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

        {/* Google Analytics */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=AW-584884144"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-584884144');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Providers>
          <ConditionalNavbar />
          <ConditionalMain>
            {children}
          </ConditionalMain>
        </Providers>
      </body>
    </html>
  )
}