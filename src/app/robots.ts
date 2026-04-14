import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Default allow all - only disallow specific paths
        // Note: dev.theqrcode.io subdomain should be blocked via its own robots.txt or noindex meta tags
        disallow: [
          '/dashboard/',
          '/api/auth/',
          '/api/cron/',
          '/api/user/',
          '/api/stripe/',
          '/api/v1/', // Authenticated API endpoints
          '/auth/',
          '/debug/',
          '/_next/',
          '/share/',
          '/r/', // QR code redirects
          '/display/', // QR code display pages
          '/analytics/', // User analytics (private)
          '/google-oauth/',
        ],
        // Allow public API discovery for search engines and AI assistants
        allow: [
          '/api/public/',
          '/api/public/qr-codes',
          '/api/public/qr-codes/openapi.json',
          '/api/public/qr-codes/.well-known/',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        // Default allow all - only disallow specific paths
        disallow: [
          '/dashboard/',
          '/api/auth/',
          '/api/cron/',
          '/api/user/',
          '/api/stripe/',
          '/api/v1/',
          '/auth/',
          '/debug/',
          '/_next/',
          '/share/',
          '/r/',
          '/display/',
          '/analytics/',
          '/google-oauth/',
        ],
        allow: [
          '/api/public/',
          '/api/public/qr-codes',
          '/api/public/qr-codes/openapi.json',
          '/api/public/qr-codes/.well-known/',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        // Default allow all - only disallow specific paths
        disallow: [
          '/dashboard/',
          '/api/auth/',
          '/api/cron/',
          '/api/user/',
          '/api/stripe/',
          '/api/v1/',
          '/auth/',
          '/debug/',
          '/_next/',
          '/share/',
          '/r/',
          '/display/',
          '/analytics/',
          '/google-oauth/',
        ],
        allow: [
          '/api/public/',
          '/api/public/qr-codes',
          '/api/public/qr-codes/openapi.json',
          '/api/public/qr-codes/.well-known/',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'GPTBot',
        // Allow OpenAI GPTBot to discover the public API
        disallow: [
          '/dashboard/',
          '/api/auth/',
          '/api/cron/',
          '/api/user/',
          '/api/stripe/',
          '/api/v1/',
          '/auth/',
          '/debug/',
          '/_next/',
          '/share/',
          '/r/',
          '/display/',
          '/analytics/',
          '/google-oauth/',
        ],
        allow: [
          '/api/public/',
          '/api/public/qr-codes',
          '/api/public/qr-codes/openapi.json',
          '/api/public/qr-codes/.well-known/',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'ChatGPT-User',
        // Allow ChatGPT to discover the public API
        disallow: [
          '/dashboard/',
          '/api/auth/',
          '/api/cron/',
          '/api/user/',
          '/api/stripe/',
          '/api/v1/',
          '/auth/',
          '/debug/',
          '/_next/',
          '/share/',
          '/r/',
          '/display/',
          '/analytics/',
          '/google-oauth/',
        ],
        allow: [
          '/api/public/',
          '/api/public/qr-codes',
          '/api/public/qr-codes/openapi.json',
          '/api/public/qr-codes/.well-known/',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'CCBot',
        // Allow Common Crawl Bot to discover the public API
        disallow: [
          '/dashboard/',
          '/api/auth/',
          '/api/cron/',
          '/api/user/',
          '/api/stripe/',
          '/api/v1/',
          '/auth/',
          '/debug/',
          '/_next/',
          '/share/',
          '/r/',
          '/display/',
          '/analytics/',
          '/google-oauth/',
        ],
        allow: [
          '/api/public/',
          '/api/public/qr-codes',
          '/api/public/qr-codes/openapi.json',
          '/api/public/qr-codes/.well-known/',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'anthropic-ai',
        // Allow Anthropic AI to discover the public API
        disallow: [
          '/dashboard/',
          '/api/auth/',
          '/api/cron/',
          '/api/user/',
          '/api/stripe/',
          '/api/v1/',
          '/auth/',
          '/debug/',
          '/_next/',
          '/share/',
          '/r/',
          '/display/',
          '/analytics/',
          '/google-oauth/',
        ],
        allow: [
          '/api/public/',
          '/api/public/qr-codes',
          '/api/public/qr-codes/openapi.json',
          '/api/public/qr-codes/.well-known/',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Claude-Web',
        // Allow Claude Web to discover the public API
        disallow: [
          '/dashboard/',
          '/api/auth/',
          '/api/cron/',
          '/api/user/',
          '/api/stripe/',
          '/api/v1/',
          '/auth/',
          '/debug/',
          '/_next/',
          '/share/',
          '/r/',
          '/display/',
          '/analytics/',
          '/google-oauth/',
        ],
        allow: [
          '/api/public/',
          '/api/public/qr-codes',
          '/api/public/qr-codes/openapi.json',
          '/api/public/qr-codes/.well-known/',
        ],
        crawlDelay: 0,
      }
    ],
    sitemap: 'https://theqrcode.io/sitemap.xml',
    host: 'https://theqrcode.io',
  }
}
