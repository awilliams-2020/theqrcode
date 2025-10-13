# Real-Time Analytics Notifications System

## Overview

A comprehensive real-time analytics notification system that automatically monitors QR code performance and sends intelligent notifications to users through the notification bell. This system helps users stay informed about their QR code performance without constantly checking the dashboard.

## Features

### 1. Traffic Spike Detection 🚀

Automatically detects when QR codes experience sudden traffic increases.

**Trigger Conditions:**
- Recent scans (last hour) are 3x or more than weekly average
- Minimum 10 scans to avoid false positives
- Calculates percentage increase over average

**Notification Details:**
- **Type:** `analytics_spike`
- **Priority:** `high`
- **Icon:** 🚀
- **Message Format:** "QR Code Name received X scans in the last hour (Y% above average). Great job!"

**Example:**
```
🚀 Traffic Spike Detected!
"Summer Sale 2025" received 45 scans in the last hour (325% above average). Great job!
```

### 2. New Location Alerts 🌍

Notifies when QR codes are scanned from new countries.

**Trigger Conditions:**
- First scan from a specific country for a QR code
- Excludes scans from the last 5 minutes (to detect truly new locations)
- Tracks total unique countries

**Notification Details:**
- **Type:** `analytics_location`
- **Priority:** `normal`
- **Icon:** 🌍
- **Message Format:** "QR Code was just scanned in City, Country! That's country #X for this QR code."

**Example:**
```
🌍 New Location Detected!
"Product Demo" was just scanned in Tokyo, Japan! That's country #12 for this QR code.
```

### 3. Device Trend Insights 📱

Analyzes device usage patterns and provides optimization suggestions.

**Trigger Conditions:**
- Minimum 20 scans in last 24 hours for meaningful data
- Strong trend detected (≥70% from one device type OR ≥30% tablets)
- Calculates mobile, desktop, and tablet percentages

**Notification Details:**
- **Type:** `analytics_trend`
- **Priority:** `low`
- **Icon:** 📱
- **Message Examples:**
  - "📱 85% of your scans are from mobile devices! Your QR codes are perfect for on-the-go users."
  - "💻 72% of your scans are from desktop devices! Consider optimizing for larger screens."
  - "📲 35% of your scans are from tablets! You have a diverse audience."

### 4. High-Velocity Scanning ⚡

Immediate alerts during extremely high-traffic periods.

**Trigger Conditions:**
- 50+ scans in 5 minutes
- 100+ scans in 5 minutes
- 200+ scans in 5 minutes
- Prevents duplicate alerts (10-minute cooldown)

**Notification Details:**
- **Type:** `analytics_spike`
- **Priority:** `urgent`
- **Icon:** ⚡
- **Messages:**
  - "⚡ Incredible! 50+ scans in 5 minutes!"
  - "🔥 Amazing! 100+ scans in 5 minutes!"
  - "🚀 Phenomenal! 200+ scans in 5 minutes! You're trending!"

### 5. Performance Records 🏆

Celebrates new hourly and daily scan records.

**Trigger Conditions:**
- Current period scans exceed all historical records
- Minimum 10 scans to qualify as a record
- Tracks both hourly and daily records
- Uses sliding window analysis for accuracy

**Notification Details:**
- **Type:** `analytics_record`
- **Priority:** `high`
- **Icon:** 🏆
- **Message Format:** "QR Code just hit a new record: X scans in the last hour/day! Your best performance yet."

**Example:**
```
🏆 New Performance Record!
"Event Tickets" just hit a new record: 127 scans in the last hour! Your best performance yet.
```

### 6. Hourly Analytics Summary ⏱️

Active period summaries for busy times.

**Trigger Conditions:**
- Minimum 5 scans in the last hour
- Automatically sent when activity threshold is met
- Groups data by QR code and location

**Notification Details:**
- **Type:** `analytics_summary`
- **Priority:** `normal`
- **Icon:** 📊
- **Message Format:** "You received X scans in the last hour from Y countries. Top performer: QR Code (Z scans)"

