# Landing Page Tracking Template

This template shows how to add Matomo tracking to landing pages.

## Quick Guide

### 1. Import the hook at the top of the component

```typescript
import { useLandingPageTracking } from '@/hooks/useLandingPageTracking'
```

### 2. Initialize the hook in your component

```typescript
export default function YourLandingPage() {
  // Replace 'page-name' with: home, restaurants, retail, fitness, weddings, etc.
  const { trackCTA, trackDemo } = useLandingPageTracking('page-name');
  
  // Rest of your component...
}
```

### 3. Track CTA buttons

Replace this:
```typescript
<button
  onClick={() => window.location.href = '/auth/signup?plan=starter'}
  className="..."
>
  Sign Up Now
</button>
```

With this:
```typescript
<button
  onClick={() => {
    trackCTA('Sign Up Now', 'hero', 'starter');
    window.location.href = '/auth/signup?plan=starter';
  }}
  className="..."
>
  Sign Up Now
</button>
```

### 4. Track Demo buttons

Replace this:
```typescript
<button
  onClick={() => window.location.href = '/demo'}
  className="..."
>
  View Demo
</button>
```

With this:
```typescript
<button
  onClick={() => {
    trackDemo();
    window.location.href = '/demo';
  }}
  className="..."
>
  View Demo
</button>
```

### 5. Track Pricing Card CTAs

For pricing cards within the landing page:
```typescript
<button
  onClick={() => {
    const planId = plan.name.toLowerCase();
    trackCTA(plan.cta, 'pricing', planId);
    window.location.href = `/auth/signup?plan=${planId}`;
  }}
  className="..."
>
  {plan.cta}
</button>
```

## Landing Page Names

Use these standardized names for `useLandingPageTracking()`:

- `'home'` - Main landing page
- `'restaurants'` - Restaurant QR codes
- `'retail'` - Retail/shopping
- `'fitness'` - Gyms and fitness centers
- `'weddings'` - Wedding events
- `'real-estate'` - Real estate/open houses
- `'photographers'` - Photography business
- `'musicians'` - Musicians and artists
- `'food-trucks'` - Food trucks
- `'salons'` - Salons and spas
- `'open-houses'` - Real estate open houses
- `'wifi-generator'` - WiFi QR generator
- `'qr-generator'` - General QR generator
- `'api'` - API landing page
- `'pricing'` - Pricing page

## CTA Location Values

Use these for the location parameter:

- `'hero'` - Hero section CTA
- `'pricing'` - Pricing card CTA
- `'footer'` - Footer CTA
- `'inline'` - Mid-page CTA

## Examples by Landing Page

### Restaurant Landing
```typescript
const { trackCTA, trackDemo } = useLandingPageTracking('restaurants');

// Hero CTA
trackCTA('Create Menu QR Code', 'hero', 'starter');

// Demo button
trackDemo();
```

### Fitness Landing
```typescript
const { trackCTA, trackDemo } = useLandingPageTracking('fitness');

// Hero CTA
trackCTA('Start Your Free Trial', 'hero', 'pro');
```

### API Landing
```typescript
const { trackCTA, trackDemo } = useLandingPageTracking('api');

// Hero CTA
trackCTA('Get API Access', 'hero', 'pro');
```

## Applying to Remaining Landing Pages

Apply this template to these components:

- [x] `/src/components/LandingPage.tsx` (main)
- [x] `/src/components/landing/RestaurantLanding.tsx`
- [x] `/src/components/PricingPage.tsx`
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

## Testing

After adding tracking:

1. Open the landing page in browser
2. Open browser console
3. Click a CTA button
4. Check Matomo Real-time dashboard for the event
5. Verify custom dimensions are set correctly

## What Gets Tracked

For each landing page, Matomo will track:

✅ Page views with landing page name  
✅ CTA button clicks with location and plan  
✅ Demo button clicks  
✅ Pricing views  
✅ Custom dimensions:
  - Landing Page name
  - CTA Location
  - Payment Plan selected

✅ Goals triggered:
  - Landing Page Trial (when trial CTA clicked)
  - Landing Page Demo (when demo clicked)
  - Landing Page Signup (when signup CTA clicked)

## Notes

- All tracking is non-blocking (async)
- Tracking failures won't break the user experience
- Events are tracked before navigation for accuracy
- Custom dimensions enable powerful segmentation in Matomo

---

For more information, see:
- [MATOMO_TRACKING.md](./MATOMO_TRACKING.md) - Full tracking guide
- [MATOMO_QUICK_REFERENCE.md](./MATOMO_QUICK_REFERENCE.md) - Code examples

