# Integration Map - Where Everything Is

This document shows exactly where each engagement feature is integrated in your app.

---

## 🎨 UI Components Integration

### 1. NotificationBell - IN NAVBAR ✅

**Location:** `src/components/Navbar.tsx` (line ~178)

**Where it appears:**
- Desktop: Top-right corner of header (next to user profile)
- Mobile: In mobile menu
- Shows: Bell icon with unread count badge

**Code:**
```tsx
// In Navbar.tsx, line 178
{session ? (
  <div className="flex items-center space-x-3">
    {/* Notification Bell */}
    <NotificationBell />
    
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      {session.user?.image ? (
        <img src={session.user.image} alt="Profile" className="h-6 w-6 rounded-full" />
      ) : <User className="h-4 w-4" />}
    </div>
    ...
```

**What it does:**
- Polls for notifications every 60 seconds
- Shows unread count badge (red circle with number)
- Opens dropdown on click
- Marks notifications as read when clicked
- Redirects to actionUrl if specified

---

### 2. AnnouncementBanner - BELOW NAVBAR ✅

**Location:** `src/components/ConditionalMain.tsx` (line ~45)

**Where it appears:**
- Below the header/navbar
- Above main content
- Only shown to authenticated users
- Hidden on `/display/` and `/auth/` routes

**Code:**
```tsx
// In ConditionalMain.tsx, line 45
{/* Announcement Banner - shown to all users on applicable pages */}
{showEngagementFeatures && session && <AnnouncementBanner />}

<main className={mainClassName}>
  {children}
</main>
```

**What it does:**
- Shows active announcements as dismissible banners
- Different colors per type (feature=purple, update=blue, etc.)
- Includes CTA button if specified
- Tracks views per user
- Auto-rotates if multiple announcements

---

### 3. FeedbackButton - BOTTOM-RIGHT FLOATING ✅

**Location:** `src/components/ConditionalMain.tsx` (line ~52)

**Where it appears:**
- Fixed position bottom-right corner
- Floating button with tooltip
- Only shown to authenticated users
- Hidden on `/display/` and `/auth/` routes

**Code:**
```tsx
// In ConditionalMain.tsx, line 52
{/* Feedback Button - shown to authenticated users */}
{showEngagementFeatures && session && <FeedbackButton />}
```

**What it does:**
- Opens feedback modal on click
- Collects feedback with rating, type, category
- Tracks page context automatically
- Shows success animation on submission
- Accessible from any page

---

## 🔔 Notification Triggers Integration

### 1. Welcome Email - ON SIGNUP ✅

**Location:** `src/lib/auth.ts` (line ~82-86)

**Trigger:** User signs up via Google OAuth

**Code:**
```typescript
// In auth.ts, createUser event
// Send welcome email asynchronously (don't block signup)
sendWelcomeEmail(user.id).catch(error => {
  console.error('Failed to send welcome email:', error)
  // Don't throw - signup should succeed even if email fails
})
```

**What happens:**
- User signs up → Welcome email sent immediately
- Non-blocking (signup succeeds even if email fails)
- Email includes trial info, features, getting started guide

---

### 2. QR Code Milestones - ON QR CODE CREATION ✅

**Location:** `src/app/api/qr-codes/route.ts` (line ~102-135)

**Trigger:** User creates a new QR code

**Code:**
```typescript
// Check for milestones
const milestones = [1, 5, 10, 25, 50, 100, 250, 500]
if (milestones.includes(newQrCodeCount)) {
  notifyMilestone(userId, 'qr_codes', newQrCodeCount).catch(err => 
    console.error('Failed to send milestone notification:', err)
  )
}

// Send a tip for first QR code
if (newQrCodeCount === 1) {
  createNotification({
    userId,
    type: 'tip',
    title: '🎉 Congratulations on your first QR code!',
    message: 'Track its performance in the Analytics dashboard...',
    actionUrl: '/analytics',
  })
}

// Check if approaching plan limit (80%+)
if (newQrCodeCount >= limits.qrCodes * 0.8) {
  notifyPlanLimitApproaching(userId, 'QR codes', newQrCodeCount, limits.qrCodes)
}
```

**What happens:**
- User creates QR code
- System checks count (1, 5, 10, 25, 50, 100, 250, 500)
- If milestone → Celebration notification appears
- If first QR code → Special tip notification
- If near limit (80%+) → Warning notification

---

### 3. Scan Milestones - ON QR CODE SCAN ✅

**Location:** `src/app/api/track/[shortCode]/route.ts` (line ~1271-1286)

