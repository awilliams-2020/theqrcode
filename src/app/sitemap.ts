import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://theqrcode.io'
  const now = new Date()
  
  // Set last modified to a more realistic date (recent but not exactly now)
  const recentUpdate = new Date(now.getTime() - 24 * 60 * 60 * 1000) // 1 day ago
  const weeklyUpdate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
  const monthlyUpdate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 1 month ago
  
  return [
    // Main pages
    {
      url: baseUrl,
      lastModified: recentUpdate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/qr-code-generator`,
      lastModified: recentUpdate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/qr-code-api`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
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
      url: `${baseUrl}/about`,
      lastModified: weeklyUpdate,
      changeFrequency: 'monthly',
      priority: 0.5,
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
    
    // Niche landing pages (high priority for conversion and SEO)
    {
      url: `${baseUrl}/qr-code-for-restaurants`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
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
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-api`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
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
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
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
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
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
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/restaurant-qr-code-solutions-local`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/best-qr-code-generators-2025`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/do-qr-codes-expire`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/how-to-create-wifi-qr-code`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
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
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/restaurant-qr-code-menu-setup-5-minutes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    
    // Additional high-value blog posts
    {
      url: `${baseUrl}/blog/qr-code-marketing-strategies-2025`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/qr-code-vs-barcode-differences`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/qr-code-design-best-practices`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/qr-code-security-best-practices`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/qr-code-tracking-analytics-guide`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/qr-code-api-integration-tutorial`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/qr-code-print-sizes-guide`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/qr-code-mobile-optimization`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    
    // High-value tool pages
    {
      url: `${baseUrl}/qr-code-size-calculator`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-readability-checker`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/qr-code-roi-calculator`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/qr-code-compliance-checker`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    
    // Industry-specific landing pages (no local variations)
    {
      url: `${baseUrl}/restaurant-qr-code-solutions`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/real-estate-qr-code-marketing`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/retail-qr-code-strategies`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/healthcare-qr-code-solutions`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/education-qr-code-tools`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]
}

