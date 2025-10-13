# Landing Page Tracking with Matomo

Complete guide for tracking landing pages in TheQRCode.io.

## Overview

Landing page tracking helps you:
- Measure which landing pages convert best
- Understand user journey from first touch
- Optimize CTA placement and messaging
- Track plan preferences by entry point
- Calculate ROI for marketing campaigns

## What Gets Tracked

### 1. Page Views
Every landing page view is tracked with:
- Landing page name (home, restaurants, retail, etc.)
- Plan shown (if applicable)
- Timestamp and referrer
- User device and location

### 2. CTA Clicks
All call-to-action button clicks tracked with:
- CTA text (e.g., "Start Free Trial")
- Landing page name
- Location on page (hero, pricing, footer)
- Plan selected (if applicable)

### 3. Demo Views
Demo button clicks tracked to measure:
- Interest in product before signup
- Conversion from demo to signup
- Which landing pages drive demo interest

### 4. Goals
Automatic goal tracking for:
- Trial starts from landing pages
- Signups from landing pages
- Demo views from landing pages

## Implementation

### Quick Start

```typescript
import { useLandingPageTracking } from '@/hooks/useLandingPageTracking'

export default function YourLanding() {
  const { trackCTA, trackDemo } = useLandingPageTracking('your-page-name');
  
  return (
    <button
      onClick={() => {
        trackCTA('CTA Text', 'hero', 'pro');
        window.location.href = '/auth/signup?plan=pro';
      }}
    >
      Click Me
    </button>
  );
}
```

### Landing Page Names

Use these standardized names:

**Main Pages:**
- `home` - Main landing page
- `pricing` - Pricing page

**Industry Pages:**
- `restaurants` - Restaurant QR codes
- `retail` - Retail/shopping
- `fitness` - Gyms and fitness
- `weddings` - Wedding events
- `real-estate` - Real estate
- `photographers` - Photography
- `musicians` - Musicians/artists
- `food-trucks` - Food trucks
- `salons` - Salons and spas
- `open-houses` - Open houses

**Product Pages:**
- `wifi-generator` - WiFi QR generator
- `qr-generator` - General QR generator
- `api` - API landing page

### CTA Locations

Use these location values:
- `hero` - Hero section at top of page
- `pricing` - Within pricing cards
- `footer` - Footer CTAs
- `inline` - Mid-page CTAs

## Code Examples

### Hero Section CTA

```typescript
<button
  onClick={() => {
    trackCTA('Start Free Trial', 'hero', 'pro');
    window.location.href = '/auth/signup?plan=pro';
  }}
  className="btn-primary"
>
  Start Free Trial
</button>
```

### Demo Button

```typescript
<button
  onClick={() => {
    trackDemo();
    window.location.href = '/demo';
  }}
  className="btn-secondary"
>
  View Demo
</button>
```

### Pricing Card CTA

```typescript
{plans.map(plan => (
  <button
    key={plan.id}
    onClick={() => {
      trackCTA(plan.cta, 'pricing', plan.id);
      window.location.href = `/auth/signup?plan=${plan.id}`;
    }}
  >
    {plan.cta}
  </button>
))}
```

### Footer CTA

```typescript
<button
  onClick={() => {
    trackCTA('Get Started', 'footer', 'starter');
    window.location.href = '/auth/signup?plan=starter';
  }}
  className="btn-footer"
>
  Get Started
</button>
```

## Custom Dimensions

### Landing Page (Dimension 14)
**Scope:** Action  
**Values:** home, restaurants, retail, fitness, etc.

Used to:
- Segment users by entry point
- Compare landing page performance
- Track conversion funnels

### CTA Location (Dimension 15)
**Scope:** Action  
**Values:** hero, pricing, footer, inline

Used to:
- Optimize CTA placement
- A/B test button locations
- Understand user engagement patterns

## Goals

### Goal 40: Landing Page Signup
**Triggered:** When user signs up from landing page  
**Revenue:** No  
**Use:** Track conversion rate by landing page

### Goal 41: Landing Page Trial
**Triggered:** When user starts trial from landing page  
**Revenue:** No  
**Use:** Measure trial starts by source

### Goal 42: Landing Page Demo
**Triggered:** When user views demo from landing page  
**Revenue:** No  
**Use:** Track demo interest and conversion

## Analytics Insights

### Conversion Funnel Analysis

```
Landing Page View (trackLandingPage.view)
    ↓
CTA Click (trackLandingPage.clickCTA)
    ↓
Signup Page (tracked automatically)
    ↓
Account Created (trackUser.signup)
    ↓
First QR Created (trackQRCode.create)
```

### Reports to Create

1. **Landing Page Performance**
   - Views, clicks, conversions by page
   - Conversion rate by landing page
   - Time to conversion

2. **CTA Effectiveness**
   - Click-through rate by location
   - Which CTAs convert best
   - Plan preference by CTA location

3. **Plan Selection**
   - Most popular plan by landing page
   - Upgrade patterns from entry point
   - Revenue by landing page source

4. **User Journey**
   - Path from landing to conversion
   - Drop-off points in funnel
   - Time spent before conversion

### Matomo Segments