**Trigger:** Someone scans a QR code

**Code:**
```typescript
// Check for scan milestones (asynchronous, don't block response)
const totalScans = await prisma.scan.count({
  where: { qrCode: { userId: qrCode.userId } }
})

// Notify on scan milestones
const scanMilestones = [100, 500, 1000, 5000, 10000, 50000]
if (scanMilestones.includes(totalScans)) {
  notifyMilestone(qrCode.userId, 'scans', totalScans).catch(err =>
    console.error('Failed to send scan milestone notification:', err)
  )
}
```

**What happens:**
- QR code gets scanned
- System counts total scans across all user's QR codes
- If milestone reached (100, 500, 1K, 5K, 10K, 50K) → Celebration notification

---

## 📅 Automated Cron Jobs

### 1. Daily Cron - TRIAL REMINDERS ✅

**Location:** `src/app/api/cron/daily/route.ts`

**Schedule:** Every day at 9:00 AM UTC

**What it does:**
```
1. Finds users with trials ending in 3 days
2. Sends reminder email with stats
3. Processes scheduled campaigns
4. Cleans up old notifications (90+ days)
```

**Triggered by:** Docker cron (`docker/crontab` line 6)

---

### 2. Weekly Cron - RE-ENGAGEMENT ✅

**Location:** `src/app/api/cron/weekly/route.ts`

**Schedule:** Every Monday at 10:00 AM UTC

**What it does:**
```
1. Finds users inactive for 30+ days
2. Sends re-engagement email
3. Highlights new features since they left
```

**Triggered by:** Docker cron (`docker/crontab` line 9)

---

### 3. Monthly Cron - USAGE INSIGHTS ✅

**Location:** `src/app/api/cron/monthly/route.ts`

**Schedule:** 1st of month at 10:00 AM UTC

**What it does:**
```
1. Sends usage insights to ALL active users
2. Includes: total scans, growth %, top QR code
3. Links to analytics dashboard
```

**Triggered by:** Docker cron (`docker/crontab` line 12)

---

## 🗺️ Complete Integration Map

```
┌─────────────────────────────────────────────────────────────┐
│                      YOUR APP                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📱 NAVBAR (Navbar.tsx)                                      │
│  ├─ Logo                                                      │
│  ├─ Navigation Links                                          │
│  └─ 🔔 NotificationBell ← INTEGRATED HERE                    │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📢 AnnouncementBanner ← INTEGRATED HERE                     │
│     (Shows above main content when active)                    │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📄 MAIN CONTENT (your pages)                                │
│                                                               │
│  When events happen:                                          │
│  ┌─────────────────────────────────────┐                    │
│  │ User creates QR code                │                    │
│  │  → QR code milestones check         │ (api/qr-codes)    │
│  │  → Plan limit warnings              │                    │
│  └─────────────────────────────────────┘                    │
│                                                               │
│  ┌─────────────────────────────────────┐                    │
│  │ QR code gets scanned                │                    │
│  │  → Scan milestone check             │ (api/track)        │
│  └─────────────────────────────────────┘                    │
│                                                               │
│  ┌─────────────────────────────────────┐                    │
│  │ User signs up                       │                    │
│  │  → Welcome email sent               │ (lib/auth.ts)      │
│  └─────────────────────────────────────┘                    │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  💬 FeedbackButton ← INTEGRATED HERE                         │
│     (Floating bottom-right corner)                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘

           ┌──────────────────────────────┐
           │   DOCKER CONTAINER           │
           │                               │
           │  ┌──────────────┐            │
           │  │ Cron Daemon  │            │
           │  └──────┬───────┘            │
           │         │                     │
           │    Calls API endpoints:      │
           │    - /api/cron/daily         │
           │    - /api/cron/weekly        │
           │    - /api/cron/monthly       │
           │                               │
           └───────────────────────────────┘
```

---

## 📂 File Summary

### Modified Files (5)
```
✅ src/components/Navbar.tsx               - Added NotificationBell
✅ src/components/ConditionalMain.tsx      - Added AnnouncementBanner + FeedbackButton
✅ src/app/api/qr-codes/route.ts          - Added QR milestone notifications
✅ src/app/api/track/[shortCode]/route.ts - Added scan milestone notifications
✅ src/lib/auth.ts                        - Added welcome email
```

