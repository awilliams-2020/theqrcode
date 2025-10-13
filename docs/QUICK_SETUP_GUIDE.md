# Quick Setup Guide - User Engagement Features

## 🚀 5-Minute Integration

### Step 1: Run Database Migration
```bash
cd /home/awilliams/theqrcode
npx prisma migrate dev --name add_engagement_features
npx prisma generate
```

### Step 2: Add Components to Your Layout

**Update `src/app/layout.tsx` or your main layout:**

```tsx
import NotificationBell from '@/components/NotificationBell'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import FeedbackButton from '@/components/FeedbackButton'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* Add notification bell to header */}
        <header>
          <nav>
            {/* Your navigation items */}
            <NotificationBell />
          </nav>
        </header>

        {/* Add announcement banner below header */}
        <AnnouncementBanner />

        {/* Your main content */}
        <main>{children}</main>

        {/* Add floating feedback button */}
        <FeedbackButton />
      </body>
    </html>
  )
}
```

### Step 3: Send Welcome Email on Signup

**Update your signup handler:**

```tsx
import { sendWelcomeEmail } from '@/lib/engagement/email-automation'

export async function handleUserSignup(userId: string) {
  // Your existing signup logic...
  
  // Send welcome email
  await sendWelcomeEmail(userId)
}
```

### Step 4: Monitor User Activity

**Update your QR code creation handler:**

```tsx
import { notifyMilestone, notifyPlanLimitApproaching } from '@/lib/engagement/notifications'

export async function onQrCodeCreated(userId: string, qrCodeCount: number, planLimit: number) {
  // Check milestones
  const milestones = [10, 25, 50, 100]
  if (milestones.includes(qrCodeCount)) {
    await notifyMilestone(userId, 'qr_codes', qrCodeCount)
  }

  // Check plan limits
  if (qrCodeCount >= planLimit * 0.8) {
    await notifyPlanLimitApproaching(userId, 'QR codes', qrCodeCount, planLimit)
  }
}
```

### Step 5: Setup Cron Jobs (Optional)

**For Vercel - Create `vercel.json` in root:**

```json
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

**Create API routes:**

`src/app/api/cron/daily/route.ts`:
```tsx
import { dailyEngagementTasks } from '@/lib/engagement/cron-jobs'

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await dailyEngagementTasks()
  return Response.json({ success: true })
}
```

---

## 🎯 Testing

### Test Notification System
```bash
# Start your dev server
npm run dev

# Navigate to your app and the notification bell should appear
# Create a test notification via your app logic
```

### Test Feedback System
1. Navigate to any page with the feedback button
2. Click the floating button (bottom-right)
3. Fill out the form and submit
4. Check admin panel: `GET /api/admin/feedback`

### Test Announcement System
```bash
# Create test announcement via API
curl -X POST http://localhost:3000/api/admin/announcements \
  -H "Content-Type: application/json" \
  -H "Cookie: your-admin-session-cookie" \
  -d '{
    "title": "Test Announcement",
    "content": "This is a test announcement!",
    "type": "feature",
    "targetPlans": ["all"],
    "ctaText": "Learn More",
    "ctaUrl": "/dashboard"
  }'
```

### Test Email System
```tsx
import { testEmailConnection } from '@/lib/email'

// In your code
const result = await testEmailConnection()
console.log(result) // Should return { success: true }
```

---

## 📋 Checklist

- [ ] Database migrated with new tables
- [ ] NotificationBell added to header
- [ ] AnnouncementBanner added to layout
- [ ] FeedbackButton added to pages
- [ ] Welcome email integrated on signup
- [ ] Milestone notifications on QR creation
- [ ] Plan limit warnings implemented
- [ ] Cron jobs configured (optional)
- [ ] Admin endpoints secured
- [ ] Test notifications working
- [ ] Test feedback submission working
- [ ] Test announcements displaying

---

## 🔑 Admin Access

To test admin features, update a user in the database:

```sql
UPDATE "User" 
SET "isAdmin" = true 
WHERE email = 'your-email@example.com';
```

Then access:
- `GET /api/admin/campaigns` - View campaigns
- `POST /api/admin/announcements` - Create announcements
- `GET /api/admin/feedback` - View all feedback

---

## 🐛 Troubleshooting

### Notifications not showing?
- Check if user is authenticated
- Verify API endpoint returns data: `GET /api/notifications`
- Check browser console for errors

### Emails not sending?
- Verify SMTP credentials in `.env`
- Test connection: `await testEmailConnection()`
- Check email logs in database: `SELECT * FROM "EmailLog"`

### Announcements not displaying?
- Verify announcement is active
- Check targetPlans includes user's plan
- Verify startDate is in the past

### Feedback not submitting?
- Check browser console for errors
- Verify API endpoint: `POST /api/feedback`
- Check network tab for failed requests

---

## 📖 Full Documentation

- **Complete Guide**: `ENGAGEMENT_SYSTEM.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Code Examples**: `src/lib/engagement/usage-examples.ts`

---

## ✅ You're Done!

The user engagement system is now fully integrated. Users will receive:
- ✅ Welcome emails on signup
- ✅ In-app notifications for milestones
- ✅ Feature announcements via banner
- ✅ Ability to submit feedback
- ✅ Monthly usage insights (via cron)
- ✅ Trial reminders (via cron)
- ✅ Re-engagement emails (via cron)

**Next Steps:**
1. Monitor notification engagement
2. Create your first announcement
3. Review incoming feedback
4. Schedule email campaigns

Enjoy your new engagement system! 🎉

