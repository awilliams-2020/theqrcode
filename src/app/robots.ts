import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Default allow all - only disallow specific paths
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/',
          '/debug/',
          '/_next/',
          '/share/',
          '/r/', // QR code redirects
          '/display/', // QR code display pages
          '/analytics/', // User analytics (private)
          '/google-oauth/',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        // Default allow all - only disallow specific paths
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/',
          '/debug/',
          '/_next/',
          '/share/',
          '/r/',
          '/display/',
          '/analytics/',
          '/google-oauth/',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        // Default allow all - only disallow specific paths
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/',
          '/debug/',
          '/_next/',
          '/share/',
          '/r/',
          '/display/',
          '/analytics/',
          '/google-oauth/',
        ],
        crawlDelay: 1,
      }
    ],
    sitemap: 'https://theqrcode.io/sitemap.xml',
    host: 'https://theqrcode.io',
  }
}
