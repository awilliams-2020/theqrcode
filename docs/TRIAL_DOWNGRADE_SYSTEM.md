# Trial Downgrade System

## Overview

When a user's 14-day trial expires, they are **automatically downgraded to the Free plan** instead of losing access completely. This provides a better user experience and creates more opportunities for conversion.

## How It Works

### 1. Daily Cron Job
The system runs daily at 9:00 AM via the Docker cron:

- **Finds** all subscriptions with `status = 'trialing'` and `trialEndsAt <= NOW()`
- **Before downgrading**: Creates a record in `TrialAbusePrevention` table (email hash)
- **Updates subscription**: Changes to `plan = 'free'`, `status = 'active'`, `trialEndsAt = NULL`
- **Sends email** to each downgraded user

### 2. Trial Abuse Prevention
Before downgrading each user, their email hash is stored in the `TrialAbusePrevention` table to prevent users from:
- Deleting their account and signing up again for another trial
- Gaming the system with multiple trials

The hash is created using SHA-256 in Node.js:
```javascript
const crypto = require('crypto')
const emailHash = crypto.createHash('sha256').update(user.email).digest('hex')
```

### 3. Email Notification
After downgrade, users receive a friendly email explaining:
- Their trial has ended
- They're now on the Free plan (not locked out)
- What the Free plan includes (10 QR codes, 1,000 scans, basic analytics)
- How to upgrade to regain premium features
- Their accomplishments during the trial (QR codes created, scans)

### 4. User Experience Flow

**Day 0-11**: Trial active with full features
- Blue banner: "Free Trial Active - [Plan] Features Unlocked"
- Shows days remaining

**Day 12-14**: Trial ending warning
- Orange banner: "Trial Ending Soon"
- Encourages upgrade

**Day 15+**: Auto-downgrade to Free plan
- User receives email notification
- Can continue using Free plan features
- Dashboard shows Free plan limits
- Upgrade prompts when attempting Pro/Business features

## Code Structure

### Database Migration
```
/prisma/migrations/20251011161343_add_downgrade_expired_trials_function/
  migration.sql - Creates index on trialEndsAt for performance
```

### Backend Logic
```
/src/lib/engagement/
  cron-jobs.ts          - Handles downgrade logic and email sending
  email-automation.ts   - Sends trial expired emails
  email-templates.ts    - Email template for downgraded users
```

### Cron Job
```
/src/app/api/cron/daily/route.ts - API endpoint called by cron
```

## Testing

### Manual Test (Development)
```bash
# Trigger the daily cron job manually
curl http://localhost:3000/api/cron/daily \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Production Test
```bash
# Trigger via Docker
docker exec theqrcode curl http://localhost:3000/api/cron/daily \
  -H "Authorization: Bearer $(docker exec theqrcode printenv CRON_SECRET)"
```

### Create Test Expired Trial
```sql
-- Connect to database
docker exec -it postgres psql -U postgres -d theqrcode

-- Create a trial that expired yesterday
UPDATE "Subscription" 
SET 
  status = 'trialing',
  plan = 'pro',
  "trialEndsAt" = NOW() - INTERVAL '1 day'
WHERE "userId" = 'YOUR_TEST_USER_ID';

-- Then run the cron job to process it
```

## Implementation Details

### Node.js Logic
The downgrade process happens in `/src/lib/engagement/cron-jobs.ts`:

```javascript
async function downgradeExpiredTrials() {
  // 1. Find expired trials
  const expiredTrials = await prisma.subscription.findMany({
    where: {
      status: 'trialing',
      trialEndsAt: { lte: new Date() }
    }
  })
  
  // 2. For each expired trial:
  //    - Add email hash to TrialAbusePrevention
  //    - Update subscription to free/active
  //    - Send notification email
}
```

### Performance
- Uses index: `Subscription_trialEndsAt_status_idx`
- Processes users sequentially with rate limiting
- Error handling per user (one failure doesn't break the batch)

## Monitoring

### Check Downgraded Users
```sql
SELECT 
  u.email,
  s.plan,
  s.status,
  s."updatedAt"
FROM "Subscription" s
JOIN "User" u ON u.id = s."userId"
WHERE 
  s.plan = 'free'
  AND s.status = 'active'
  AND s."updatedAt" >= NOW() - INTERVAL '7 days'
ORDER BY s."updatedAt" DESC;
```

### Check Trial Abuse Prevention
```sql
SELECT 
  COUNT(*) as total_prevented_emails,
  MAX("deletedAt") as last_prevention
FROM "TrialAbusePrevention";
```

### Check Email Logs
```sql
SELECT 
  el."userId",
  u.email,
  el.subject,
  el.status,
  el."sentAt"
FROM "EmailLog" el
JOIN "User" u ON u.id = el."userId"
WHERE 
  el.subject LIKE '%trial has ended%'
  AND el."sentAt" >= NOW() - INTERVAL '7 days'
ORDER BY el."sentAt" DESC;
```

## Benefits

### User Experience
- No sudden loss of access
- Maintains engagement
- Builds trust and goodwill
- Clear communication about what changed

### Business
- Higher retention rates
- More conversion opportunities
- Multiple touchpoints for upgrade
- Better analytics on user behavior

### Technical
- Clean database state (no "expired trial" status)
- Abuse prevention built-in
- Automated and reliable
- Observable and testable

## Future Enhancements

1. **Grace Period**: Give 3-day grace period before full downgrade
2. **Partial Downgrade**: Keep some features for first 30 days
3. **Win-back Campaign**: Automated email sequence for free users
4. **Usage Alerts**: Notify when free limits are being hit
5. **Smart Upgrades**: Suggest upgrade based on usage patterns

## Related Documentation

- [Email Automation System](ENGAGEMENT_SYSTEM.md)
- [Cron Jobs Setup](DOCKER_CRON_SETUP.md)
- [Trial Management](../src/lib/trial.ts)

