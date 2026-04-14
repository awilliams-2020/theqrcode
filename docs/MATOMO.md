# Matomo Analytics

Single reference for Matomo tracking in TheQRCode.io: setup, API, and usage.

## Setup

### Environment

```env
NEXT_PUBLIC_MATOMO_URL=https://your-matomo-instance.com
NEXT_PUBLIC_MATOMO_SITE_ID=1
MATOMO_AUTH_TOKEN=your_auth_token   # Server-side; from Matomo > Settings > Security
```

### Custom Dimensions (Matomo Dashboard > Custom Dimensions)

**Visit-scoped:** 1 User ID, 2 Subscription Plan, 3 Subscription Status, 4 User Role  
**Action-scoped:** 5 QR Code ID, 6 QR Code Type, 7 QR Code Dynamic, 8 API Endpoint, 9 API Version, 10 Error Type, 11 Conversion Type, 12 Payment Plan, 13 Campaign Source

IDs must match `/src/lib/matomo-config.ts`.

### Goals (Matomo Dashboard > Goals)

Create goals as **Manually triggered**. Enable revenue for subscription goals (Started, Upgraded, Renewed).  
Full list: User Signup (1), Email Verified (2), Trial Started (3), First QR Code (4), QR Shared (5), First Scan (6), Subscription Started/Upgraded/Renewed (7–9), API Key (10), First API Call (11), 10 QRs (12), 100/1000 Scans (13–14), Landing Page Signup/Trial/Demo (15–17).

---

## Quick reference

### Server-side (API routes)

```typescript
import { trackUser, trackQRCode, trackSubscription, trackAPI } from '@/lib/matomo-tracking';

await trackUser.signup(userId, { ip, userAgent, referrer });
await trackUser.login(userId, subscriptionPlan, { ip, userAgent });
await trackQRCode.create(userId, qrCodeId, type, isDynamic, plan, count, { ip, userAgent });
await trackQRCode.scan(qrCodeId, userId, type, isDynamic, totalScans, { ip, userAgent, country, device });
await trackSubscription.purchase(userId, plan, revenue, orderId, { isUpgrade, previousPlan });
await trackSubscription.cancel(userId, plan, { reason });
await trackAPI.createKey(userId, apiKeyId, subscriptionPlan, { ip, userAgent });
```

Extract from request: `ip = headers.get('x-forwarded-for') || headers.get('x-real-ip')`, `userAgent = headers.get('user-agent')`, `referrer = headers.get('referer')`.

### Client-side

- **Page views:** Automatic via `MatomoPageTracker` in layout.
- **Signup flow:** `useSignupTracking({ pageName, source })` → `trackSignupFormStart`, `trackSignupFormSuccess`, `trackSignupFormError`.
- **Landing pages:** `useLandingPageTracking(pageName)` → `trackCTA`, `trackDemo`, `trackPricingView`; or use `trackLandingPage.view(name)`, `trackLandingPage.clickSignupCTA(text, location, page)`.
- **Engagement:** `trackEngagement.clickButton(name, location)`, `trackEngagement.viewAnalytics(qrCodeId)`, `trackEngagement.exportData(type)`.
- **Ad-hoc:** `useMatomo()` → `trackEvent`, `trackGoal`.

### Imports

```typescript
import { trackUser, trackQRCode, trackSubscription, trackAPI, trackEngagement, trackLandingPage, trackSignup } from '@/lib/matomo-tracking';
import { MatomoGoals, createCustomDimensions } from '@/lib/matomo-config';
import { trackEvent, trackGoal } from '@/lib/matomo';
import { useMatomo, useSignupTracking, useLandingPageTracking } from '@/hooks/useMatomo';
```

---

## Landing pages

Landing page views and CTA clicks use dimensions 14 (LANDING_PAGE) and 15 (CTA_LOCATION) and goals 15–17. Use `useLandingPageTracking('page-name')` and wire CTAs through `trackCTA` / `trackLandingPage.clickSignupCTA`.

---

## Best practices

- Track async; never block: `trackUser.signup(...).catch(err => console.error('Tracking failed:', err))`.
- Do not track PII; use user IDs only.
- Include IP and User-Agent for server-side calls.
- Use custom dimensions for segmentation; keep config in sync with Matomo.

---

**Core files:** `src/lib/matomo.ts`, `src/lib/matomo-config.ts`, `src/lib/matomo-tracking.ts`, `src/hooks/useMatomo.ts`, `src/hooks/useSignupTracking.ts`, `src/hooks/useLandingPageTracking.ts`, `src/components/MatomoPageTracker.tsx`, `src/components/MatomoUserTracking.tsx`.
