# Matomo Analytics - Clean Implementation

## ✅ Production Ready

Clean, minimal Matomo integration that tracks page views automatically and provides manual tracking functions for events, goals, and e-commerce.

## 📦 What's Installed

### Core Files (6)
1. `src/app/layout.tsx` - Inline tracking script in `<head>`
2. `src/lib/matomo.ts` - Core tracking functions
3. `src/hooks/useMatomo.ts` - React hook for components
4. `src/components/MatomoPageTracker.tsx` - Auto route tracking
5. `src/components/MatomoUserTracking.tsx` - Auto user ID tracking
6. `src/types/matomo.d.ts` - TypeScript declarations

### Documentation (8)
1. `docs/MATOMO_README.md` - Start here
2. `docs/matomo-quickstart.md` - 5-minute setup
3. `docs/matomo-integration.md` - Full guide
4. `docs/matomo-cheatsheet.md` - Quick reference
5. `docs/matomo-examples.tsx` - Code examples
6. `docs/matomo-scan-tracking-example.ts` - Scan example
7. `docs/MATOMO_SUMMARY.md` - Overview
8. `docs/MATOMO_FILES.md` - File list

## 🎯 What Gets Tracked Automatically

✅ All page views (including route changes)  
✅ User sessions  
✅ User IDs (when logged in)  
✅ Link clicks  
✅ Time on page  
✅ Device & browser info  
✅ Geographic location (via Matomo)

## 🔧 Configuration

Already configured in `docker-compose.yml`:

**Production:**
- Site ID: 4
- URL: https://matomo.redbudway.com

**Dev:**
- Site ID: 3
- URL: https://matomo.redbudway.com

## 📝 Usage Examples

### Track Event
```tsx
import { useMatomo } from '@/hooks/useMatomo';

const matomo = useMatomo();
matomo.trackEvent({
  category: 'Button',
  action: 'click',
  name: 'upgrade'
});
```

### Track QR Code Event
```tsx
import { trackQRCodeEvent } from '@/lib/matomo';

trackQRCodeEvent('created', qrCode.id);
```

### Track from API
```tsx
import { serverTrackEvent } from '@/lib/matomo';

await serverTrackEvent(
  request.url,
  'QR Code',
  'created',
  { userId: session?.user?.id }
);
```

## 🚀 Deploy

```bash
cd ~
docker compose up -d --build theqrcode
```

## ✅ Verify

Visit: https://matomo.redbudway.com  
Go to: **Visitors > Real-time**  
See: Your visits appearing!

## 📖 Documentation

**New to Matomo?** → `docs/matomo-quickstart.md`  
**Need examples?** → `docs/matomo-examples.tsx`  
**Quick reference?** → `docs/matomo-cheatsheet.md`  
**Full API docs?** → `docs/matomo-integration.md`

## ✨ Clean Code

- No debug logging in production
- Minimal console output
- Optimized bundle size
- Production-ready code

## 🎉 Status

**Active & Working** - Tracking all visits silently and efficiently!

