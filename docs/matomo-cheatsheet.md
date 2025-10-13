# Matomo Tracking Cheat Sheet

Quick reference for common Matomo tracking patterns in TheQRCode.io

## Setup

```tsx
// 1. Add to .env.local
NEXT_PUBLIC_MATOMO_URL=https://matomo.yourdomain.com
NEXT_PUBLIC_MATOMO_SITE_ID=1
MATOMO_AUTH_TOKEN=your_token

// 2. Wrap app with provider (app/layout.tsx)
import MatomoProvider from '@/components/MatomoProvider';

export default function RootLayout({ children }) {
  return (
    <MatomoProvider autoTrackPageViews={true}>
      {children}
    </MatomoProvider>
  );
}
```

## Client-Side Tracking

### Basic Hook Usage

```tsx
import { useMatomo } from '@/hooks/useMatomo';

function MyComponent() {
  const matomo = useMatomo();
  
  // Use matomo.trackEvent(), matomo.trackPageView(), etc.
}
```

### Page Views

```tsx
// Automatic (using MatomoProvider)
<MatomoProvider autoTrackPageViews={true} />

// Manual
trackPageView({ documentTitle: 'About Us' });
```

### Events

```tsx
// Basic event
matomo.trackEvent({
  category: 'Button',
  action: 'click',
  name: 'signup-button',
});

// Event with value
matomo.trackEvent({
  category: 'Video',
  action: 'watch',
  name: 'tutorial-video',
  value: 120, // seconds watched
});

// Event with custom dimensions
matomo.trackEvent({
  category: 'QR Code',
  action: 'created',
  name: qrCode.id,
  customDimensions: {
    '1': user.plan,
    '2': qrCode.type,
  },
});
```

### Goals

```tsx
// Simple goal
matomo.trackGoal({ goalId: 1 });

// Goal with revenue
matomo.trackGoal({
  goalId: 2,
  revenue: 29.99,
});

// Goal with custom dimensions
matomo.trackGoal({
  goalId: 3,
  revenue: 99.99,
  customDimensions: {
    '1': 'business',
  },
});
```

### E-commerce

```tsx
matomo.trackEcommerce({
  orderId: 'order-123',
  revenue: 29.99,
  subTotal: 29.99,
  tax: 0,
  shipping: 0,
  discount: 5.00,
  items: [{
    sku: 'pro-plan',
    name: 'Pro Plan Monthly',
    category: 'subscription',
    price: 29.99,
    quantity: 1,
  }],
});
```

### Site Search

```tsx
matomo.trackSiteSearch(
  'qr code generator',  // keyword
  'all',                // category
  42                    // results count
);
```

### User ID

```tsx
// Set user ID (on login)
matomo.setUserId('user-123');

// Reset user ID (on logout)
matomo.resetUserId();

// Automatic (using hook)
useMatomoUserId(session?.user?.id);
```

## Server-Side Tracking

### Events from API Routes

```tsx
import { serverTrackEvent } from '@/lib/matomo';

export async function POST(request: Request) {
  await serverTrackEvent(
    request.url,
    'QR Code',
    'created',
    {
      userId: session?.user?.id,
      ip: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    }
  );
}
```

### Goals from API Routes

```tsx
import { serverTrackGoal } from '@/lib/matomo';

await serverTrackGoal(
  request.url,
  1, // goal ID
  {
    revenue: 29.99,
    userId: session?.user?.id,
    ip: request.headers.get('x-forwarded-for') || undefined,
    userAgent: request.headers.get('user-agent') || undefined,
  }
);
```

### Page Views from Server

```tsx
import { serverTrackPageView } from '@/lib/matomo';

await serverTrackPageView(
  request.url,
  'Dashboard',
  {
    userId: session?.user?.id,
    ip: request.headers.get('x-forwarded-for') || undefined,
    userAgent: request.headers.get('user-agent') || undefined,
  }
);
```

## Helper Functions

### QR Code Events

```tsx
import { trackQRCodeEvent } from '@/lib/matomo';

// Created
trackQRCodeEvent('created', qrCode.id, { type: 'url' });

// Scanned
trackQRCodeEvent('scanned', qrCode.id, { device: 'mobile' });

// Updated
trackQRCodeEvent('updated', qrCode.id);

// Deleted
trackQRCodeEvent('deleted', qrCode.id);

// Downloaded
trackQRCodeEvent('downloaded', qrCode.id, { format: 'png' });
```

### User Events

```tsx
import { trackUserEvent } from '@/lib/matomo';

// Signup
trackUserEvent('signup', user.id);

// Login
trackUserEvent('login', user.id);

// Logout
trackUserEvent('logout', user.id);

// Profile update
trackUserEvent('profile_update', user.id);

// Trial started
trackUserEvent('trial_started', user.id);
```

### Subscription Events

```tsx
import { trackSubscriptionEvent } from '@/lib/matomo';

// Upgraded
trackSubscriptionEvent('upgraded', 'pro', 29.99);

// Downgraded
trackSubscriptionEvent('downgraded', 'free', 0);

// Canceled
trackSubscriptionEvent('canceled', 'pro');

// Renewed
trackSubscriptionEvent('renewed', 'pro', 29.99);
```

### API Events

```tsx
import { trackAPIEvent } from '@/lib/matomo';

// Key created
trackAPIEvent('key_created', apiKey.id);

// Request made
trackAPIEvent('request_made', apiKey.id);

// Rate limited
trackAPIEvent('rate_limited', apiKey.id);
```