### 7. Daily Analytics Digest 📊

End-of-day performance summary with trends.

**Trigger Conditions:**
- At least 1 scan during the day
- Runs automatically via cron job
- Compares with previous day for trends

**Notification Details:**
- **Type:** `analytics_summary`
- **Priority:** `normal`
- **Icon:** 📊
- **Includes:**
  - Total scans today
  - Number of countries
  - Percentage change from yesterday
  - Trend indicator (📈 increase, 📉 decrease, ➡️ same)

**Example:**
```
📊 Daily Analytics Digest
📈 145 scans today from 8 countries. 23% increase from yesterday.
```

## Integration

### Automatic Triggers

All analytics checks run automatically after each scan via the tracking endpoint:

```typescript
// src/app/api/track/[shortCode]/route.ts

import { runAnalyticsChecks } from '@/lib/engagement/analytics-notifications'

// After recording a scan
runAnalyticsChecks(qrCode.userId, qrCode.id, {
  device: deviceInfo.device,
  browser: deviceInfo.browser,
  os: deviceInfo.os,
  country: locationInfo.country,
  city: locationInfo.city
}).catch(err => {
  console.error('Failed to run analytics checks:', err)
})
```

### Manual Triggers

Users can manually trigger specific checks via API:

```typescript
// Check for traffic spikes
POST /api/analytics/notifications
{
  "action": "check_spike",
  "qrCodeId": "optional-qr-code-id"
}

// Check device trends
POST /api/analytics/notifications
{
  "action": "check_trend",
  "qrCodeId": "optional-qr-code-id"
}

// Send hourly summary
POST /api/analytics/notifications
{
  "action": "send_hourly_summary"
}

// Send daily digest
POST /api/analytics/notifications
{
  "action": "send_daily_digest"
}
```

### Cron Jobs

Daily analytics summaries are sent automatically:

```typescript
// src/lib/engagement/cron-jobs.ts

import { sendPeriodicAnalyticsSummaries } from './analytics-notifications'

export async function dailyEngagementTasks() {
  // ... other tasks
  
  // Send daily analytics summaries to active users
  await sendPeriodicAnalyticsSummaries()
  console.log('✓ Analytics summaries sent')
}
```

## Notification Bell Display

All analytics notifications appear in the standard notification bell component with appropriate icons and colors:

```tsx
// src/components/NotificationBell.tsx

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'analytics_spike': return '🚀'
    case 'analytics_location': return '🌍'
    case 'analytics_trend': return '📱'
    case 'analytics_summary': return '📊'
    case 'analytics_record': return '🏆'
    // ... other types
  }
}
```

### Notification Types

The notification system supports these analytics-specific types:

- `analytics_spike` - Traffic spikes and high-velocity scanning
- `analytics_location` - New geographic locations
- `analytics_trend` - Device usage patterns
- `analytics_summary` - Hourly and daily summaries
- `analytics_record` - Performance records and milestones

## API Endpoints

### GET /api/analytics/notifications

Trigger analytics checks for the current user.

**Query Parameters:**
- `type` - Check type: `spike`, `trend`, `hourly`, `daily`, or `all` (default)

**Response:**
```json
{
  "success": true,
  "results": {
    "spikeDetection": {
      "spikeDetected": true,
      "recentScans": 45,
      "averageHourlyScans": 10,
      "percentageIncrease": 350
    },
    "deviceTrend": {
      "trendDetected": true,
      "distribution": {
        "mobile": 85,
        "desktop": 12,
        "tablet": 3
      }
    }
  }
}
```

### POST /api/analytics/notifications

Manually trigger specific analytics notifications.

**Request Body:**
```json
{
  "action": "check_spike" | "check_trend" | "send_hourly_summary" | "send_daily_digest",
  "qrCodeId": "optional-qr-code-id"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    // Action-specific result data
  }
}
```

## Performance Considerations

### Non-Blocking Execution

All analytics checks run asynchronously and don't block scan recording:

