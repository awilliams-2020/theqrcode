import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://theqrcode.io'
  const now = new Date()

  const recentUpdate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const weeklyUpdate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthlyUpdate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Single entry per URL. Omit routes blocked in robots.ts (e.g. /dashboard/, /auth/)
  // and private app pages — crawlers should not treat them as organic landing URLs.
  const entries: MetadataRoute.Sitemap = [
    // Homepage + developer positioning
    {
      url: baseUrl,
      lastModified: recentUpdate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/mcp`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/qr-code-api`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/ai-agents`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/for-ai-assistants`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/api`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/api/public/qr-codes/openapi.json`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/api/public/qr-codes/.well-known/ai-plugin.json`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // Conversion + trust
    {
      url: `${baseUrl}/pricing`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: weeklyUpdate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: weeklyUpdate,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: weeklyUpdate,
      changeFrequency: 'monthly',
      priority: 0.55,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: weeklyUpdate,
      changeFrequency: 'monthly',
      priority: 0.55,
    },
    {
      url: `${baseUrl}/qr-code-alternative`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },

    // Core tools (single listing each — no duplicate URLs)
    {
      url: `${baseUrl}/qr-code-generator`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-analytics`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/wifi-qr-code-generator`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-to-create-qr-code`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-qr-code-generator`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Vertical landings
    {
      url: `${baseUrl}/qr-code-for-restaurants`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/how-to-create-restaurant-qr-code`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/qr-code-for-real-estate`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/qr-code-for-weddings`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/qr-code-for-events`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/qr-code-for-fitness`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/qr-code-for-photographers`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/qr-code-for-retail`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/qr-code-for-salons`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/qr-code-for-food-trucks`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/qr-code-for-musicians`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/qr-code-for-open-houses`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/qr-code-for-healthcare`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/qr-code-for-education`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/qr-code-for-hotels`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },

    // Blog index + posts
    {
      url: `${baseUrl}/blog`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/qr-code-best-practices`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/blog/qr-code-marketing-guide`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/qr-code-analytics-tutorial`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/qr-code-event-marketing`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/blog/qr-code-restaurant-marketing`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/qr-code-security-tips`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/qr-code-roi-guide`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/qr-code-size-guide`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/blog/restaurant-qr-code-solutions-local`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/best-qr-code-generators-2026`,
      lastModified: recentUpdate,
      changeFrequency: 'monthly',
      priority: 0.72,
    },
    {
      url: `${baseUrl}/blog/do-qr-codes-expire`,
      lastModified: recentUpdate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/blog/qr-code-landing-page-best-practices`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/blog/how-to-create-wifi-qr-code`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/how-to-create-a-restaurant-qr-code`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/blog/how-to-create-pro-plan-restaurant-menu-qr-code`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/blog/free-qr-code-generator-no-signup`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/blog/qr-code-size-calculator-guide`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/blog/restaurant-qr-code-menu-setup-5-minutes`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.72,
    },

    // Legal
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: weeklyUpdate,
      changeFrequency: 'yearly',
      priority: 0.25,
    },
  ]

  return entries
}
