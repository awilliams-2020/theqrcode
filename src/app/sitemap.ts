import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://theqrcode.io'
  const now = new Date()
  
  // Set last modified to a more realistic date (recent but not exactly now)
  const recentUpdate = new Date(now.getTime() - 24 * 60 * 60 * 1000) // 1 day ago
  const weeklyUpdate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
  const monthlyUpdate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 1 month ago
  
  return [
    // Main pages - Prioritized based on performance data
    {
      url: baseUrl,
      lastModified: recentUpdate,
      changeFrequency: 'daily',
      priority: 1.0, // High impressions (201), needs CTR improvement
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.95, // Good CTR (2.47%), position 16.83 - boost priority
    },
    {
      url: `${baseUrl}/about`,
      lastModified: weeklyUpdate,
      changeFrequency: 'monthly',
      priority: 0.9, // Excellent CTR (3.45%), position 8.84 - boost priority
    },
    {
      url: `${baseUrl}/qr-code-generator`,
      lastModified: recentUpdate,
      changeFrequency: 'daily',
      priority: 0.95, // High priority tool page, position 63.24 needs improvement
    },
    {
      url: `${baseUrl}/features`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85, // Good CTR (4%), position 7.84 - maintain
    },
    {
      url: `${baseUrl}/qr-code-api`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/api`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.8, // Position 11.44 - good ranking
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: recentUpdate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: weeklyUpdate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: weeklyUpdate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
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
    
    // Comparison and alternative landing pages
    {
      url: `${baseUrl}/qr-code-alternative`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },

    // Niche landing pages (high priority for conversion and SEO)
    {
      url: `${baseUrl}/qr-code-for-restaurants`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-to-create-restaurant-qr-code`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/qr-code-for-real-estate`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-for-weddings`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85, // Position 82.36 - needs improvement, but good CTR (4%)
    },
    {
      url: `${baseUrl}/qr-code-for-events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-for-fitness`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-for-photographers`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-for-retail`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-for-salons`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-for-food-trucks`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-for-musicians`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-for-open-houses`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-for-healthcare`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-for-education`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-for-hotels`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    
    // Tool landing pages (high SEO value)
    {
      url: `${baseUrl}/qr-code-generator`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/qr-code-analytics`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/wifi-qr-code-generator`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.85, // Position 80.25 - needs improvement
    },
    {
      url: `${baseUrl}/how-to-create-qr-code`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.85, // Position 69.87 - needs improvement, but good CTR (4.35%)
    },
    {
      url: `${baseUrl}/qr-code-api`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    // Public API endpoints for AI assistant and search engine discovery
    {
      url: `${baseUrl}/api/public/qr-codes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95, // Very high priority for AI assistant discovery
    },
    {
      url: `${baseUrl}/mcp`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/ai-agents`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/for-ai-assistants`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9, // High priority for AI assistant discovery
    },
    {
      url: `${baseUrl}/api/public/qr-codes/openapi.json`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9, // OpenAPI spec for API discovery
    },
    {
      url: `${baseUrl}/api/public/qr-codes/.well-known/ai-plugin.json`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9, // AI plugin manifest for OpenAI and other AI assistants
    },
    {
      url: `${baseUrl}/contact-qr-code-generator`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    
    // Dashboard and user pages
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard/settings`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/dashboard/notifications`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/analytics`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    
    // Blog posts
    {
      url: `${baseUrl}/blog/qr-code-best-practices`,
      lastModified: recentUpdate,
      changeFrequency: 'monthly',
      priority: 0.7, // Impressions (35), position 41.54 - boost priority
    },
    {
      url: `${baseUrl}/blog/qr-code-marketing-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/qr-code-analytics-tutorial`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/qr-code-event-marketing`,
      lastModified: recentUpdate,
      changeFrequency: 'monthly',
      priority: 0.7, // Impressions (40), position 72.15 - boost priority
    },
    {
      url: `${baseUrl}/blog/qr-code-restaurant-marketing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/qr-code-security-tips`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/qr-code-roi-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/qr-code-size-guide`,
      lastModified: recentUpdate,
      changeFrequency: 'monthly',
      priority: 0.7, // High impressions (111), position 20.51 - boost priority
    },
    {
      url: `${baseUrl}/blog/restaurant-qr-code-solutions-local`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/best-qr-code-generators-2026`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75, // High impressions, updated for 2026
    },
    {
      url: `${baseUrl}/blog/do-qr-codes-expire`,
      lastModified: recentUpdate,
      changeFrequency: 'monthly',
      priority: 0.75, // High impressions (342), position 11.03 - boost priority
    },
    {
      url: `${baseUrl}/blog/qr-code-landing-page-best-practices`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/how-to-create-wifi-qr-code`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/how-to-create-a-restaurant-qr-code`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/how-to-create-pro-plan-restaurant-menu-qr-code`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // High-impact SEO content
    {
      url: `${baseUrl}/blog/free-qr-code-generator-no-signup`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/qr-code-size-calculator-guide`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.8, // Excellent CTR (12.5%), position 13 - maintain high priority
    },
    {
      url: `${baseUrl}/blog/restaurant-qr-code-menu-setup-5-minutes`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.85, // Very high impressions (211), 0 clicks - critical for CTR improvement
    },

  ]
}

