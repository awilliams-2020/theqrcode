# Notification System Architecture

## Overview

The application has **TWO SEPARATE** notification systems, each serving different purposes:

## 1. Navbar Notification Bell (General Notifications)

**Component:** `src/components/NotificationBell.tsx`  
**Location:** Top navigation bar (always visible)  
**Purpose:** General engagement and system notifications

### Notification Types Displayed:
- ✅ `usage_alert` - General usage alerts
- ✅ `plan_limit` - Plan limit warnings
- ✅ `milestone` - QR code creation milestones
- ✅ `tip` - Usage tips and suggestions
- ✅ `update` - System updates and announcements

### Features:
- 60-second polling interval
- Displays in navbar (desktop & mobile)
- Permanent visibility across all pages
- Fetches: `GET /api/notifications?category=general`

### Implementation:
```tsx
// Fetches only general notifications
const res = await fetch('/api/notifications?category=general')
```

---

## 2. Real-Time Analytics Notification Bell

**Component:** `src/components/LiveNotifications.tsx`  
**Location:** Real-time Analytics dashboard only  
**Purpose:** Real-time analytics insights and performance alerts

### Notification Types Displayed:
- 🚀 `analytics_spike` - Traffic spike alerts
- 🌍 `analytics_location` - New country/location scans
- 📱 `analytics_trend` - Device usage trends
- 📊 `analytics_summary` - Hourly/daily summaries
- 🏆 `analytics_record` - Performance record achievements

### Features:
- 5-second polling interval (faster refresh)
- Only visible on Real-Time Analytics page
- Integrated with analytics dashboard
- Fetches: `GET /api/notifications?category=analytics`
- Access restricted to Pro/Business plans

### Implementation:
```tsx
// In useRealtimePolling hook
const fetchAnalyticsNotifications = async () => {
  const response = await fetch('/api/notifications?category=analytics')
  // ... process notifications
}
```

---

## API Endpoints

### GET /api/notifications

**Parameters:**
- `category` (optional): `'general'` | `'analytics'`
- `unreadOnly` (optional): `boolean`

**Response:**
```json
{
  "success": true,
  "notifications": [...],
  "unreadCount": 5
}
```

### Filtering Logic

**File:** `src/lib/engagement/notifications.ts`

```typescript
export async function getUserNotifications(
  userId: string, 
  unreadOnly = false, 
  category?: string | null
) {
  const analyticsTypes = [
    'analytics_spike', 
    'analytics_location', 
    'analytics_trend', 
    'analytics_summary', 
    'analytics_record'
  ]
  
  const generalTypes = [
    'usage_alert', 
    'plan_limit', 
    'milestone', 
    'tip', 
    'update'
  ]
  
  // Filter by category if specified
  if (category === 'analytics') {
    return notifications.where({ type: { in: analyticsTypes } })
  } else if (category === 'general') {
    return notifications.where({ type: { in: generalTypes } })
  }
  
  // Return all if no category specified
  return allNotifications
}
```

---

## Visual Differences

### Navbar Bell
```
┌─────────────────────────────────┐
│  Logo  Dashboard  Analytics  🔔3 │  ← Navbar (always visible)
└─────────────────────────────────┘
        Opens dropdown with:
        - Usage alerts
        - Plan limits
        - Tips
        - Milestones
        - Updates
```

### Real-Time Analytics Bell
```
┌─────────────────────────────────────┐
│ Real-time Analytics    [Live] 🔔5   │  ← Only on Analytics page
├─────────────────────────────────────┤
│ Live Scan Counter                    │
│ Activity Feed                        │
│ Charts                               │
└─────────────────────────────────────┘
        Opens dropdown with:
        - 🚀 Traffic spikes
        - 🌍 New locations
        - 📱 Device trends
        - 📊 Summaries
        - 🏆 Records
```

---

## Why Two Separate Systems?

### 1. **Different Contexts**
- **Navbar:** General notifications relevant anywhere in the app
- **Analytics:** Performance insights relevant only when viewing analytics

