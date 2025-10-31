# Matomo Tracking - Quick Reference

Quick reference for implementing Matomo tracking in TheQRCode.io.

## 🚀 Quick Start

### Server-Side Tracking (API Routes)

```typescript
import { trackUser, trackQRCode, trackSubscription, trackAPI } from '@/lib/matomo-tracking';

// User events
await trackUser.signup(userId, { ip, userAgent, referrer });
await trackUser.login(userId, subscriptionPlan, { ip, userAgent });
await trackUser.verifyEmail(userId, { ip, userAgent });
await trackUser.resetPassword(userId, { ip, userAgent });

// QR Code events
await trackQRCode.create(userId, qrCodeId, type, isDynamic, plan, count, { ip, userAgent });
await trackQRCode.scan(qrCodeId, userId, type, isDynamic, totalScans, { ip, userAgent, country, device });
await trackQRCode.update(userId, qrCodeId, type, isDynamic, { ip, userAgent });
await trackQRCode.delete(userId, qrCodeId, type, isDynamic, { ip, userAgent });

// Subscription events
await trackSubscription.purchase(userId, plan, revenue, orderId, { isUpgrade, previousPlan });
await trackSubscription.cancel(userId, plan, { reason });
await trackSubscription.renew(userId, plan, revenue);

// API events
await trackAPI.createKey(userId, apiKeyId, subscriptionPlan, { ip, userAgent });
await trackAPI.request(endpoint, method, userId, { statusCode, responseTime });
await trackAPI.rateLimited(endpoint, userId, { ip, userAgent });
```

### Client-Side Tracking (React Components)

```typescript
import { trackEngagement } from '@/lib/matomo-tracking';
import { TrackableButton } from '@/components/TrackableButton';
import { TrackableLink } from '@/components/TrackableLink';
import { useTrackPageView } from '@/hooks/useTrackPageView';
import { useTrackFormSubmission } from '@/hooks/useTrackFormSubmission';
import { useTrackError, useErrorTracking } from '@/hooks/useTrackError';

// Button clicks
<TrackableButton trackingName="Create QR" trackingLocation="Dashboard">
  Create
</TrackableButton>

// Or manually
trackEngagement.clickButton('Button Name', 'Location');

// Form submissions
const { trackSubmission } = useTrackFormSubmission('Form Name');
trackSubmission(true);  // success
trackSubmission(false); // failure

// Page views
useTrackPageView({ title: 'Custom Title' });

// Error tracking (automatic)
useErrorTracking('Page Name');

// Error tracking (manual)
const { logError } = useTrackError();
logError('Error Type', 'Error message', 'Page Name');

// Analytics actions
trackEngagement.viewAnalytics(qrCodeId);
trackEngagement.exportData('Data Type');
```

## 📊 Custom Dimensions

```typescript
import { createCustomDimensions } from '@/lib/matomo-config';

const dimensions = createCustomDimensions({
  USER_ID: userId,
  SUBSCRIPTION_PLAN: 'pro',
  SUBSCRIPTION_STATUS: 'active',
  QR_CODE_ID: qrCodeId,
  QR_CODE_TYPE: 'url',
  QR_CODE_DYNAMIC: 'true',
  ERROR_TYPE: 'validation',
});
```

### Available Dimensions

**Visit-Scoped:**
- `USER_ID` - User's unique ID
- `SUBSCRIPTION_PLAN` - free, starter, pro, business
- `SUBSCRIPTION_STATUS` - active, trialing, past_due, canceled
- `USER_ROLE` - user, admin

**Action-Scoped:**
- `QR_CODE_ID` - QR code identifier
- `QR_CODE_TYPE` - url, wifi, contact, email, text
- `QR_CODE_DYNAMIC` - true, false
- `API_ENDPOINT` - API path
- `API_VERSION` - v1, v2, etc.
- `ERROR_TYPE` - Error category
- `CONVERSION_TYPE` - signup, upgrade, etc.
- `PAYMENT_PLAN` - Plan being purchased
- `CAMPAIGN_SOURCE` - Marketing source

## 🎯 Goals

```typescript
import { MatomoGoals } from '@/lib/matomo-config';

// Goals are tracked automatically, but you can also track manually:
import { trackGoal } from '@/lib/matomo';

trackGoal({
  goalId: MatomoGoals.USER_SIGNUP,
  revenue: 0,
  customDimensions: dimensions,
});
```

### Available Goals

**User Acquisition:**
- `USER_SIGNUP` (1) - New user registration
- `EMAIL_VERIFIED` (2) - Email verified
- `TRIAL_STARTED` (3) - Trial started

**Engagement:**
- `FIRST_QR_CODE_CREATED` (4) - First QR code
- `QR_CODE_SHARED` (5) - QR code shared
- `FIRST_SCAN_RECEIVED` (6) - First scan

