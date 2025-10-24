# Search Console Automation

This document describes the Google Search Console automation features available in the admin panel.

## Overview

The Search Console automation tab provides powerful SEO automation capabilities that integrate with Google Search Console to:

- Update sitemaps automatically
- Analyze popular search queries
- Generate keyword recommendations
- Provide performance insights

## Access

Navigate to the admin dashboard (`/admin`) and click on the "Search Console" tab in the navigation.

## Prerequisites

1. **Google OAuth Connection**: Users must be connected via Google OAuth with the `webmasters` scope
2. **Admin Access**: Only admin users can access the automation features
3. **Search Console Properties**: Users must have verified properties in Google Search Console

## Features

### 1. Site Selection
- Choose from your verified Google Search Console properties
- View permission levels for each site
- Refresh site list to get latest properties

### 2. Sitemap Updates
- Submit sitemaps to Google Search Console
- Track sitemap status and errors
- Monitor submission success

### 3. Query Analysis
- Fetch top 100 popular search queries
- Analyze click-through rates and positions
- Get performance metrics (total clicks, impressions, CTR)

### 4. Keyword Recommendations
- Compare current keywords with Search Console data
- Get suggestions for better-performing alternatives
- View competition analysis and potential click estimates

### 5. Full Automation
- **One-click automation** that runs all tasks
- Updates sitemap, analyzes queries, and provides recommendations
- Comprehensive results dashboard

## Usage

### Basic Workflow

1. **Select a Site**: Choose from your Google Search Console properties
2. **Configure Settings**:
   - Enter sitemap path (optional, e.g., `/sitemap.xml`)
   - Add current keywords (comma-separated)
3. **Run Automation**: Click "Run Full Automation" for complete analysis
4. **Review Results**: Use the tabbed interface to review:
   - Overview summary
   - Popular queries
   - Keyword recommendations
   - Performance metrics

### Individual Actions

You can also run individual automation tasks:

- **Update Sitemap**: Submit sitemap to Google
- **Analyze Queries**: Get popular search queries
- **Get Recommendations**: Generate keyword suggestions

## API Endpoints

### POST /api/admin/automation

**Actions:**
- `update_sitemap` - Submit sitemap to Google
- `analyze_queries` - Get popular search queries
- `get_recommendations` - Generate keyword suggestions
- `full_automation` - Run all tasks

**Request Body:**
```json
{
  "action": "full_automation",
  "siteUrl": "https://example.com",
  "sitemapPath": "/sitemap.xml",
  "currentKeywords": ["keyword1", "keyword2"]
}
```

### GET /api/admin/automation

Get available sites and connection status.

## Results Interpretation

### Popular Queries
- **Query**: The search term
- **Clicks**: Number of clicks from search results
- **Impressions**: Number of times shown in search results
- **CTR**: Click-through rate (clicks/impressions)
- **Position**: Average position in search results

### Keyword Recommendations
- **Current Keyword**: Your existing keyword
- **Suggested Keyword**: Better-performing alternative
- **Search Volume**: Estimated search volume
- **Competition**: Low/Medium/High competition level
- **Reason**: Why this keyword is recommended
- **Potential Clicks**: Estimated additional clicks

### Performance Metrics
- **Total Clicks**: Overall clicks from search
- **Total Impressions**: Total search impressions
- **Average CTR**: Overall click-through rate
- **Average Position**: Average search position
- **Top Pages**: Best-performing pages

## Security

- **Admin-only access**: Requires admin role
- **OAuth integration**: Uses Google OAuth tokens
- **Token validation**: Verifies Google access tokens
- **Rate limiting**: Respects Google API limits

## Troubleshooting

### Common Issues

1. **"Google account not connected"**
   - Ensure user has signed in with Google OAuth
   - Check that the webmasters scope is granted

2. **"Admin access required"**
   - Verify user has admin role in the system
   - Check user permissions in database

3. **"Failed to fetch sites"**
   - Verify Google Search Console properties are verified
   - Check Google OAuth token is valid and not expired

4. **"No sites available"**
   - Ensure user has verified properties in Google Search Console
   - Check that properties are properly configured

### Error Handling

The system provides detailed error messages for:
- Authentication failures
- Permission issues
- API rate limits
- Invalid site URLs
- Missing configuration

## Future Enhancements

- **Scheduled automation**: Run automation tasks on a schedule
- **Email reports**: Send automation results via email
- **Historical tracking**: Track performance over time
- **Custom recommendations**: AI-powered keyword suggestions
- **Competitor analysis**: Compare with competitor keywords
