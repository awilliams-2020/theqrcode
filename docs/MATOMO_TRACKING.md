# Matomo Analytics - Comprehensive Tracking Guide

This document describes the comprehensive Matomo analytics tracking implementation for TheQRCode.io.

## Table of Contents

1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [Custom Dimensions](#custom-dimensions)
4. [Goals & Conversions](#goals--conversions)
5. [Tracking Implementation](#tracking-implementation)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)

---

## Overview

TheQRCode.io uses Matomo for comprehensive analytics tracking across the entire application. This includes:

- **User Journey Tracking**: Signup, login, email verification, password resets
- **QR Code Analytics**: Creation, updates, deletions, and scans
- **E-commerce Tracking**: Subscription purchases, upgrades, renewals, and cancellations
- **API Usage**: API key creation, requests, and rate limiting
- **User Engagement**: Button clicks, form submissions, page views
- **Error Tracking**: Client-side and server-side errors

## Setup Instructions

### 1. Environment Variables

Add the following to your `.env` file:

```env
# Matomo Configuration
NEXT_PUBLIC_MATOMO_URL=https://your-matomo-instance.com
NEXT_PUBLIC_MATOMO_SITE_ID=1
MATOMO_AUTH_TOKEN=your_auth_token_here  # For server-side tracking
```

### 2. Configure Custom Dimensions in Matomo

Go to **Matomo Dashboard > Settings > Custom Dimensions** and create the following:

#### Visit-Scoped Dimensions

| ID | Name | Scope | Description |
|----|------|-------|-------------|
| 1 | User ID | Visit | Logged-in user's unique ID |
| 2 | Subscription Plan | Visit | free, starter, pro, business |
| 3 | Subscription Status | Visit | active, trialing, past_due, canceled |
| 4 | User Role | Visit | user, admin |

#### Action-Scoped Dimensions

| ID | Name | Scope | Description |
|----|------|-------|-------------|
| 5 | QR Code ID | Action | QR code unique identifier |
| 6 | QR Code Type | Action | url, wifi, contact, email, text |
| 7 | QR Code Dynamic | Action | true, false |
| 8 | API Endpoint | Action | API endpoint path |
| 9 | API Version | Action | v1, v2, etc. |
| 10 | Error Type | Action | Error category |
| 11 | Conversion Type | Action | signup, upgrade, api_key, etc. |
| 12 | Payment Plan | Action | Plan being purchased |
| 13 | Campaign Source | Action | Marketing campaign source |

### 3. Configure Goals in Matomo

Go to **Matomo Dashboard > Goals** and create the following:

#### User Acquisition Goals

| ID | Name | Description |
|----|------|-------------|
| 1 | User Signup | New user registration |
| 2 | Email Verified | Email verification completed |
| 3 | Trial Started | Free trial started |

#### Engagement Goals

| ID | Name | Description |
|----|------|-------------|
| 4 | First QR Code Created | User created first QR code |
| 5 | QR Code Shared | QR code downloaded/shared |
| 6 | First Scan Received | First scan on any QR code |

#### Conversion Goals (Revenue)

| ID | Name | Description | Revenue Tracking |
|----|------|-------------|------------------|
| 10 | Subscription Started | Paid subscription started | Yes |
| 11 | Subscription Upgraded | Upgraded to higher tier | Yes |
| 12 | Subscription Renewed | Subscription renewed | Yes |

#### API Goals

| ID | Name | Description |
|----|------|-------------|
| 20 | API Key Created | API key generated |
| 21 | First API Call | First API request made |

#### Milestone Goals

| ID | Name | Description |
|----|------|-------------|
| 30 | 10 QR Codes | Created 10 QR codes |
| 31 | 100 Scans | Received 100 total scans |
| 32 | 1000 Scans | Received 1000 total scans |

## Custom Dimensions

All custom dimensions are defined in `/src/lib/matomo-config.ts`.

### Usage

```typescript
import { createCustomDimensions } from '@/lib/matomo-config';

const dimensions = createCustomDimensions({
  USER_ID: userId,
  SUBSCRIPTION_PLAN: 'pro',
  QR_CODE_TYPE: 'url',
});
```

## Goals & Conversions

Goals are automatically tracked when specific events occur. See `/src/lib/matomo-tracking.ts` for implementation details.

## Tracking Implementation

### Server-Side Tracking

Server-side tracking is implemented in API routes for accurate tracking of backend events.

#### Authentication Tracking

Tracked in:
- `/src/app/api/auth/signup-password/route.ts`
- `/src/app/api/auth/verify-email/route.ts`
- `/src/app/api/auth/reset-password/route.ts`
- `/src/lib/auth.ts` (OAuth logins)

```typescript
import { trackUser } from '@/lib/matomo-tracking';

// Track signup
await trackUser.signup(userId, {
  ip: request.headers.get('x-forwarded-for'),
  userAgent: request.headers.get('user-agent'),
  referrer: request.headers.get('referer'),
});

// Track login
await trackUser.login(userId, subscriptionPlan, {
  ip: request.headers.get('x-forwarded-for'),
  userAgent: request.headers.get('user-agent'),
});
```

#### QR Code Tracking

Tracked in:
- `/src/app/api/qr-codes/route.ts` (creation)
- `/src/app/api/qr-codes/[id]/route.ts` (update, delete)
- `/src/app/api/track/[shortCode]/route.ts` (scans)

```typescript
import { trackQRCode } from '@/lib/matomo-tracking';

// Track QR code creation
await trackQRCode.create(
  userId,
  qrCodeId,
  type,
  isDynamic,
  subscriptionPlan,
  qrCodeCount,
  {
    ip: request.headers.get('x-forwarded-for'),
    userAgent: request.headers.get('user-agent'),
  }
);

// Track QR code scan
await trackQRCode.scan(
  qrCodeId,
  userId,
  type,
  isDynamic,
  totalScans,
  {
    ip: ipAddress,
    userAgent,
    country: locationInfo.country,
    device: deviceInfo.device,
  }
);
```

#### E-commerce Tracking

Tracked in:
- `/src/app/api/stripe/webhook/route.ts`

```typescript
import { trackSubscription } from '@/lib/matomo-tracking';

// Track subscription purchase
await trackSubscription.purchase(
  userId,
  plan,
  revenue,
  orderId,
  {
    isUpgrade: true,
    previousPlan: 'starter',
  }
);

// Track subscription cancellation
await trackSubscription.cancel(userId, plan);

// Track subscription renewal
await trackSubscription.renew(userId, plan, revenue);
```

### Client-Side Tracking

Client-side tracking is implemented using React hooks and components.

#### Page View Tracking

Automatically tracked by `MatomoPageTracker` component in `/src/components/MatomoPageTracker.tsx`.

For custom page views:

```typescript
import { useTrackPageView } from '@/hooks/useTrackPageView';

function MyComponent() {
  useTrackPageView({
    title: 'Custom Page Title',
    customUrl: '/custom/path',
    customDimensions: {
      QR_CODE_ID: qrCodeId,
    },
  });
}
```

#### Button Click Tracking

Use the `TrackableButton` component:

```typescript
import { TrackableButton } from '@/components/TrackableButton';

<TrackableButton
  trackingName="Create QR Code"
  trackingLocation="Dashboard"
  onClick={handleCreate}
  className="btn btn-primary"
>
  Create QR Code
</TrackableButton>
```

Or track manually:

```typescript
import { trackEngagement } from '@/lib/matomo-tracking';

function handleClick() {
  trackEngagement.clickButton('Upgrade Plan', 'Pricing Page');
  // ... rest of your logic
}
```

#### Form Submission Tracking

Use the `useTrackFormSubmission` hook:

```typescript
import { useTrackFormSubmission } from '@/hooks/useTrackFormSubmission';

function ContactForm() {
  const { trackSubmission } = useTrackFormSubmission('Contact Form');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitForm(data);
      trackSubmission(true);  // Success
    } catch (error) {
      trackSubmission(false);  // Failure
    }
  };
}
```

#### Error Tracking

Automatic error tracking:

```typescript
import { useErrorTracking } from '@/hooks/useTrackError';

function MyComponent() {
  useErrorTracking('My Page');  // Tracks unhandled errors
  
  // Component code...
}
```

Manual error tracking:

```typescript
import { useTrackError } from '@/hooks/useTrackError';

function MyComponent() {
  const { logError } = useTrackError();
  
  const handleAction = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      logError('API Error', error.message, 'My Page');
    }
  };
}
```

## Usage Examples

### Example 1: Track Custom Conversion

```typescript
import { trackGoal } from '@/lib/matomo';
import { MatomoGoals } from '@/lib/matomo-config';

function handleNewsletterSignup() {
  // Your logic here...
  
  // Track the conversion
  trackGoal({
    goalId: MatomoGoals.EMAIL_VERIFIED,
    customDimensions: createCustomDimensions({
      CONVERSION_TYPE: 'newsletter',
    }),
  });
}
```

### Example 2: Track Analytics Export

```typescript
import { trackEngagement } from '@/lib/matomo-tracking';

function handleExport() {
  trackEngagement.exportData('QR Analytics');
  // ... export logic
}
```

### Example 3: Track Custom Event

```typescript
import { trackEvent } from '@/lib/matomo';
import { MatomoEventCategory, MatomoEventAction } from '@/lib/matomo-config';

trackEvent({
  category: MatomoEventCategory.ENGAGEMENT,
  action: 'feature_discovery',
  name: 'Dynamic QR Codes',
  value: 1,
});
```

## Best Practices

### 1. Async Tracking

Always track analytics asynchronously and don't block user actions:

```typescript
// ✅ Good - Non-blocking
trackUser.signup(userId).catch(err => console.error('Tracking failed:', err));

// ❌ Bad - Blocking
await trackUser.signup(userId);
```

### 2. Privacy Compliance

- Never track personally identifiable information (PII) in event names or dimensions
- Use user IDs, not emails or names
- Respect user privacy settings

### 3. Custom Dimensions

- Use custom dimensions for segmentation and filtering
- Visit-scoped dimensions for user properties
- Action-scoped dimensions for event-specific data

### 4. Goal Tracking

- Track meaningful business events as goals
- Always include revenue for e-commerce goals
- Use descriptive goal names

### 5. Error Handling

- Always wrap tracking calls in try-catch or use `.catch()`
- Log tracking failures for debugging
- Never let tracking failures break app functionality

### 6. Testing

Test tracking in development:

```typescript
// Enable debug mode in matomo-config.ts
if (process.env.NODE_ENV === 'development') {
  console.log('Tracking event:', eventData);
}
```

## Troubleshooting

### Tracking Not Working

1. Check environment variables are set correctly
2. Verify Matomo script is loaded: Check browser console for `_paq`
3. Check browser network tab for tracking requests to `/matomo.php`
4. Review Matomo logs for errors

### Custom Dimensions Not Appearing

1. Ensure dimensions are created in Matomo Dashboard
2. Verify dimension IDs match configuration in `matomo-config.ts`
3. Re-archive reports in Matomo if needed

### Goals Not Triggering

1. Check goal configuration in Matomo Dashboard
2. Verify goal IDs match configuration in `matomo-config.ts`
3. Review tracking calls for correct goal ID usage
4. Check Matomo real-time logs

## Additional Resources

- [Matomo Analytics Documentation](https://matomo.org/docs/)
- [Matomo Tracking API](https://developer.matomo.org/api-reference/tracking-api)
- [Matomo JavaScript Tracking Client](https://developer.matomo.org/guides/tracking-javascript-guide)

---

**Last Updated:** October 2025  
**Maintained By:** TheQRCode.io Development Team

