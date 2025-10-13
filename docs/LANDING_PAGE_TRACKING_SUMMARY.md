# Landing Page Tracking - Implementation Summary

## ✅ What Was Implemented

### 1. Configuration Updates

**File: `/src/lib/matomo-config.ts`**

Added new custom dimensions:
- **Dimension 14**: `LANDING_PAGE` - Tracks which landing page the user is on
- **Dimension 15**: `CTA_LOCATION` - Tracks where on the page the CTA was clicked

Added new goals:
- **Goal 40**: `LANDING_PAGE_SIGNUP` - Signup from landing page
- **Goal 41**: `LANDING_PAGE_TRIAL` - Started trial from landing page  
- **Goal 42**: `LANDING_PAGE_DEMO` - Viewed demo from landing page

Added new event categories and actions:
- Category: `LANDING_PAGE` and `CTA`
- Actions: `VIEW_LANDING`, `CLICK_CTA_HERO`, `CLICK_CTA_PRICING`, `CLICK_CTA_FOOTER`, `CLICK_DEMO`, `VIEW_PRICING`

### 2. Tracking Functions

**File: `/src/lib/matomo-tracking.ts`**

Added `trackLandingPage` object with methods:
- `view(pageName, planShown?)` - Track landing page views
- `clickCTA(ctaText, pageName, location, planSelected?)` - Track CTA clicks
- `clickDemo(pageName)` - Track demo button clicks
- `viewPricing(pageName)` - Track pricing section views

### 3. React Hook

**File: `/src/hooks/useLandingPageTracking.ts`**

Created hook that:
- Automatically tracks page view on mount
- Provides `trackCTA()`, `trackDemo()`, and `trackPricingView()` functions
- Simplifies tracking implementation in components

### 4. Landing Pages Updated

✅ **Main Landing Page** (`/src/components/LandingPage.tsx`)
- Added tracking for hero CTA (Start Free Trial - Pro plan)
- Added tracking for demo button
- Added tracking for pricing card CTAs (Free, Starter, Pro plans)

✅ **Restaurant Landing** (`/src/components/landing/RestaurantLanding.tsx`)
- Added tracking for hero CTA (Create Menu QR Code - Starter plan)
- Added tracking for demo button

✅ **Pricing Page** (`/src/components/PricingPage.tsx`)
- Added tracking for page views
- Added tracking for all plan subscription buttons
- Tracks plan name and ID with each click

### 5. Documentation

**File: `/docs/LANDING_PAGE_TRACKING_TEMPLATE.md`**

Created comprehensive guide with:
- Step-by-step instructions for adding tracking
- Code examples for all scenarios
- Standardized landing page names
- Checklist of remaining pages to update

## 📊 What Gets Tracked

### Page Views
Every time a landing page loads:
```javascript
{
  category: 'Landing Page',
  action: 'view_landing',
  name: 'restaurants',  // or 'home', 'retail', etc.
  customDimensions: {
    LANDING_PAGE: 'restaurants',
    PAYMENT_PLAN: 'starter'  // if plan shown
  }
}
```

### CTA Clicks
When users click call-to-action buttons:
```javascript
{
  category: 'CTA',
  action: 'click_cta_hero',  // or click_cta_pricing, click_cta_footer
  name: 'Start Free Trial - home',
  customDimensions: {
    LANDING_PAGE: 'home',
    CTA_LOCATION: 'hero',
    PAYMENT_PLAN: 'pro'
  }
}
```

### Demo Clicks
When users click "View Demo" buttons:
```javascript
{
  category: 'Landing Page',
  action: 'click_demo',
  name: 'restaurants',
  customDimensions: {
    LANDING_PAGE: 'restaurants'
  }
}
+ Goal: LANDING_PAGE_DEMO triggered
```

### Trial/Signup Goals
When users click trial CTAs:
```javascript
Goal: LANDING_PAGE_TRIAL
customDimensions: {
  LANDING_PAGE: 'restaurants',
  PAYMENT_PLAN: 'starter'
}
```

## 🎯 Analytics Insights

With this tracking, you can now analyze:

### Conversion Funnels
- Landing page views → CTA clicks → Signups
- Which landing pages convert best
- Which CTAs perform best (hero vs pricing vs footer)

### Plan Preferences
- Which plans users select from each landing page
- Correlation between landing page and plan choice
- Upgrade patterns from different entry points

### A/B Testing Support
- Compare performance of different landing pages
- Test CTA placement effectiveness
- Optimize messaging and offers

### Attribution
- Track which landing pages drive the most signups
- Identify high-value landing pages
- Optimize marketing spend by landing page performance

## 📈 Matomo Configuration Needed

Before this tracking works, configure in Matomo Dashboard:

### 1. Add Custom Dimensions

Go to **Settings > Custom Dimensions**:

| ID | Name | Scope | Type |
|----|------|-------|------|
| 14 | Landing Page | Action | Text |
| 15 | CTA Location | Action | Text |

### 2. Add Goals

Go to **Settings > Goals**:

| ID | Name | Type | Description |
|----|------|------|-------------|
| 40 | Landing Page Signup | Manual | User signed up from landing page |
| 41 | Landing Page Trial | Manual | User started trial from landing page |
| 42 | Landing Page Demo | Manual | User viewed demo from landing page |

## 🔄 Remaining Landing Pages

These landing pages still need tracking added (use the template):

- [ ] `/src/components/landing/RetailLanding.tsx`
- [ ] `/src/components/landing/FitnessLanding.tsx`
- [ ] `/src/components/landing/WeddingLanding.tsx`
- [ ] `/src/components/landing/RealEstateLanding.tsx`
- [ ] `/src/components/landing/PhotographerLanding.tsx`
- [ ] `/src/components/landing/MusicianLanding.tsx`
- [ ] `/src/components/landing/FoodTruckLanding.tsx`
- [ ] `/src/components/landing/SalonLanding.tsx`
- [ ] `/src/components/landing/OpenHouseLanding.tsx`
- [ ] `/src/components/landing/WiFiQRLanding.tsx`
- [ ] `/src/components/landing/QRGeneratorLanding.tsx`
- [ ] `/src/components/landing/APILanding.tsx`

**How to add tracking:**
1. Follow the template in `/docs/LANDING_PAGE_TRACKING_TEMPLATE.md`
2. Add the hook at the top: `const { trackCTA, trackDemo } = useLandingPageTracking('page-name')`
3. Wrap CTA onClick handlers with tracking calls
4. Test in browser and verify in Matomo real-time

## 🚀 Quick Example

Here's how simple it is to add tracking to a new landing page:

```typescript
'use client'

import { useLandingPageTracking } from '@/hooks/useLandingPageTracking'

export default function FitnessLanding() {
  // Add this line
  const { trackCTA, trackDemo } = useLandingPageTracking('fitness');
  
  return (
    <div>
      {/* Hero CTA */}
      <button
        onClick={() => {
          trackCTA('Get Started', 'hero', 'starter');  // Add this
          window.location.href = '/auth/signup?plan=starter';
        }}
      >
        Get Started
      </button>
      
      {/* Demo button */}
      <button
        onClick={() => {
          trackDemo();  // Add this
          window.location.href = '/demo';
        }}
      >
        View Demo
      </button>
    </div>
  );
}
```

## 📊 Expected Data in Matomo

After implementation, you'll see:

### Events
- **Landing Page > view_landing** - Page views by landing page
- **CTA > click_cta_hero** - Hero CTA clicks by landing page and plan
- **CTA > click_cta_pricing** - Pricing CTA clicks by landing page and plan
- **Landing Page > click_demo** - Demo button clicks by landing page

### Goals
- **Landing Page Signup (40)** - Conversions from landing pages
- **Landing Page Trial (41)** - Trial starts from landing pages
- **Landing Page Demo (42)** - Demo views from landing pages

### Segments
Create segments like:
- Users from Restaurant landing page
- Users who clicked hero CTA
- Users who viewed pricing and converted
- Pro plan selectors from fitness landing

### Reports
Build reports showing:
- Top converting landing pages
- CTA effectiveness by location
- Plan preference by landing page
- Time to conversion by entry point

## ✨ Benefits

1. **Attribution** - Know which landing pages drive signups
2. **Optimization** - Identify and improve low-converting pages
3. **A/B Testing** - Compare performance across variants
4. **ROI Tracking** - Measure marketing effectiveness
5. **User Journey** - Understand the path to conversion
6. **Segmentation** - Target users based on entry point

## 🔗 Related Documentation

- [MATOMO_TRACKING.md](./docs/MATOMO_TRACKING.md) - Complete tracking guide
- [MATOMO_QUICK_REFERENCE.md](./docs/MATOMO_QUICK_REFERENCE.md) - Code reference
- [MATOMO_SETUP_GUIDE.md](./docs/MATOMO_SETUP_GUIDE.md) - Setup instructions
- [LANDING_PAGE_TRACKING_TEMPLATE.md](./docs/LANDING_PAGE_TRACKING_TEMPLATE.md) - How to add tracking

---

**Status**: ✅ Core implementation complete  
**Next Steps**: Apply template to remaining 12 landing pages  
**Time to Complete**: ~10 minutes per landing page (2 hours total)  
**Test Status**: ✅ No linter errors  
**Production Ready**: ✅ Yes (after Matomo configuration)

