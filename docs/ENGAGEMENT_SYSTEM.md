# User Engagement System - TheQRCode.io

## Overview

A comprehensive user engagement system with email marketing automation, notifications, announcements, and feedback collection.

## Features Implemented

### 1. Email Marketing Automation ✅

**Location:** `src/lib/engagement/email-automation.ts`, `src/lib/engagement/email-templates.ts`

**Templates Available:**
- Welcome email for new users
- Trial ending reminders (3 days before expiration)
- Monthly usage insights with statistics
- Feature announcements
- Re-engagement emails for inactive users (30+ days)

**Key Functions:**
```typescript
- sendWelcomeEmail(userId: string)
- sendTrialEndingReminders()
- sendMonthlyInsights()
- sendReEngagementEmails()
- sendEmailCampaign(campaignId: string)
```

**Database Tables:**
- `EmailCampaign` - Campaign management with scheduling
- `EmailLog` - Email delivery tracking with open/click metrics

### 2. Usage Notifications & Insights ✅

**Location:** `src/lib/engagement/notifications.ts`, `src/components/NotificationBell.tsx`

**Notification Types:**
- `usage_alert` - General usage alerts
- `plan_limit` - Approaching plan limits (80%+ usage)
- `milestone` - Achievement celebrations (100, 500, 1K, 5K, 10K scans)
- `tip` - Usage tips and best practices
- `update` - System updates and changes

**Features:**
- Real-time notification bell with unread count
- Priority-based ordering (urgent > high > normal > low)
- Mark as read / Mark all as read
- In-app notification center
- Automated monitoring and alerts

**API Endpoints:**
- `GET /api/notifications` - Fetch user notifications
- `PATCH /api/notifications` - Mark all as read
- `PATCH /api/notifications/[id]` - Mark specific notification as read

### 3. Feature Announcement System ✅

**Location:** `src/components/AnnouncementBanner.tsx`, `src/app/api/announcements/route.ts`

**Announcement Types:**
- `feature` - New features (purple gradient)
- `update` - Platform updates (blue gradient)
- `maintenance` - Maintenance notices (orange gradient)
- `promotion` - Special offers (green gradient)

**Targeting:**
- Plan-based targeting: `all`, `free`, `starter`, `pro`, `business`
- Time-based display (start/end dates)
- Priority levels (low, normal, high)
- View tracking per user

**Features:**
- Dismissible banner with CTA button
- Automatic view tracking
- Admin controls for creation and management
- Multi-announcement rotation

**API Endpoints:**
- `GET /api/announcements` - Get active announcements for user
- `POST /api/announcements/[id]/view` - Mark announcement as viewed

### 4. User Feedback Collection ✅

**Location:** `src/components/FeedbackModal.tsx`, `src/components/FeedbackButton.tsx`

**Feedback Types:**
- Bug reports
- Feature requests
- Improvement suggestions
- General feedback

**Features:**
- Floating feedback button (bottom-right)
- 5-star rating system
- Category selection (usability, performance, design, functionality)
- Page context tracking
- Admin dashboard for feedback management
- Status tracking (new, reviewing, planned, completed, declined)
- Priority assignment (low, normal, high)

**API Endpoints:**
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get user's feedback history
- `GET /api/admin/feedback` - Admin: View all feedback
- `PATCH /api/admin/feedback/[id]` - Admin: Update feedback status

## Admin Controls

### Email Campaign Management

**Location:** `src/app/api/admin/campaigns/route.ts`

**Features:**
- Create campaigns with custom templates
- Schedule campaigns for future dates
- Target specific audiences (all, free users, trial ending, inactive, etc.)
- Track campaign performance (sent count, open rate, click rate)

**API Endpoints:**
- `GET /api/admin/campaigns` - List all campaigns
- `POST /api/admin/campaigns` - Create new campaign

### Announcement Management

**Location:** `src/app/api/admin/announcements/route.ts`

**Features:**
- Create announcements with targeting
- Set display duration (start/end dates)
- Track view counts
- Toggle active/inactive status

**API Endpoints:**
- `GET /api/admin/announcements` - List all announcements
- `POST /api/admin/announcements` - Create announcement

### Feedback Dashboard

**Location:** `src/app/api/admin/feedback/route.ts`

**Features:**
- View all user feedback
- Filter by status and type
- Update status and priority
- Add admin notes
- Track resolution progress

**API Endpoints:**
- `GET /api/admin/feedback?status=new&type=bug` - Filter feedback
- `PATCH /api/admin/feedback/[id]` - Update feedback

## Automated Jobs

**Location:** `src/lib/engagement/cron-jobs.ts`

