# Matomo Analytics Integration

Clean, production-ready Matomo analytics for TheQRCode.io with automatic page view tracking and manual event tracking.

## ✅ What's Implemented

### Automatic Tracking
- ✅ Page views on all routes
- ✅ User sessions
- ✅ User IDs (when logged in)
- ✅ Link tracking
- ✅ Time on page (heartbeat)

### Manual Tracking
- ✅ Custom events
- ✅ Goal conversions
- ✅ E-commerce orders
- ✅ Site searches
- ✅ Content tracking

## 🚀 Quick Start

### Configuration
Environment variables already set in `docker-compose.yml`:
- `NEXT_PUBLIC_MATOMO_URL=https://matomo.redbudway.com`
- `NEXT_PUBLIC_MATOMO_SITE_ID=4` (production) / `3` (dev)

### Usage

**Track events in components:**
```tsx
import { useMatomo } from '@/hooks/useMatomo';

function MyComponent() {
  const matomo = useMatomo();
  
  matomo.trackEvent({
    category: 'Button',
    action: 'click',
    name: 'upgrade'
  });
}
```

**Track from API routes:**
```tsx
import { serverTrackEvent } from '@/lib/matomo';

await serverTrackEvent(
  request.url,
  'QR Code',
  'created',
  { userId: session?.user?.id }
);
```

**Helper functions:**
```tsx
import { 
  trackQRCodeEvent,
  trackUserEvent,
  trackSubscriptionEvent 
} from '@/lib/matomo';

trackQRCodeEvent('created', qrCodeId);
trackUserEvent('signup', userId);
trackSubscriptionEvent('upgraded', 'pro', 29.99);
```

## 📁 Core Files

1. **`src/app/layout.tsx`** - Inline tracking script
2. **`src/lib/matomo.ts`** - Core tracking functions
3. **`src/hooks/useMatomo.ts`** - React hooks
4. **`src/components/MatomoPageTracker.tsx`** - Route tracking
5. **`src/components/MatomoUserTracking.tsx`** - User ID tracking
6. **`src/types/matomo.d.ts`** - TypeScript types

## 📚 Documentation

- **Quick Start**: `matomo-quickstart.md`
- **Full Guide**: `matomo-integration.md`
- **Cheat Sheet**: `matomo-cheatsheet.md`
- **Examples**: `matomo-examples.tsx`
- **Files List**: `MATOMO_FILES.md`
- **Summary**: `MATOMO_SUMMARY.md`

## 📊 Verify Tracking

Check Matomo dashboard:
- Visit: https://matomo.redbudway.com
- Go to: **Visitors > Real-time**
- See visits appear in real-time

## 🎯 Common Use Cases

```tsx
// Track QR code creation
trackQRCodeEvent('created', qrCode.id, { type: qrCode.type });

// Track user signup
trackUserEvent('signup', user.id);
trackGoal({ goalId: 1 });

// Track subscription purchase
trackSubscriptionEvent('upgraded', 'pro', 29.99);
trackEcommerce({
  orderId: order.id,
  revenue: 29.99,
  items: [{ sku: 'pro-plan', name: 'Pro Plan', price: 29.99, quantity: 1 }]
});

// Track from API route
await serverTrackEvent(
  request.url,
  'API',
  'called',
  {
    userId: session?.user?.id,
    ip: request.headers.get('x-forwarded-for') || undefined,
    userAgent: request.headers.get('user-agent') || undefined
  }
);
```

## 🔧 Configuration

**Production:**
- Site ID: 4
- URL: https://matomo.redbudway.com

**Development:**
- Site ID: 3  
- URL: https://matomo.redbudway.com

## ✨ Status

**Production Ready** - Tracking is active and working silently.

For detailed documentation, see the files in `/docs/`.

