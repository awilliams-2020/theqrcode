# Where to Find Each Feature in the App

## 🗺️ Visual Location Guide

```
┌────────────────────────────────────────────────────────────┐
│  HEADER / NAVBAR                                            │
│  ┌─────────┬────────────────────────────┬────────────────┐ │
│  │ [Logo]  │ [Dashboard] [Analytics]    │  🔔[2] [User]▼│ │
│  └─────────┴────────────────────────────┴────────────────┘ │
│                                             ▲                │
│                                             │                │
│                                    NotificationBell HERE    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  📢 New Feature: Advanced Analytics! [Try Now] [✕]        │  ← AnnouncementBanner
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                                                              │
│  MAIN CONTENT                                               │
│  (Dashboard, Analytics, Settings, etc.)                     │
│                                                              │
│                                                              │
│                                                              │
│                                                      ┌────┐ │
│                                                      │ 💬 │ │  ← FeedbackButton
│                                                      └────┘ │
└────────────────────────────────────────────────────────────┘
```

---

## 🔍 Find by Feature

### 🔔 NotificationBell

**Where:** Top-right corner of header (next to user avatar)

**Looks like:**
```
🔔  ← Bell icon
 ①  ← Red badge with count (if unread notifications)
```

**When clicked:**
```
┌────────────────────────────────┐
│ Notifications            Mark all read │
├────────────────────────────────┤
│ 🎉 Congratulations!            │
│    You created your 10th QR    │
│    code                         │
│    Oct 10                    ● │
├────────────────────────────────┤
│ 💡 Pro Tip                     │
│    Use dynamic QR codes for    │
│    flexibility                  │
│    Oct 9                        │
├────────────────────────────────┤
│     View all notifications      │
└────────────────────────────────┘
```

**Find in code:** `src/components/Navbar.tsx` line 178

---

### 📢 AnnouncementBanner

**Where:** Below header, spans full width

**Looks like:**
```
┌──────────────────────────────────────────────────┐
│ 🚀 New Feature: Advanced Analytics! [Try Now] [✕]│  ← Purple gradient
└──────────────────────────────────────────────────┘
```

**Colors by type:**
- **Feature:** Purple gradient 🟣
- **Update:** Blue gradient 🔵
- **Maintenance:** Orange gradient 🟠
- **Promotion:** Green gradient 🟢

**Find in code:** `src/components/ConditionalMain.tsx` line 45

---

### 💬 FeedbackButton

**Where:** Fixed bottom-right corner (floats above content)

**Looks like:**
```
                                    ┌────┐
                                    │ 💬 │  ← Blue circle
                                    └────┘
                         Send Feedback ←  Tooltip on hover
```

**When clicked:**
```
┌─────────────────────────────────────────┐
│  Send Feedback                       ✕  │
│  We'd love to hear your thoughts...     │
├─────────────────────────────────────────┤
│  Feedback Type:                          │
│  [Bug Report ▼]                          │
│                                           │
│  Category:                                │
│  [Usability ▼]                            │
│                                           │
│  Rating:                                  │
│  ⭐⭐⭐⭐☆                                │
│                                           │
│  Subject:                                 │
│  [                                   ]   │
│                                           │
│  Message:                                 │
│  [                                   ]   │
│  [                                   ]   │
│                                           │
│  [Cancel]  [Submit Feedback]             │
└─────────────────────────────────────────┘
```

**Find in code:** `src/components/ConditionalMain.tsx` line 52

---

## 🎬 When You'll See Notifications

### Milestone Notifications

#### QR Code Milestones
```
Create 1st QR   → 🎉 Congratulations on your first QR code!
Create 5th QR   → 🎨 You've created 5 QR codes!
Create 10th QR  → 🎨 Amazing! You've created 10 QR codes!
Create 25th QR  → 🎨 You've created 25 QR codes!
Create 50th QR  → 🎨 You've created 50 QR codes!
Create 100th QR → 🎨 You've created 100 QR codes!
```

#### Scan Milestones
```
100 scans    → 🎉 You've reached 100 total scans!
500 scans    → 🎉 You've reached 500 total scans!
1,000 scans  → 🎉 You've reached 1,000 total scans!
5,000 scans  → 🎉 You've reached 5,000 total scans!
10,000 scans → 🎉 You've reached 10,000 total scans!
50,000 scans → 🎉 You've reached 50,000 total scans!
```

#### Plan Limit Warnings
```
80% of limit → ⚠️ Approaching QR codes Limit
              You've used 8 of 10 QR codes
              [Upgrade Plan]
```

---

## 📧 Email Schedule

### Immediate Emails
```
Event: New user signup
When:  Immediately after signup
To:    New user
Subject: Welcome to TheQRCode.io! 🎉
```

### Scheduled Emails
```
Daily (9 AM UTC):
  → Trial ending in 3 days
  To: Users with trials expiring soon
  
Weekly (Monday 10 AM UTC):
  → We miss you!
  To: Users inactive 30+ days
  
Monthly (1st at 10 AM UTC):
  → Your Monthly Insights
  To: All active users
```

---

## 🎯 How to Test Each Feature

