# Matomo Analytics Integration Guide

This guide explains how to integrate and use Matomo analytics in the TheQRCode.io application.

## Table of Contents

1. [Setup](#setup)
2. [Client-Side Tracking](#client-side-tracking)
3. [Server-Side Tracking](#server-side-tracking)
4. [React Hooks](#react-hooks)
5. [Common Use Cases](#common-use-cases)
6. [API Reference](#api-reference)

## Setup

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Public variables (available in browser)
NEXT_PUBLIC_MATOMO_URL=https://your-matomo-instance.com
NEXT_PUBLIC_MATOMO_SITE_ID=1

# Server-only variable (for server-side tracking)
MATOMO_AUTH_TOKEN=your_auth_token_here
```

### 2. Initialize Matomo Tracker

In your root layout or app component:

```tsx
// app/layout.tsx
import { initMatomoTracker } from '@/lib/matomo';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Initialize Matomo tracker on client side
    initMatomoTracker();
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

Or use the React hook for automatic page view tracking:

```tsx
// app/layout.tsx
import { useMatomoPageViewTracking } from '@/hooks/useMatomo';

export default function RootLayout({ children }) {
  // Automatically tracks page views on route changes
  useMatomoPageViewTracking();

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

## Client-Side Tracking

### Basic Usage

```tsx
import { trackEvent, trackPageView } from '@/lib/matomo';

// Track a page view
trackPageView({
  documentTitle: 'Home Page',
  customUrl: '/home',
});

// Track a custom event
trackEvent({
  category: 'User',
  action: 'click',
  name: 'signup-button',
  value: 1,
});
```

### Using React Hook

```tsx
import { useMatomo } from '@/hooks/useMatomo';

function MyComponent() {
  const matomo = useMatomo();

  const handleSignup = () => {
    // Track event
    matomo.trackEvent({
      category: 'User',
      action: 'signup',
      name: 'free-trial',
    });
  };

  return (
    <button onClick={handleSignup}>
      Sign Up for Free Trial
    </button>
  );
}
```

### Track Goal Conversions

```tsx
import { trackGoal } from '@/lib/matomo';

function CheckoutSuccess() {
  useEffect(() => {
    // Track goal with revenue
    trackGoal({
      goalId: 1, // Configure goal in Matomo dashboard
      revenue: 29.99,
    });
  }, []);

  return <div>Thank you for your purchase!</div>;
}
```

### Track E-commerce Orders

```tsx
import { trackEcommerce } from '@/lib/matomo';

function OrderConfirmation({ order }) {
  useEffect(() => {
    trackEcommerce({
      orderId: order.id,
      revenue: order.total,
      subTotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      discount: order.discount,
      items: [
        {
          sku: 'pro-plan',
          name: 'Pro Plan Subscription',
          category: 'subscription',
          price: 29.99,
          quantity: 1,
        },
      ],
    });
  }, [order]);

  return <div>Order #{order.id} confirmed</div>;
}
```

## Server-Side Tracking

Use server-side tracking in API routes or server components for more accurate tracking.

### Track Events from API Routes

```tsx
// app/api/qr-codes/route.ts
import { serverTrackEvent } from '@/lib/matomo';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Create QR code logic...
  
  // Track event
  await serverTrackEvent(
    request.url,
    'QR Code',
    'created',
    {
      userId: session?.user?.id,
      ip: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
      name: qrCode.id,
    }
  );

  return NextResponse.json({ success: true });
}
```

### Track Page Views from Server

```tsx
import { serverTrackPageView } from '@/lib/matomo';

export async function GET(request: Request) {
  await serverTrackPageView(
    request.url,
    'Dashboard',
    {
      userId: 'user-123',
      ip: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    }
  );

  return NextResponse.json({ data: 'dashboard data' });
}
```

### Track Goals from Server

```tsx
import { serverTrackGoal } from '@/lib/matomo';

export async function POST(request: Request) {
  // Process subscription...

  await serverTrackGoal(
    request.url,
    2, // Goal ID for "Subscription Purchase"
    {
      revenue: 29.99,
      userId: session?.user?.id,
      ip: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    }
  );

  return NextResponse.json({ success: true });
}
```

## React Hooks

### useMatomo

Main hook for tracking in components:

```tsx
const matomo = useMatomo();

// Available methods:
matomo.trackPageView({ documentTitle: 'About' });
matomo.trackEvent({ category: 'Button', action: 'click' });
matomo.trackGoal({ goalId: 1 });
matomo.trackEcommerce({ orderId: '123', revenue: 99 });
matomo.setUserId('user-123');
matomo.resetUserId();
matomo.trackSiteSearch('qr code generator');
```

### useMatomoPageViewTracking

Automatically track page views on route changes:

```tsx
function App() {
  useMatomoPageViewTracking();
  return <div>App content</div>;
}
```

### useMatomoUserId

Automatically set/unset user ID based on session:

```tsx
function App() {
  const session = useSession();
  useMatomoUserId(session?.user?.id);
  
  return <div>App content</div>;
}
```

## Common Use Cases

### 1. Track QR Code Events

```tsx
import { trackQRCodeEvent } from '@/lib/matomo';

// Track QR code creation
trackQRCodeEvent('created', qrCode.id, {
  type: qrCode.type,
  plan: user.plan,
});

// Track QR code scan
trackQRCodeEvent('scanned', qrCode.id, {
  location: scan.country,
  device: scan.device,
});

// Track QR code download
trackQRCodeEvent('downloaded', qrCode.id, {
  format: 'png',
});
```

### 2. Track User Events

```tsx
import { trackUserEvent } from '@/lib/matomo';

// Track signup
trackUserEvent('signup', user.id);

// Track login
trackUserEvent('login', user.id);

// Track logout
trackUserEvent('logout', user.id);

// Track trial started
trackUserEvent('trial_started', user.id);
```

### 3. Track Subscription Events

```tsx
import { trackSubscriptionEvent } from '@/lib/matomo';

// Track subscription upgrade
trackSubscriptionEvent('upgraded', 'pro', 29.99);

// Track subscription downgrade
trackSubscriptionEvent('downgraded', 'free', 0);

// Track subscription cancellation
trackSubscriptionEvent('canceled', 'pro');

// Track subscription renewal
trackSubscriptionEvent('renewed', 'pro', 29.99);
```

### 4. Track API Usage

```tsx
import { trackAPIEvent } from '@/lib/matomo';

// Track API key creation
trackAPIEvent('key_created', apiKey.id);

// Track API request
trackAPIEvent('request_made', apiKey.id);

// Track rate limiting
trackAPIEvent('rate_limited', apiKey.id);
```

### 5. Track Site Search

```tsx
import { trackSiteSearch } from '@/lib/matomo';

function SearchBar() {
  const handleSearch = (query: string, results: any[]) => {
    trackSiteSearch(query, 'qr-codes', results.length);
  };

  return <input onSubmit={handleSearch} />;
}
```

### 6. Track Content Impressions

```tsx
import { trackContentImpression, trackContentInteraction } from '@/lib/matomo';

function Banner() {
  useEffect(() => {
    trackContentImpression('hero-banner', 'upgrade-cta', '/pricing');
  }, []);

  const handleClick = () => {
    trackContentInteraction('click', 'hero-banner', 'upgrade-cta', '/pricing');
  };

  return <button onClick={handleClick}>Upgrade Now</button>;
}
```

## API Reference

### Client-Side Functions

#### `trackPageView(params?: MatomoPageViewParams)`
Track a page view.

**Parameters:**
- `documentTitle?: string` - Page title
- `customUrl?: string` - Custom URL to track
- `userId?: string` - User ID
- `customDimensions?: Record<string, string>` - Custom dimensions

#### `trackEvent(params: MatomoEventParams)`
Track a custom event.

**Parameters:**
- `category: string` - Event category (required)
- `action: string` - Event action (required)
- `name?: string` - Event name
- `value?: number` - Event value
- `customDimensions?: Record<string, string>` - Custom dimensions

#### `trackGoal(params: MatomoGoalParams)`
Track a goal conversion.

**Parameters:**
- `goalId: number` - Goal ID from Matomo (required)
- `revenue?: number` - Revenue amount
- `customDimensions?: Record<string, string>` - Custom dimensions

#### `trackEcommerce(params: MatomoEcommerceParams)`
Track an e-commerce order.

**Parameters:**
- `orderId: string` - Order ID (required)
- `revenue: number` - Total revenue (required)
- `subTotal?: number` - Subtotal
- `tax?: number` - Tax amount
- `shipping?: number` - Shipping cost
- `discount?: number` - Discount amount
- `items: MatomoEcommerceItem[]` - Order items (required)
- `customDimensions?: Record<string, string>` - Custom dimensions

### Server-Side Functions

#### `serverTrackPageView(url, title, options?)`
Track page view from server.

#### `serverTrackEvent(url, category, action, options?)`
Track event from server.

#### `serverTrackGoal(url, goalId, options?)`
Track goal from server.

### Helper Functions

#### `trackQRCodeEvent(action, qrCodeId?, additionalData?)`
Track QR code related events.

#### `trackUserEvent(action, userId?)`
Track user related events.

#### `trackSubscriptionEvent(action, plan?, revenue?)`
Track subscription related events.

#### `trackAPIEvent(action, apiKeyId?)`
Track API related events.

## Event Categories

Use predefined categories for consistency:

```tsx
import { MatomoEventCategories } from '@/lib/matomo';

// Available categories:
MatomoEventCategories.USER          // 'User'
MatomoEventCategories.QR_CODE       // 'QR Code'
MatomoEventCategories.SUBSCRIPTION  // 'Subscription'
MatomoEventCategories.API           // 'API'
MatomoEventCategories.CONVERSION    // 'Conversion'
MatomoEventCategories.ENGAGEMENT    // 'Engagement'
MatomoEventCategories.ERROR         // 'Error'
```

## Best Practices

1. **Use Helper Functions**: Prefer `trackQRCodeEvent()`, `trackUserEvent()`, etc. for consistency.

2. **Server-Side Tracking for Sensitive Data**: Use server-side tracking for events involving payments or sensitive user data.

3. **Custom Dimensions**: Set up custom dimensions in Matomo dashboard and use them for segmentation:
   ```tsx
   trackEvent({
     category: 'QR Code',
     action: 'created',
     customDimensions: {
       '1': user.plan,        // Dimension 1: User Plan
       '2': qrCode.type,      // Dimension 2: QR Code Type
     },
   });
   ```

4. **Goal Configuration**: Configure goals in Matomo dashboard first, then track them in code.

5. **Privacy**: Respect user privacy and comply with GDPR/privacy regulations when tracking.

6. **Testing**: Use Matomo's debug mode to verify tracking is working correctly.

## Troubleshooting

### Events not showing up?

1. Check environment variables are set correctly
2. Verify Matomo instance URL is accessible
3. Check browser console for errors
4. Enable Matomo debug mode in dashboard

### Server-side tracking not working?

1. Verify `MATOMO_AUTH_TOKEN` is set
2. Check auth token has proper permissions in Matomo
3. Verify server can reach Matomo instance URL

### Page views not tracked automatically?

1. Ensure `useMatomoPageViewTracking()` is called in root layout
2. Check Next.js App Router navigation is working
3. Verify Matomo tracker is initialized

## Additional Resources

- [Matomo Documentation](https://developer.matomo.org/)
- [Matomo JavaScript Tracker API](https://developer.matomo.org/api-reference/tracking-javascript)
- [Matomo HTTP API](https://developer.matomo.org/api-reference/tracking-api)