**Revenue:**
- `SUBSCRIPTION_STARTED` (7) - New subscription
- `SUBSCRIPTION_UPGRADED` (8) - Upgraded
- `SUBSCRIPTION_RENEWED` (9) - Renewed

**API:**
- `API_KEY_CREATED` (10) - API key generated
- `FIRST_API_CALL` (11) - First API call

**Milestones:**
- `TEN_QR_CODES` (12) - 10 QR codes created
- `HUNDRED_SCANS` (13) - 100 scans received
- `THOUSAND_SCANS` (14) - 1000 scans received

**Landing Pages:**
- `LANDING_PAGE_SIGNUP` (15) - Signup from landing page
- `LANDING_PAGE_TRIAL` (16) - Started trial from landing page
- `LANDING_PAGE_DEMO` (17) - Viewed demo from landing page

## 📝 Event Categories & Actions

```typescript
import { MatomoEventCategory, MatomoEventAction } from '@/lib/matomo-config';

// Event categories
MatomoEventCategory.USER          // 'User'
MatomoEventCategory.QR_CODE       // 'QR Code'
MatomoEventCategory.SUBSCRIPTION  // 'Subscription'
MatomoEventCategory.API           // 'API'
MatomoEventCategory.ANALYTICS     // 'Analytics'
MatomoEventCategory.PAYMENT       // 'Payment'
MatomoEventCategory.ENGAGEMENT    // 'Engagement'
MatomoEventCategory.ERROR         // 'Error'
MatomoEventCategory.NAVIGATION    // 'Navigation'
MatomoEventCategory.FORM          // 'Form'

// Event actions
MatomoEventAction.SIGNUP          // 'signup'
MatomoEventAction.LOGIN           // 'login'
MatomoEventAction.CREATE          // 'create'
MatomoEventAction.UPDATE          // 'update'
MatomoEventAction.DELETE          // 'delete'
MatomoEventAction.SCAN            // 'scan'
MatomoEventAction.DOWNLOAD        // 'download'
// ... and many more
```

## 🔍 Manual Tracking

For custom tracking not covered by the helpers:

```typescript
import { trackEvent, trackPageView } from '@/lib/matomo';

// Custom event
trackEvent({
  category: 'Custom Category',
  action: 'custom_action',
  name: 'Event Name',
  value: 123,
  customDimensions: dimensions,
});

// Custom page view
trackPageView({
  documentTitle: 'Custom Title',
  customUrl: '/custom/path',
  customDimensions: dimensions,
});
```

## 🛠️ Extracting Request Info

For server-side tracking, extract IP and User-Agent:

```typescript
const ip = request.headers.get('x-forwarded-for') || 
           request.headers.get('x-real-ip') || 
           undefined;

const userAgent = request.headers.get('user-agent') || undefined;
const referrer = request.headers.get('referer') || undefined;
```

## ⚠️ Best Practices

1. **Always track async and don't block**
   ```typescript
   trackUser.signup(userId).catch(err => console.error('Tracking failed:', err));
   ```

2. **Never track PII**
   ```typescript
   // ✅ Good
   trackEvent({ name: userId });
   
   // ❌ Bad
   trackEvent({ name: userEmail });
   ```

3. **Include IP and User-Agent for server-side tracking**
   ```typescript
   await trackUser.signup(userId, { 
     ip: request.headers.get('x-forwarded-for'),
     userAgent: request.headers.get('user-agent'),
   });
   ```

4. **Use custom dimensions for segmentation**
   ```typescript
   trackEvent({
     category: 'QR Code',
     action: 'scan',
     customDimensions: createCustomDimensions({
       QR_CODE_TYPE: 'url',
       SUBSCRIPTION_PLAN: 'pro',
     }),
   });
   ```

## 📦 Import Paths

```typescript
// Tracking functions
import { 
  trackUser, 
  trackQRCode, 
  trackSubscription, 
  trackAPI, 
  trackError, 
  trackEngagement 
} from '@/lib/matomo-tracking';

// Configuration
import { 
  MatomoGoals, 
  MatomoEventCategory, 
  MatomoEventAction,
  createCustomDimensions,
} from '@/lib/matomo-config';

// Core functions
import { 
  trackEvent, 
  trackPageView, 
  trackGoal 
} from '@/lib/matomo';

// React components
import { TrackableButton } from '@/components/TrackableButton';
import { TrackableLink } from '@/components/TrackableLink';

// React hooks
import { useMatomo } from '@/hooks/useMatomo';
import { useTrackPageView } from '@/hooks/useTrackPageView';
import { useTrackFormSubmission } from '@/hooks/useTrackFormSubmission';
import { useTrackError, useErrorTracking } from '@/hooks/useTrackError';
```

---

For detailed documentation, see [MATOMO_TRACKING.md](./MATOMO_TRACKING.md)