### Daily Tasks (9:00 AM)
- Send trial ending reminders
- Process scheduled email campaigns
- Clean up old notifications (90+ days)

### Weekly Tasks (Monday 10:00 AM)
- Send re-engagement emails to inactive users

### Monthly Tasks (1st of month, 10:00 AM)
- Send monthly usage insights to all active users

**Setup Examples:**

#### Node-Cron (Self-hosted)
```typescript
import cron from 'node-cron'
import { dailyEngagementTasks, weeklyEngagementTasks, monthlyEngagementTasks } from '@/lib/engagement/cron-jobs'

cron.schedule('0 9 * * *', dailyEngagementTasks)
cron.schedule('0 10 * * 1', weeklyEngagementTasks)
cron.schedule('0 10 1 * *', monthlyEngagementTasks)
```

#### Vercel Cron Jobs
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/daily",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/weekly",
      "schedule": "0 10 * * 1"
    },
    {
      "path": "/api/cron/monthly",
      "schedule": "0 10 1 * *"
    }
  ]
}
```

## Database Schema Updates

Run migration to add new tables:

```bash
npx prisma migrate dev --name add_engagement_features
```

**New Tables:**
- `EmailCampaign` - Campaign management
- `EmailLog` - Email delivery tracking
- `Notification` - In-app notifications
- `Announcement` - Feature announcements
- `AnnouncementView` - View tracking
- `Feedback` - User feedback collection

## Integration Guide

### 1. Add Notification Bell to Header

```tsx
import NotificationBell from '@/components/NotificationBell'

export default function Header() {
  return (
    <header>
      {/* Your header content */}
      <NotificationBell />
    </header>
  )
}
```

### 2. Add Announcement Banner

```tsx
import AnnouncementBanner from '@/components/AnnouncementBanner'

export default function Layout({ children }) {
  return (
    <>
      <AnnouncementBanner />
      {children}
    </>
  )
}
```

### 3. Add Feedback Button

```tsx
import FeedbackButton from '@/components/FeedbackButton'

export default function DashboardLayout({ children }) {
  return (
    <>
      {children}
      <FeedbackButton />
    </>
  )
}
```

### 4. Trigger Notifications Programmatically

```typescript
import { createNotification, notifyMilestone, notifyPlanLimitApproaching } from '@/lib/engagement/notifications'

// Custom notification
await createNotification({
  userId: user.id,
  type: 'milestone',
  title: 'Congratulations!',
  message: 'You reached 1,000 scans!',
  actionUrl: '/dashboard/analytics',
  priority: 'normal',
})

// Milestone notification
await notifyMilestone(user.id, 'scans', 1000)

// Plan limit warning
await notifyPlanLimitApproaching(user.id, 'QR codes', 45, 50)
```

### 5. Send Welcome Email on Signup

```typescript
import { sendWelcomeEmail } from '@/lib/engagement/email-automation'

// After user registration
await sendWelcomeEmail(user.id)
```

## Environment Variables

Add to `.env`:

```env
# Email Configuration (already configured)
SMTP_HOST=mail.redbudway.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@theqrcode.io
CONTACT_EMAIL=support@theqrcode.io
```

## Testing

### Test Email Automation
```typescript
import { testEmailConnection } from '@/lib/email'

const result = await testEmailConnection()
console.log(result) // { success: true, message: 'Email connection verified' }
```

### Test Notifications
```bash
# Create test notification via API
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "tip",
    "title": "Test Notification",
    "message": "This is a test",
    "priority": "normal"
  }'
```

### Test Feedback
- Click the floating feedback button
- Fill out the form
- Check admin panel at `/api/admin/feedback`

## Performance Considerations

1. **Email Rate Limiting**: 100ms delay between emails to avoid spam filters
2. **Notification Cleanup**: Auto-delete read notifications after 90 days
3. **Polling Interval**: Notifications refresh every 60 seconds
4. **Database Indexes**: Added on critical query fields

## Security

- ✅ All endpoints require authentication
- ✅ Admin endpoints check `isAdmin` flag
- ✅ Users can only access their own notifications/feedback
- ✅ XSS protection on user-generated content
- ✅ Rate limiting on API endpoints recommended

## Future Enhancements

- [ ] Email open/click tracking with tracking pixels
- [ ] A/B testing for email campaigns
- [ ] Push notifications (web push API)
- [ ] SMS notifications integration
- [ ] Advanced segmentation for campaigns
- [ ] Analytics dashboard for engagement metrics
- [ ] Notification preferences per user
- [ ] Email unsubscribe management

## Support

For issues or questions about the engagement system, contact the development team or refer to the main project documentation.