## Event Categories

```tsx
import { MatomoEventCategories } from '@/lib/matomo';

MatomoEventCategories.USER          // 'User'
MatomoEventCategories.QR_CODE       // 'QR Code'
MatomoEventCategories.SUBSCRIPTION  // 'Subscription'
MatomoEventCategories.API           // 'API'
MatomoEventCategories.CONVERSION    // 'Conversion'
MatomoEventCategories.ENGAGEMENT    // 'Engagement'
MatomoEventCategories.ERROR         // 'Error'
```

## Common Patterns

### Button Click

```tsx
<button onClick={() => {
  matomo.trackEvent({
    category: 'Button',
    action: 'click',
    name: 'create-qr-code',
  });
  // ... your logic
}}>
  Create QR Code
</button>
```

### Form Submission

```tsx
const handleSubmit = async (data) => {
  matomo.trackEvent({
    category: 'Form',
    action: 'submit',
    name: 'signup-form',
  });
  
  // Submit form...
  const result = await submitForm(data);
  
  if (result.success) {
    matomo.trackGoal({ goalId: 1 });
  }
};
```

### Error Tracking

```tsx
try {
  await riskyOperation();
} catch (error) {
  matomo.trackEvent({
    category: 'Error',
    action: 'operation_failed',
    name: error.message,
  });
  throw error;
}
```

### Feature Usage

```tsx
useEffect(() => {
  matomo.trackEvent({
    category: 'Feature',
    action: 'viewed',
    name: 'qr-code-editor',
  });
}, []);
```

### Export/Download

```tsx
const handleExport = () => {
  matomo.trackEvent({
    category: 'Data',
    action: 'export',
    name: 'csv',
  });
  
  exportToCSV(data);
};
```

## React Hooks

```tsx
// Main hook
const matomo = useMatomo();

// Auto page view tracking
useMatomoPageViewTracking();

// Auto user ID tracking
useMatomoUserId(session?.user?.id);

// Context (if needed)
const { isInitialized, config } = useMatomoContext();
```

## Debugging

```tsx
// Enable debug mode
<MatomoProvider debug={true}>
  {children}
</MatomoProvider>

// Check console for:
// ✅ "Matomo page view tracked"
// ✅ "Matomo event tracked"
// ❌ "Matomo not initialized"

// Check Network tab for:
// - matomo.js (script loaded)
// - matomo.php (tracking requests)
```

## Custom Dimensions

```tsx
// In Matomo: Settings > Custom Dimensions
// Create dimensions first, then use them:

// Dimension 1: User Plan
// Dimension 2: QR Code Type
// Dimension 3: Device Type
// Dimension 4: Country
// Dimension 5: Custom Value

matomo.trackEvent({
  category: 'Event',
  action: 'action',
  customDimensions: {
    '1': 'pro',
    '2': 'url',
    '3': 'mobile',
    '4': 'USA',
    '5': 'custom-value',
  },
});
```

## Goals Setup

```tsx
// In Matomo: Settings > Goals

// Example Goals:
// Goal 1: User Signup
// Goal 2: Subscription Purchase
// Goal 3: First QR Code Created
// Goal 4: API Key Created
// Goal 5: Milestone Reached
// Goal 6: First Scan Received

// Then track them:
matomo.trackGoal({ goalId: 1 }); // User Signup
matomo.trackGoal({ goalId: 2, revenue: 29.99 }); // Purchase
```

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| "Matomo not initialized" | Check env vars, restart dev server |
| "Tracker not available" | Ensure MatomoProvider wraps app |
| Events not showing | Check Network tab, verify Matomo URL |
| Server tracking fails | Verify MATOMO_AUTH_TOKEN is set |
| CORS errors | Add domain to Matomo trusted domains |

## Quick Test

```bash
# 1. Set env vars in .env.local
# 2. Restart dev server
# 3. Open app in browser
# 4. Check Matomo dashboard: Visitors > Real-time
# 5. You should see your visit!
```

## Performance Tips

```tsx
// ✅ DO: Track important events
matomo.trackEvent({ category: 'Purchase', action: 'completed' });

// ✅ DO: Batch similar events
const events = [...items.map(item => 
  () => matomo.trackEvent({ category: 'Item', action: 'viewed', name: item.id })
)];

// ❌ DON'T: Track every mouse move
// ❌ DON'T: Track in tight loops
// ❌ DON'T: Track PII (emails, passwords, etc.)
```

## Full Example

```tsx
'use client';

import { useMatomo } from '@/hooks/useMatomo';
import { useState } from 'react';

export function QRCodeGenerator() {
  const matomo = useMatomo();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/qr-codes', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com' }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Track success
        matomo.trackQRCodeEvent('created', data.qrCode.id);
        matomo.trackGoal({ goalId: 3 });
      }
    } catch (error) {
      // Track error
      matomo.trackEvent({
        category: 'Error',
        action: 'qr_creation_failed',
        name: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCreate} disabled={loading}>
      {loading ? 'Creating...' : 'Create QR Code'}
    </button>
  );
}
```

## Resources

- 📖 [Quick Start](./matomo-quickstart.md)
- 📖 [Full Guide](./matomo-integration.md)
- 📖 [Examples](./matomo-examples.tsx)
- 🌐 [Matomo Docs](https://matomo.org/docs/)

