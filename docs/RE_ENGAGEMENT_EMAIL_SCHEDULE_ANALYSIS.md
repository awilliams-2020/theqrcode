# Re-engagement Email Schedule Analysis

## Issue Summary

Re-engagement emails and account deletion warning emails are not properly coordinated, causing users to receive conflicting messages out of sequence.

## Current Behavior

### Re-engagement Emails (`sendReEngagementEmails`)
- **Schedule**: Weekly (Monday at 10:00 AM UTC)
- **Location**: `/src/lib/engagement/email-automation.ts` (lines 422-459)
- **Trigger**: Users inactive for **30+ days**
- **Logic**: 
  ```typescript
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  // Finds users where lastLoginAt < thirtyDaysAgo
  ```
- **No exclusion logic**: Sends to ALL users inactive 30+ days, regardless of deletion warning status

### Account Deletion Warnings (`sendInactiveUserDeletionWarnings`)
- **Schedule**: Daily (9:00 AM UTC)
- **Location**: `/src/lib/engagement/email-automation.ts` (lines 462-584)
- **Trigger**: Users inactive for **30-90 days**
- **Warning Schedule**:
  - **60 days before deletion** (30 days inactive): Lines 513-516
    - Sends when `daysUntilDeletion <= 60 && daysUntilDeletion >= 59`
    - Subject: "Your account will be deleted in 60 days due to inactivity"
  - **30 days before deletion** (60 days inactive): Lines 509-512
    - Sends when `daysUntilDeletion <= 30 && daysUntilDeletion >= 29`
    - Subject: "⚠️ Final Warning: Your account will be deleted in 30 days"
  - **15 days before deletion** (75 days inactive): Lines 505-508
    - Sends when `daysUntilDeletion <= 15 && daysUntilDeletion >= 14`
    - Subject: "🚨 URGENT: Your account will be deleted in 15 days"
- **Duplicate prevention**: Checks for same warning sent within last 7 days (lines 525-534)

## The Problem

### Example Scenario (User's Reported Issue)
1. **Day 0**: User last logged in
2. **Day 30** (7 days ago): User is 30 days inactive
   - Daily cron runs → Sends **60-day deletion warning** ("Your account will be deleted in 60 days")
3. **Day 35** (3 days ago): User is 35 days inactive
   - Weekly cron runs → Sends **re-engagement email** ("We miss you! It's been 35 days")

### Root Cause

The two email systems operate independently:

1. **Re-engagement emails** target users inactive **30+ days** (no upper limit)
2. **Deletion warnings** target users inactive **30-90 days**
3. **Overlap**: Both systems target users who are 30-90 days inactive
4. **No coordination**: Re-engagement emails don't check if user is already receiving deletion warnings

### Code Evidence

**Re-engagement email logic** (lines 422-459):
```typescript
export async function sendReEngagementEmails() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
      lastLoginAt: { lt: thirtyDaysAgo }, // 30+ days inactive
    },
  })
  // No check for deletion warning status
  // No exclusion of users receiving deletion warnings
}
```

**Deletion warning logic** (lines 462-584):
```typescript
export async function sendInactiveUserDeletionWarnings() {
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  
  const inactiveUsers = await prisma.user.findMany({
    where: {
      isDeleted: false,
      lastLoginAt: {
        lt: thirtyDaysAgo,  // At least 30 days inactive
        gte: ninetyDaysAgo, // But not yet 90 days
      },
    },
  })
  // Only sends warnings at specific thresholds (30, 60, 75 days inactive)
}
```

## Expected Behavior

Re-engagement emails should **NOT** be sent to users who are already in the deletion warning phase (30+ days inactive). The deletion warnings are more urgent and should take precedence.

## Recommended Fix (Not Implemented - Investigation Only)

### Option 1: Exclude Users Receiving Deletion Warnings
Modify `sendReEngagementEmails()` to exclude users who are 30+ days inactive (since they're receiving deletion warnings):

```typescript
export async function sendReEngagementEmails() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
      lastLoginAt: { 
        lt: thirtyDaysAgo, // 30+ days inactive
        // But exclude users who are already receiving deletion warnings
        // This would require checking if user is in the 30-90 day inactive range
      },
    },
  })
}
```

**Problem**: This would prevent re-engagement emails entirely for users 30+ days inactive, which might not be desired.

### Option 2: Limit Re-engagement to Early Inactivity Period
Only send re-engagement emails to users who are **exactly** 30-35 days inactive (before deletion warnings start):

```typescript
export async function sendReEngagementEmails() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const thirtyFiveDaysAgo = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000)
  
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
      lastLoginAt: { 
        lt: thirtyDaysAgo,    // At least 30 days inactive
        gte: thirtyFiveDaysAgo, // But not more than 35 days
      },
    },
  })
}
```

**Problem**: This is a narrow window and might miss users if weekly cron doesn't run at the right time.

### Option 3: Check for Recent Deletion Warnings
Skip re-engagement emails if a deletion warning was sent recently:

```typescript
export async function sendReEngagementEmails() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
      lastLoginAt: { lt: thirtyDaysAgo },
    },
  })
  
  for (const user of users) {
    // Check if deletion warning was sent in last 14 days
    const recentDeletionWarning = await prisma.emailLog.findFirst({
      where: {
        userId: user.id,
        emailType: 'notification',
        subject: {
          contains: 'account will be deleted',
        },
        sentAt: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
      },
    })
    
    if (recentDeletionWarning) {
      continue // Skip re-engagement email
    }
    
    // Send re-engagement email...
  }
}
```

**Advantage**: Allows re-engagement emails for users 30+ days inactive, but prevents them if deletion warnings are active.

## Current Cron Schedule

- **Daily** (9:00 AM UTC): `/api/cron/daily` → `dailyEngagementTasks()` → includes `sendInactiveUserDeletionWarnings()`
- **Weekly** (Monday 10:00 AM UTC): `/api/cron/weekly` → `weeklyEngagementTasks()` → includes `sendReEngagementEmails()`

## Timeline Example

For a user who last logged in on Day 0:

| Day | Days Inactive | Daily Cron (9 AM) | Weekly Cron (Mon 10 AM) |
|-----|---------------|-------------------|-------------------------|
| 30  | 30            | ✅ 60-day deletion warning |                         |
| 35  | 35            |                   | ✅ Re-engagement email   |
| 60  | 60            | ✅ 30-day deletion warning |                         |
| 75  | 75            | ✅ 15-day deletion warning |                         |
| 90  | 90            | ✅ Account deleted |                         |

The conflict occurs at Day 35 when the weekly cron sends a re-engagement email to a user who already received a deletion warning 5 days earlier.

## Conclusion

The re-engagement email system and account deletion warning system need better coordination to prevent conflicting messages. The deletion warnings should take precedence, and re-engagement emails should either:
1. Be excluded for users 30+ days inactive, OR
2. Check for recent deletion warnings before sending

