import type { Metadata } from 'next'
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
    default: 'TheQRCode.io - Create & Track QR Codes with Analytics',
    template: '%s | TheQRCode.io'
  },
  description: 'Generate beautiful QR codes and track their performance with detailed analytics. Perfect for businesses, marketers, and developers. Free trial available.',
  keywords: ['QR code generator', 'QR code analytics', 'QR code tracking', 'QR code marketing', 'business QR codes', 'QR code API'],
  authors: [{ name: 'TheQRCode.io Team' }],
  creator: 'TheQRCode.io',
  publisher: 'TheQRCode.io',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://theqrcode.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://theqrcode.io',
    siteName: 'TheQRCode.io',
    title: 'TheQRCode.io - Create & Track QR Codes with Analytics',
    description: 'Generate beautiful QR codes and track their performance with detailed analytics. Perfect for businesses, marketers, and developers.',
    images: [
      {
        url: 'https://theqrcode.io/og',
        width: 1200,
        height: 630,
        alt: 'TheQRCode.io - QR Code Generator with Analytics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheQRCode.io - Create & Track QR Codes with Analytics',
    description: 'Generate beautiful QR codes and track their performance with detailed analytics. Perfect for businesses, marketers, and developers.',
    images: ['https://theqrcode.io/og'],
    creator: '@theqrcode',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
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
        
        {/* Matomo Analytics */}
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
              strategy="afterInteractive"
            />
          </>
        )}
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