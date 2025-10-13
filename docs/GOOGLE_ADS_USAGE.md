# Google Ads Conversion Tracking - Usage Guide

## Overview

Google Ads conversion tracking has been integrated into TheQRCode.io to measure the effectiveness of your advertising campaigns.

## Files Added/Modified

- ✅ `src/app/layout.tsx` - Google Ads base tracking script
- ✅ `src/lib/google-ads.ts` - Conversion tracking utilities
- ✅ `src/types/gtag.d.ts` - TypeScript definitions
- ✅ `docs/ENV_SETUP.md` - Environment variable documentation

## Quick Start

### 1. Set Environment Variables

Add to your `.env.local` (see `docs/ENV_SETUP.md` for full setup):

```env
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_TRIAL=AbC-DefG123
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_DEMO=XyZ-AbcD456
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_PAYMENT=PaymentConversion
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_API=ApiKeyConversion
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_BUSINESS=BusinessUpgrade
```

### 2. Add Conversion Tracking to Your Code

## Where to Add Tracking Calls

### Trial Signup Conversion

**Location:** After successful user registration/trial signup

```typescript
// Example: src/app/auth/signup/page.tsx or API route
import { trackConversion } from '@/lib/google-ads';

// After successful signup
const handleSignup = async () => {
  try {
    const user = await signUp(userData);
    
    // Track Google Ads conversion
    trackConversion('trial_signup', undefined, user.id);
    
    // Rest of your signup flow
    router.push('/dashboard');
  } catch (error) {
    console.error(error);
  }
};
```

**Or in your signup API route:**

```typescript
// src/app/api/auth/signup/route.ts
export async function POST(req: Request) {
  const user = await createUser(data);
  
  return NextResponse.json({
    success: true,
    userId: user.id,
    trackConversion: 'trial_signup', // Signal to client to track
  });
}

// Then in client component:
const response = await fetch('/api/auth/signup', { ... });
const data = await response.json();

if (data.trackConversion) {
  trackConversion('trial_signup', undefined, data.userId);
}
```

### Demo Usage Conversion (Micro-conversion)

**Location:** After user generates a QR code in demo mode

```typescript
// Example: src/app/demo/page.tsx
import { trackConversion } from '@/lib/google-ads';

const handleGenerateDemo = async () => {
  // Generate QR code
  const qrCode = await generateQR(data);
  
  // Track demo usage (micro-conversion)
  trackConversion('demo_usage');
  
  setGeneratedQR(qrCode);
};
```

### Paid Subscription Conversion

**Location:** Stripe webhook handler or subscription success page

```typescript
// Example: src/app/api/webhooks/stripe/route.ts
import { trackConversion } from '@/lib/google-ads';

export async function POST(req: Request) {
  const event = await stripe.webhooks.constructEvent(body, sig, webhookSecret);
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Update user subscription in DB
    await updateUserSubscription(session.customer, session.subscription);
    
    // Note: This runs server-side, so tracking needs to happen client-side
    // Option 1: Store pending conversion in DB, track on next page load
    await db.pendingConversion.create({
      userId: session.metadata.userId,
      type: 'paid_subscription',
      amount: session.amount_total / 100,
      transactionId: session.id,
    });
  }
  
  return NextResponse.json({ received: true });
}
```

**Then in your dashboard or thank-you page:**

```typescript
// Example: src/app/dashboard/page.tsx or src/app/thank-you/page.tsx
'use client';

import { useEffect } from 'react';
import { trackConversion } from '@/lib/google-ads';

export default function Dashboard() {
  useEffect(() => {
    // Check for pending conversions to track
    const checkPendingConversions = async () => {
      const response = await fetch('/api/conversions/pending');
      const { conversions } = await response.json();
      
      conversions?.forEach((conv: any) => {
        if (conv.type === 'paid_subscription') {
          trackConversion('paid_subscription', conv.amount, conv.transactionId);
          
          // Mark as tracked
          fetch('/api/conversions/mark-tracked', {
            method: 'POST',
            body: JSON.stringify({ id: conv.id }),
          });
        }
      });
    };
    
    checkPendingConversions();
  }, []);
  
  return <div>Dashboard content...</div>;
}
```