### 2. **Different Refresh Rates**
- **Navbar:** 60-second polling (efficient for general notifications)
- **Analytics:** 5-second polling (real-time for analytics insights)

### 3. **Different Audiences**
- **Navbar:** All authenticated users
- **Analytics:** Pro/Business plan users only

### 4. **Different Priorities**
- **Navbar:** Action-required notifications (limits, updates)
- **Analytics:** Performance insights (informational, celebratory)

---

## Notification Flow

### Creating Analytics Notifications

```typescript
// After a scan is recorded
import { runAnalyticsChecks } from '@/lib/engagement/analytics-notifications'

runAnalyticsChecks(userId, qrCodeId, {
  device: deviceInfo.device,
  browser: deviceInfo.browser,
  os: deviceInfo.os,
  country: locationInfo.country,
  city: locationInfo.city
}).catch(err => {
  console.error('Failed to run analytics checks:', err)
})
```

### Notification Created → Database

```
runAnalyticsChecks()
  ↓
detectScanSpike() / notifyNewLocation() / etc.
  ↓
createNotification({
  userId,
  type: 'analytics_spike',  ← Analytics type
  title: '🚀 Traffic Spike!',
  message: 'Your QR code is trending!',
  priority: 'high'
})
  ↓
Saved to database
```

### Notification Appears → UI

```
Database
  ↓
API: GET /api/notifications?category=analytics
  ↓
useRealtimePolling hook (every 5 seconds)
  ↓
LiveNotifications component
  ↓
User sees notification in Real-Time Analytics Bell 🔔
```

---

## Testing

### Test Navbar Bell (General)
```bash
# Create a general notification
curl -X POST http://localhost:3000/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "tip",
    "title": "Pro Tip",
    "message": "Test general notification"
  }'

# Should appear in navbar bell
```

### Test Analytics Bell (Real-Time)
```bash
# Scan a QR code multiple times rapidly
# Should trigger analytics notifications like:
# - Traffic spike detection
# - High-velocity alerts
# - New location alerts

# Check analytics bell on /analytics page
```

---

## Migration Notes

### Before
- All notifications appeared in navbar bell
- Analytics notifications cluttered the general notification area
- No separation between engagement and analytics insights

### After
- ✅ General notifications in navbar (usage, limits, tips)
- ✅ Analytics notifications in Real-Time Analytics bell
- ✅ Clean separation of concerns
- ✅ Appropriate polling rates for each context
- ✅ Better user experience

---

## Configuration

### Polling Intervals

**Navbar Bell:**
```tsx
// src/components/NotificationBell.tsx
const interval = setInterval(fetchNotifications, 60000) // 60 seconds
```

**Analytics Bell:**
```tsx
// src/hooks/useRealtimePolling.ts
const notificationInterval = setInterval(
  fetchAnalyticsNotifications, 
  5000 // 5 seconds for real-time feel
)
```

### Access Control

**Navbar Bell:** All authenticated users

**Analytics Bell:** Pro/Business plans only
```tsx
const hasRealtimeAccess = 
  (isTrialActive && (userPlan === 'pro' || userPlan === 'business')) || 
  (subscriptionStatus === 'active' && (userPlan === 'pro' || userPlan === 'business'))
```

---

## Summary

| Feature | Navbar Bell | Analytics Bell |
|---------|-------------|----------------|
| **Component** | NotificationBell.tsx | LiveNotifications.tsx |
| **Location** | Top navbar (all pages) | Analytics page only |
| **Types** | usage_alert, plan_limit, milestone, tip, update | analytics_spike, analytics_location, analytics_trend, analytics_summary, analytics_record |
| **Polling** | 60 seconds | 5 seconds |
| **Access** | All users | Pro/Business plans |
| **Purpose** | General engagement | Performance insights |
| **API** | `/api/notifications?category=general` | `/api/notifications?category=analytics` |

---

**Status:** ✅ Complete and Production Ready  
**Implementation Date:** October 2025  
**Breaking Changes:** None - backward compatible