```typescript
runAnalyticsChecks(userId, qrCodeId, scanData).catch(err => {
  console.error('Failed to run analytics checks:', err)
})
```

### Intelligent Thresholds

- **Minimum scan counts** prevent false positives
- **Time-based windows** ensure meaningful comparisons
- **Cooldown periods** prevent notification spam
- **Parallel execution** optimizes performance

### Database Efficiency

- Uses aggregation queries for performance
- Leverages database indexes
- Minimizes full table scans
- Caches frequent calculations

## Customization

### Adjust Thresholds

Modify thresholds in `analytics-notifications.ts`:

```typescript
// Spike detection sensitivity
const spikeMultiplier = 3 // Default: 3x average
const minimumScans = 10   // Minimum scans to detect spike

// Device trend threshold
const strongTrendPercentage = 70  // Default: 70%
const tabletTrendPercentage = 30  // Default: 30%

// Velocity alert thresholds
const velocityThresholds = [
  { scans: 50, message: '⚡ Incredible! 50+ scans in 5 minutes!' },
  { scans: 100, message: '🔥 Amazing! 100+ scans in 5 minutes!' },
  { scans: 200, message: '🚀 Phenomenal! 200+ scans in 5 minutes!' }
]
```

### Custom Notification Types

Add new notification types:

1. Add type to `NotificationData` interface:
```typescript
// src/lib/engagement/notifications.ts
type: 'usage_alert' | 'plan_limit' | 'milestone' | 'tip' | 'update' | 
      'analytics_spike' | 'analytics_location' | 'analytics_trend' | 
      'analytics_summary' | 'analytics_record' | 'your_custom_type'
```

2. Add icon mapping:
```typescript
// src/components/NotificationBell.tsx
case 'your_custom_type': return '🎯'
```

3. Create notification function:
```typescript
// src/lib/engagement/analytics-notifications.ts
export async function notifyYourCustomEvent(userId: string, data: any) {
  await createNotification({
    userId,
    type: 'your_custom_type',
    title: 'Custom Event',
    message: 'Your custom message',
    actionUrl: '/dashboard',
    priority: 'normal',
  })
}
```

## Best Practices

### For Developers

1. **Always use non-blocking calls** - Don't await analytics checks in critical paths
2. **Set appropriate thresholds** - Avoid notification fatigue
3. **Test with real data** - Validate thresholds with production-like data
4. **Monitor performance** - Track analytics check execution times
5. **Handle errors gracefully** - Don't fail scans due to analytics errors

### For Users

1. **Check notifications regularly** - Stay informed about your QR code performance
2. **Act on insights** - Use device trends to optimize content
3. **Celebrate milestones** - Share achievements with your team
4. **Monitor spikes** - Investigate unexpected traffic patterns
5. **Track global reach** - Leverage location data for marketing

## Troubleshooting

### Notifications Not Appearing

1. Check notification bell polling (60-second interval)
2. Verify user authentication
3. Check database for notification records
4. Review analytics check execution logs

### False Spike Detections

1. Increase minimum scan threshold
2. Adjust spike multiplier
3. Extend historical comparison window
4. Check for bot traffic

### Performance Issues

1. Review database query performance
2. Check index coverage
3. Monitor analytics check execution time
4. Consider caching frequent calculations

## Future Enhancements

- [ ] User preferences for notification frequency
- [ ] Custom threshold configuration per user
- [ ] Email digest option for analytics summaries
- [ ] A/B testing performance comparisons
- [ ] Predictive analytics and forecasting
- [ ] Anomaly detection using machine learning
- [ ] Browser-specific insights
- [ ] Time-of-day optimization recommendations
- [ ] Competitor benchmarking
- [ ] Export analytics notifications to CSV/PDF

## Support

For questions or issues with analytics notifications:
- Review the main engagement system docs: `ENGAGEMENT_SYSTEM.md`
- Check the integration map: `INTEGRATION_MAP.md`
- Contact the development team

---

**Version:** 1.0  
**Last Updated:** October 2025  
**Author:** TheQRCode.io Development Team

