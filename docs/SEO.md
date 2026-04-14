# SEO

Single reference for SEO on TheQRCode.io: what’s in place, components, and strategy.

## Current setup

- Sitemap, robots.txt, page-level metadata, Open Graph
- JSON-LD structured data (FAQ, Article where used)
- Industry landing pages, blog structure
- Components: `Breadcrumbs.tsx`, `RelatedContent.tsx`, `BlogArticleSchema.tsx`
- Utilities: `lib/seo-utils.ts` (canonical URLs, OG images, metadata, reading time)

## Components

**Breadcrumbs** – Navigation + JSON-LD. Use on key pages.  
**RelatedContent** – Internal links; prop `items`: `{ title, url, description }[]`.  
**BlogArticleSchema** – Article/TechArticle for posts: title, description, datePublished, url, wordCount, timeRequired.

## Strategy (concise)

- **Content:** Long-form guides (2000+ words) for high-intent terms (e.g. “how to create qr code”, “qr code generator free”, “dynamic qr code”). FAQ schema on /faq and key pages. Comparison and “best of” pages where relevant.
- **Technical:** Breadcrumbs sitewide, Article schema on all blog posts, canonical URLs, internal linking from landing pages to blog/API/pricing.
- **Priorities (from Search Console):** Improve positions for brand (“qr code io”, “qr io”), “restaurant menu qr code”, “wedding qr code”, “qr-code analytics”, “qr code api”; add or optimize content for “qr code landing page best practices”, “best qr code generator for internal apps”.
- **Organic growth:** Content SEO, internal linking, comparison/long-tail pages, backlinks, schema and rich snippets. No dependency on social posts.

## Blog post updates

Use `BLOG_SEO_UPDATE_GUIDE.md` for adding new posts with correct metadata, schema, and related content.

## Automation

`SEARCH_CONSOLE_AUTOMATION.md` documents any Search Console automation or reporting.