### Created Files (Still in place)
```
✅ src/lib/engagement/                    - All core logic
✅ src/app/api/cron/                      - Cron job endpoints
✅ src/app/api/notifications/             - Notification APIs
✅ src/app/api/announcements/             - Announcement APIs
✅ src/app/api/feedback/                  - Feedback APIs
✅ src/components/NotificationBell.tsx    - Bell component
✅ src/components/AnnouncementBanner.tsx  - Banner component
✅ src/components/FeedbackModal.tsx       - Feedback form
✅ src/components/FeedbackButton.tsx      - Floating button
✅ docker/crontab                         - Cron schedule
✅ docker/entrypoint.sh                   - Container startup
```

---

## 🎯 What Happens in Each Scenario

### Scenario 1: New User Signs Up
```
1. User clicks "Sign in with Google"
2. Google OAuth flow completes
3. User account created
4. Subscription created with 14-day trial
5. ✨ Welcome email sent automatically (src/lib/auth.ts)
6. User sees dashboard
```

### Scenario 2: User Creates First QR Code
```
1. User fills out QR code form
2. Submits to POST /api/qr-codes
3. QR code saved to database
4. ✨ Special "first QR code" notification created
5. User sees notification bell badge (1)
6. Notification says: "🎉 Congratulations on your first QR code!"
```

### Scenario 3: User Reaches 10 QR Codes
```
1. User creates 10th QR code
2. POST /api/qr-codes executes
3. Checks if count is milestone (10 = yes)
4. ✨ Milestone notification created
5. Bell badge updates
6. Notification says: "🎨 Amazing! You've created 10 QR codes!"
```

### Scenario 4: User Approaching Plan Limit
```
1. User creates QR code (e.g., 8 out of 10 on free plan = 80%)
2. System checks: 8 >= 10 * 0.8? Yes!
3. ✨ Warning notification created
4. Bell badge updates  
5. Notification says: "Approaching QR codes Limit"
6. Priority: HIGH (orange color)
7. Click → Goes to /pricing
```

### Scenario 5: QR Code Reaches 100 Scans
```
1. Someone scans the QR code
2. Scan tracked via POST /api/track/[shortCode]
3. Total scans calculated across all user's QR codes
4. If total = 100 (or 500, 1000, 5000, 10000, 50000)
5. ✨ Scan milestone notification created
6. Bell badge updates
7. Notification says: "🎉 Congratulations! You've reached 100 total scans!"
```

### Scenario 6: Trial Ending Soon
```
1. Cron runs daily at 9 AM
2. Finds users with trials ending in 3 days
3. ✨ Email sent with stats and upgrade CTA
4. Logged in EmailLog table
5. User receives email in inbox
```

### Scenario 7: Admin Creates Announcement
```
1. Admin calls POST /api/admin/announcements
2. Announcement saved with targetPlans
3. Next time any matching user loads the app:
4. ✨ AnnouncementBanner appears at top
5. User sees banner with CTA button
6. Click CTA or dismiss → Marked as viewed
```

### Scenario 8: User Clicks Feedback Button
```
1. User sees floating button (bottom-right)
2. Clicks button
3. ✨ FeedbackModal opens
4. User fills out form (type, rating, message)
5. Submits to POST /api/feedback
6. Success animation shows
7. Feedback saved for admin review
```

---

## 🔍 How to Find Components in Your App

### NotificationBell
**Visible when:** User is signed in  
**Look for:** Bell icon in top-right corner of header  
**Test:** Sign in → Look at header → Should see bell icon

### AnnouncementBanner
**Visible when:** Admin creates announcement AND user matches target  
**Look for:** Colored banner below header  
**Test:** Create announcement via admin API → Reload page

### FeedbackButton
**Visible when:** User is signed in (except on /display/, /auth/ pages)  
**Look for:** Blue circular button bottom-right with chat icon  
**Test:** Sign in → Go to any page → Look bottom-right

---

## 🧪 Test Integration

### Test 1: See NotificationBell
```bash
1. Start app: docker-compose up -d theqrcode
2. Visit: https://theqrcode.io
3. Sign in with Google
4. Look top-right in header → Bell icon should appear
```

### Test 2: Trigger Notification
```bash
# Create a QR code in the dashboard
# Bell badge should update with "1"
# Click bell → See "Congratulations on your first QR code!"
```

### Test 3: See AnnouncementBanner
```bash
# Create announcement via admin API (need isAdmin=true)
curl -X POST http://localhost:3000/api/admin/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Feature",
    "content": "This is a test announcement",
    "type": "feature",
    "targetPlans": ["all"],
    "ctaText": "Learn More",
    "ctaUrl": "/dashboard"
  }'

# Reload page → Banner should appear below header
```