### API Key Created

**Location:** After user creates their first API key (Pro feature)

```typescript
// Example: src/app/api/v1/api-keys/route.ts or API key creation component
import { trackConversion } from '@/lib/google-ads';

const handleCreateApiKey = async () => {
  const apiKey = await createApiKey(userId);
  
  // Track API key creation (indicates engagement with Pro features)
  trackConversion('api_key_created');
  
  setApiKeys([...apiKeys, apiKey]);
};
```

### Business Plan Upgrade

**Location:** When user upgrades to Business plan

```typescript
// Example: src/app/pricing/page.tsx or upgrade flow
import { trackConversion } from '@/lib/google-ads';

const handleUpgrade = async (planId: string) => {
  if (planId === 'business') {
    // Create Stripe checkout session
    const session = await createCheckoutSession(planId);
    
    // After successful upgrade (in webhook or success page)
    trackConversion('business_plan_upgrade', 50.0, session.id);
    
    router.push(session.url);
  }
};
```

## Advanced Usage

### Track Page Views for Remarketing

```typescript
// Example: In a client component or layout
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/google-ads';

export function GoogleAdsPageTracking() {
  const pathname = usePathname();
  
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
  
  return null;
}
```

### Enhanced Conversions with User Data

```typescript
import { setUserData, trackConversion } from '@/lib/google-ads';

// Before tracking conversion, set user data for enhanced matching
setUserData({
  email: user.email,
  phone: user.phone,
  address: {
    first_name: user.firstName,
    last_name: user.lastName,
    country: user.country,
    postal_code: user.postalCode,
  },
});

// Then track conversion
trackConversion('trial_signup', undefined, user.id);
```

## Testing

### Local Testing

1. Set up environment variables in `.env.local`
2. Run the app: `npm run dev`
3. Open browser console
4. Perform a conversion action
5. Look for: `Google Ads conversion tracked: [event_name]`

### Production Testing

1. Use Google Tag Assistant Chrome extension
2. Visit your site
3. Perform conversion
4. Check if conversion fires in Tag Assistant
5. Verify in Google Ads dashboard (may take 24 hours)

## Debugging

### Conversion Not Tracking

```typescript
// Add debug logging
console.log('Google Ads ID:', process.env.NEXT_PUBLIC_GOOGLE_ADS_ID);
console.log('gtag available:', typeof window !== 'undefined' && !!window.gtag);
```

### Check Network Requests

1. Open DevTools > Network tab
2. Filter: `google`
3. Look for requests to `googletagmanager.com` and `google-analytics.com`
4. Check for conversion ping with `?cv=` parameter

## Best Practices

1. **Only track once per conversion** - Use unique transaction IDs
2. **Track on client-side** - gtag.js requires browser context
3. **Handle async operations** - Store pending conversions in DB if needed
4. **Test in incognito** - Avoid cookie conflicts
5. **Verify values** - Use meaningful conversion values for optimization
6. **Privacy compliance** - Ensure GDPR/CCPA compliance

## Conversion Values

The following default values are set in `src/lib/google-ads.ts`:

- Trial Signup: $20
- Demo Usage: $5
- Paid Subscription: Dynamic (actual amount)
- API Key Created: $15
- Business Plan Upgrade: $50

These can be adjusted based on your actual customer lifetime value (LTV) data.

## Related Documentation

- [ENV_SETUP.md](./ENV_SETUP.md) - Environment configuration
- [TODO.md](../TODO.md) - Google Ads campaign setup tasks
- [Google Ads Help](https://support.google.com/google-ads/answer/6331304) - Conversion tracking guide


