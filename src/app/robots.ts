import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/api/',
        '/auth/',
        '/debug/',
        '/_next/',
        '/admin/',
        '/share/', // QR code sharing pages shouldn't be indexed
      ],
    },
    sitemap: 'https://theqrcode.io/sitemap.xml',
  }
}