### Test NotificationBell
```bash
1. Sign in to app
2. Go to dashboard
3. Create a new QR code
4. Wait 60 seconds (polling interval)
5. Bell badge should show "1"
6. Click bell → See "Congratulations!" notification
```

### Test AnnouncementBanner
```bash
# First, make yourself admin
docker exec -it postgres psql -U postgres -d theqrcode -c \
  "UPDATE \"User\" SET \"isAdmin\" = true WHERE email = 'your@email.com';"

# Create test announcement
docker exec theqrcode curl -X POST http://localhost:3000/api/admin/announcements \
  -H "Content-Type: application/json" \
  -H "Cookie: $(docker exec theqrcode printenv NEXTAUTH_COOKIE)" \
  -d '{
    "title": "Test Feature",
    "content": "This is a test!",
    "type": "feature",
    "targetPlans": ["all"],
    "ctaText": "Learn More",
    "ctaUrl": "/dashboard"
  }'

# Reload app → Banner should appear below header
```

### Test FeedbackButton
```bash
1. Sign in to app
2. Look bottom-right corner
3. Blue circular button should be there
4. Hover → "Send Feedback" tooltip
5. Click → Modal opens
6. Fill out and submit
7. Success animation shows
```

---

## 📱 Mobile vs Desktop

### Desktop View
```
Header:
  [Logo] [Links]  ...  🔔[2] [User]▼

Content:
  Main content here
  
                            💬  ← Feedback button
```

### Mobile View
```
Header:
  [Logo]                     [☰]
  
  (Menu opens on hamburger click)
  Shows bell icon in mobile menu

Content:
  Main content here
  
                    💬  ← Feedback button
```

---

## 🔍 How to Find in Your Browser

### Desktop (Width > 768px)
1. **NotificationBell:**
   - Look at header, far right
   - Next to your profile picture/name
   - Before "Sign Out" button

2. **AnnouncementBanner:**
   - Directly below the header
   - Full width colored banner
   - Only if admin created announcements

3. **FeedbackButton:**
   - Bottom-right corner
   - Fixed position (doesn't scroll)
   - Always accessible

### Mobile (Width < 768px)
1. **NotificationBell:**
   - Click hamburger menu (☰)
   - Bell appears in mobile menu

2. **AnnouncementBanner:**
   - Same as desktop
   - Below header, full width

3. **FeedbackButton:**
   - Same as desktop
   - Bottom-right, slightly smaller

---

## 🎨 Visual Examples

### NotificationBell States

**No notifications:**
```
🔔  ← Gray bell, no badge
```

**1 unread:**
```
🔔  ← Bell with red badge "1"
 ①
```

**9+ unread:**
```
🔔  ← Bell with red badge "9+"
9+
```

### AnnouncementBanner Types

**Feature (Purple):**
```
🚀 New Feature: API Access! [Try Now] [✕]
```

**Update (Blue):**
```
🔔 Platform Update: Faster loading times [Learn More] [✕]
```

**Maintenance (Orange):**
```
🔧 Scheduled Maintenance: Tonight 2 AM [Details] [✕]
```

**Promotion (Green):**
```
🎉 Special Offer: 50% off all plans! [Upgrade] [✕]
```

### FeedbackButton States

**Default:**
```
💬  ← Blue circle
```

**Hover:**
```
💬  [Send Feedback]  ← Tooltip appears
```

**Clicked:**
```
[Feedback Modal Opens]
```

---

## 📊 Integration Verification

### Check Integration Status

```bash
# Check NotificationBell is imported
grep "NotificationBell" src/components/Navbar.tsx

# Check AnnouncementBanner is imported
grep "AnnouncementBanner" src/components/ConditionalMain.tsx

# Check FeedbackButton is imported
grep "FeedbackButton" src/components/ConditionalMain.tsx

# Check notification triggers exist
grep "notifyMilestone" src/app/api/qr-codes/route.ts
grep "notifyMilestone" src/app/api/track/[shortCode]/route.ts

# Check welcome email integration
grep "sendWelcomeEmail" src/lib/auth.ts
```

All should return results ✓

---

## 🎯 Summary

**Where to look in your app:**

| Feature | Location | When Visible |
|---------|----------|--------------|
| 🔔 NotificationBell | Header (top-right) | When signed in |
| 📢 AnnouncementBanner | Below header | When signed in + announcements active |
| 💬 FeedbackButton | Bottom-right | When signed in |

**Where triggers are:**

| Trigger | File | Event |
|---------|------|-------|
| QR Milestones | api/qr-codes/route.ts | QR code created |
| Scan Milestones | api/track/route.ts | QR code scanned |
| Welcome Email | lib/auth.ts | User signup |

**Where automation runs:**

| Task | Schedule | Endpoint |
|------|----------|----------|
| Trial Reminders | Daily 9 AM | /api/cron/daily |
| Re-engagement | Mon 10 AM | /api/cron/weekly |
| Usage Insights | 1st 10 AM | /api/cron/monthly |

---

**Everything is integrated! Deploy and test to see it in action! 🚀**

See `docs/INTEGRATION_MAP.md` for detailed integration guide.