Create these segments for deeper analysis:

```javascript
// Users from restaurant landing
Landing Page = "restaurants"

// Users who clicked hero CTA
CTA Location = "hero"

// Pro plan selectors
Payment Plan = "pro"

// High-intent users (clicked CTA and demo)
CTA Location exists AND Event Action = "click_demo"
```

## Best Practices

### 1. Consistent Naming
Always use the same page name for a landing page:
```typescript
// ✅ Good - consistent
useLandingPageTracking('restaurants')

// ❌ Bad - inconsistent
useLandingPageTracking('restaurant')
useLandingPageTracking('Restaurants')
```

### 2. Track Before Navigation
Always track before redirecting:
```typescript
// ✅ Good
trackCTA('Sign Up', 'hero', 'pro');
window.location.href = '/signup';

// ❌ Bad - might not track
window.location.href = '/signup';
trackCTA('Sign Up', 'hero', 'pro');
```

### 3. Include Plan Context
Always include plan when relevant:
```typescript
// ✅ Good - includes plan
trackCTA('Subscribe', 'pricing', 'pro');

// ⚠️ Less useful - missing plan
trackCTA('Subscribe', 'pricing');
```

### 4. Track All CTAs
Don't forget secondary CTAs:
```typescript
// Primary CTA
trackCTA('Start Trial', 'hero', 'pro');

// Secondary CTA - also track!
trackCTA('Learn More', 'hero');
```

## Testing

### Manual Testing

1. **Open landing page** in browser
2. **Open browser console** (F12)
3. **Click a CTA** and check console for tracking
4. **Go to Matomo** > Visitors > Real-time
5. **Verify event appears** with correct dimensions

### Test Checklist

- [ ] Page view tracked on load
- [ ] Hero CTA click tracked
- [ ] Demo button click tracked
- [ ] Pricing CTA clicks tracked
- [ ] Custom dimensions set correctly
- [ ] Goals triggered when appropriate
- [ ] No JavaScript errors

### Debug Mode

Enable debug mode to see tracking:

```typescript
// In useLandingPageTracking.ts
useEffect(() => {
  console.log('Tracking page view:', pageName);
  trackLandingPage.view(pageName, planShown);
}, [pageName, planShown]);
```

## Common Issues

### Tracking Not Working

**Issue:** Events not appearing in Matomo  
**Solutions:**
1. Check `NEXT_PUBLIC_MATOMO_URL` is set
2. Verify `_paq` exists in browser console
3. Check network tab for `/matomo.php` requests
4. Ensure custom dimensions are configured in Matomo

### Wrong Dimension Values

**Issue:** Custom dimension shows empty or wrong value  
**Solutions:**
1. Verify dimension IDs match Matomo config
2. Check dimension is action-scoped (not visit-scoped)
3. Confirm dimension is active in Matomo

### Goals Not Triggering

**Issue:** Goal not showing in reports  
**Solutions:**
1. Verify goal ID matches config
2. Check goal is set to "Manually triggered"
3. Ensure goal is active and not archived

## Performance

Landing page tracking is optimized for performance:

- **Non-blocking**: All tracking is async
- **No delays**: User experience not affected
- **Failure-safe**: Tracking errors don't break app
- **Lightweight**: Minimal overhead (~1-2ms per event)

## Privacy

Landing page tracking respects user privacy:

- **No PII**: Only anonymous identifiers
- **Cookie consent**: Respects user preferences
- **Opt-out**: Matomo opt-out supported
- **GDPR compliant**: When configured properly

## ROI Calculation

Calculate marketing ROI by landing page:

```
Visitors → Landing Page Views → CTA Clicks → Signups → Revenue

Example:
- 1000 visitors to restaurant landing
- 400 CTA clicks (40% CTR)
- 80 signups (20% conversion)
- 20 paid subscriptions (25% free-to-paid)
- $580 MRR ($29 average)

ROI per landing page visit: $0.58
```

## Migration Guide

### From No Tracking

1. Add hook to component:
   ```typescript
   const { trackCTA, trackDemo } = useLandingPageTracking('page-name');
   ```

2. Wrap existing onClick handlers:
   ```typescript
   // Before
   onClick={() => window.location.href = '/signup'}
   
   // After
   onClick={() => {
     trackCTA('CTA Text', 'hero', 'plan');
     window.location.href = '/signup';
   }}
   ```

### From Google Analytics

If migrating from GA4:

| GA4 Event | Matomo Equivalent |
|-----------|-------------------|
| page_view | trackLandingPage.view |
| click | trackLandingPage.clickCTA |
| generate_lead | Landing Page Trial goal |
| sign_up | Landing Page Signup goal |

## Related Documentation

- [MATOMO_TRACKING.md](./MATOMO_TRACKING.md) - Complete tracking guide
- [MATOMO_QUICK_REFERENCE.md](./MATOMO_QUICK_REFERENCE.md) - Code examples
- [LANDING_PAGE_TRACKING_TEMPLATE.md](./LANDING_PAGE_TRACKING_TEMPLATE.md) - Implementation template

---

**Version:** 1.0  
**Last Updated:** October 2025  
**Maintained By:** TheQRCode.io Development Team