### Test 4: Use FeedbackButton
```bash
1. Sign in to app
2. Look bottom-right corner
3. Click blue circular button
4. Fill out feedback form
5. Submit → Success animation
```

---

## 🎯 User Journey Examples

### New User Journey
```
1. Lands on homepage
2. Clicks "Sign Up"
3. Signs in with Google
   └─ ✨ Welcome email sent

4. Creates first QR code
   └─ ✨ Notification: "Congratulations on first QR!"
   
5. QR code gets scanned 100 times
   └─ ✨ Notification: "You reached 100 scans!"
   
6. 3 days before trial ends
   └─ ✨ Email: "Trial ending soon"
   
7. Sees floating feedback button
   └─ ✨ Clicks and submits feedback

8. Admin creates feature announcement
   └─ ✨ Banner appears: "New Feature Available!"
```

### Power User Journey
```
1. User creates 25 QR codes
   └─ ✨ Notification: "Amazing! 25 QR codes!"
   
2. Approaches limit (8/10 on free plan)
   └─ ✨ Notification: "Approaching limit, upgrade?"
   
3. Total scans reach 1,000
   └─ ✨ Notification: "1,000 scans milestone!"
   
4. Beginning of month
   └─ ✨ Email: "Your monthly insights"
   
5. Admin announces new feature
   └─ ✨ Banner: "New API access available!"
```

---

## 🔄 Data Flow

### Notification Creation Flow
```
Event (QR created, scan, etc.)
  ↓
Trigger function (notifyMilestone, createNotification)
  ↓
Save to database (Notification table)
  ↓
NotificationBell polls API every 60s
  ↓
GET /api/notifications returns new notifications
  ↓
Bell updates badge count
  ↓
User clicks bell → Sees notifications
  ↓
User clicks notification → PATCH /api/notifications/[id]
  ↓
Marked as read, redirects to actionUrl
```

### Announcement Flow
```
Admin creates announcement
  ↓
POST /api/admin/announcements
  ↓
Saved to database with targetPlans
  ↓
User loads page
  ↓
AnnouncementBanner component mounts
  ↓
GET /api/announcements (filters by user's plan)
  ↓
Banner displays with CTA
  ↓
User dismisses or clicks CTA
  ↓
POST /api/announcements/[id]/view
  ↓
Marked as viewed, won't show again
```

### Feedback Flow
```
User clicks FeedbackButton
  ↓
FeedbackModal opens
  ↓
User fills out form (type, rating, message)
  ↓
POST /api/feedback
  ↓
Saved to database with page context
  ↓
Success animation shows
  ↓
Admin views GET /api/admin/feedback
  ↓
Admin updates status PATCH /api/admin/feedback/[id]
```

---

## ✅ Verification Checklist

After integration, verify:

- [ ] NotificationBell appears in header when signed in
- [ ] Bell has no errors in browser console
- [ ] Creating QR code triggers notification
- [ ] Bell badge shows correct unread count
- [ ] Clicking notification marks it as read
- [ ] FeedbackButton visible bottom-right when signed in
- [ ] Feedback form opens and submits successfully
- [ ] AnnouncementBanner can be created and displayed
- [ ] Welcome email sends on signup
- [ ] No TypeScript/linter errors

---

## 📊 Integration Status

| Component | Location | Status | Visible To |
|-----------|----------|--------|------------|
| NotificationBell | Navbar.tsx line 178 | ✅ | Authenticated users |
| AnnouncementBanner | ConditionalMain.tsx line 45 | ✅ | Authenticated users |
| FeedbackButton | ConditionalMain.tsx line 52 | ✅ | Authenticated users |
| QR Milestones | api/qr-codes/route.ts | ✅ | Automated |
| Scan Milestones | api/track/[shortCode]/route.ts | ✅ | Automated |
| Welcome Email | lib/auth.ts | ✅ | Automated |
| Trial Reminders | Cron daily | ✅ | Automated |
| Re-engagement | Cron weekly | ✅ | Automated |
| Usage Insights | Cron monthly | ✅ | Automated |

---

## 🎊 Everything is Integrated!

All user engagement features are now active in your app:

✅ **UI Components** - Visible to authenticated users  
✅ **Notification Triggers** - Fire on events  
✅ **Email Automation** - Send on signup  
✅ **Cron Jobs** - Scheduled tasks ready  

**Next Step:** Deploy and test!

```bash
cd /home/awilliams
./theqrcode/setup-cron.sh
```

Then sign in and create a QR code to see it in action! 🚀

