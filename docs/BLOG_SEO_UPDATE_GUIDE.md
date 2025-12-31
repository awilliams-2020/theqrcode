# Blog SEO Update Guide

This document outlines the SEO improvements applied to blog posts.

## Updates Applied

### 1. **Imports Added**
```tsx
import Breadcrumbs from '@/components/Breadcrumbs'
import BlogArticleSchema from '@/components/BlogArticleSchema'
import RelatedContent from '@/components/RelatedContent'
```

### 2. **Metadata Enhanced**
- Added `alternates.canonical` URL
- Added `modifiedTime` to OpenGraph
- Added constants for `publishDate` and `articleUrl`

### 3. **BlogArticleSchema Component**
Added structured data for articles:
```tsx
<BlogArticleSchema
  title="Article Title"
  description="Article description"
  datePublished={publishDate}
  dateModified={publishDate}
  url={articleUrl}
  wordCount={1800}
  timeRequired="PT7M"
  proficiencyLevel="Beginner"
/>
```

### 4. **Breadcrumbs**
Replaced "Back to Blog" navigation with Breadcrumbs:
```tsx
<Breadcrumbs 
  items={[
    { name: 'Blog', url: '/blog' },
    { name: 'Article Title', url: articleUrl }
  ]}
  className="mb-6"
/>
```

### 5. **RelatedContent**
Added at the end of articles:
```tsx
<RelatedContent
  items={[
    {
      title: 'Related Article',
      url: '/blog/related-article',
      description: 'Article description'
    }
  ]}
  className="mt-12"
/>
```

### 6. **Wrapper Structure**
Changed from:
```tsx
<div className="min-h-screen bg-white">
  <article>...</article>
</div>
```

To:
```tsx
<>
  <BlogArticleSchema ... />
  <div className="min-h-screen bg-white">
    <article>
      <Breadcrumbs ... />
      ...
      <RelatedContent ... />
    </article>
  </div>
</>
```

## Blog Posts Updated

✅ **Completed:**
1. `best-qr-code-generators-2025`
2. `how-to-create-a-restaurant-qr-code`
3. `how-to-create-wifi-qr-code`
4. `free-qr-code-generator-no-signup`

⏳ **Remaining:**
- `qr-code-size-guide`
- `do-qr-codes-expire`
- `restaurant-qr-code-solutions-local`
- `qr-code-roi-guide`
- `qr-code-best-practices`
- `qr-code-marketing-guide`
- `qr-code-analytics-tutorial`
- `qr-code-restaurant-marketing`
- `qr-code-event-marketing`
- `qr-code-security-tips`
- `qr-code-size-calculator-guide`
- `restaurant-qr-code-menu-setup-5-minutes`

## Quick Update Checklist

For each blog post:
- [ ] Add imports (Breadcrumbs, BlogArticleSchema, RelatedContent)
- [ ] Add canonical URL to metadata
- [ ] Add modifiedTime to OpenGraph
- [ ] Add publishDate and articleUrl constants
- [ ] Add BlogArticleSchema component
- [ ] Replace navigation with Breadcrumbs
- [ ] Add RelatedContent at the end
- [ ] Update wrapper structure

## Benefits

- ✅ Better SEO with structured data
- ✅ Improved navigation with breadcrumbs
- ✅ Better internal linking with RelatedContent
- ✅ Canonical URLs prevent duplicate content issues
- ✅ Rich snippets potential in search results

