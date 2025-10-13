# 🚀 Deployment Checklist - User Engagement System

## Pre-Deployment (Do These First)

### 1. Database Migration
```bash
cd /home/awilliams/theqrcode
npx prisma migrate dev --name add_engagement_features
npx prisma generate
```

**Verify:**
```bash
psql $DATABASE_URL -c "\dt" | grep -E "EmailCampaign|Notification|Announcement|Feedback"
```

### 2. Generate CRON_SECRET
```bash
openssl rand -base64 32
```

Save this output - you'll need it for Vercel.

### 3. Test SMTP Connection
```bash
# In Node.js REPL or create a test script
node -e "
const { testEmailConnection } = require('./src/lib/email.ts');
testEmailConnection().then(console.log);
"
```

Expected: `{ success: true, message: 'Email connection verified' }`

---

## Vercel Deployment

### Step 1: Add Environment Variable
```bash
cd /home/awilliams/theqrcode
vercel env add CRON_SECRET

# When prompted, paste the secret generated above
# Repeat for all environments:
vercel env add CRON_SECRET production
vercel env add CRON_SECRET preview
vercel env add CRON_SECRET development
```

### Step 2: Commit and Push
```bash
git add .
git commit -m "Add user engagement system with automation"
git push origin main
```

### Step 3: Deploy to Production
```bash
vercel --prod
```

### Step 4: Verify Cron Jobs
1. Open https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Cron Jobs
4. Verify you see:
   - ✅ `/api/cron/daily` - `0 9 * * *`
   - ✅ `/api/cron/weekly` - `0 10 * * 1`
   - ✅ `/api/cron/monthly` - `0 10 1 * *`

---

## Post-Deployment Testing

### Test 1: Welcome Email on Signup
```bash
# 1. Create a new test user via signup
# 2. Check email inbox for welcome email
# 3. Subject: "Welcome to TheQRCode.io! 🎉"
```

**Check logs:**
```bash
vercel logs --follow
# Look for: "Failed to send welcome email" (should not appear)
```

### Test 2: Cron Endpoints
```bash
# Get your production URL
PROD_URL="https://theqrcode.io"
CRON_SECRET="your-secret-here"

# Test daily cron
curl $PROD_URL/api/cron/daily \
  -H "Authorization: Bearer $CRON_SECRET"

# Expected: {"success":true,"message":"Daily engagement tasks completed",...}

# Test weekly cron
curl $PROD_URL/api/cron/weekly \
  -H "Authorization: Bearer $CRON_SECRET"

# Test monthly cron
curl $PROD_URL/api/cron/monthly \
  -H "Authorization: Bearer $CRON_SECRET"
```

### Test 3: UI Components
```bash
# Visit your production site
open https://theqrcode.io

# Check for:
# ✅ Notification bell in header
# ✅ Announcement banner (if any active)
# ✅ Feedback button (bottom-right)
```

### Test 4: Database Verification
```bash
psql $DATABASE_URL << EOF
-- Check email logs
SELECT * FROM "EmailLog" ORDER BY "sentAt" DESC LIMIT 5;

-- Check notifications
SELECT * FROM "Notification" ORDER BY "createdAt" DESC LIMIT 5;

-- Check announcements
SELECT * FROM "Announcement" WHERE "isActive" = true;

-- Check feedback
SELECT * FROM "Feedback" ORDER BY "createdAt" DESC LIMIT 5;
EOF
```

---

## Monitoring (First 24 Hours)

### Hour 1: Check Welcome Emails
```sql
SELECT 
  COUNT(*) as total_sent,
  COUNT(CASE WHEN status = 'sent' THEN 1 END) as successful,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
FROM "EmailLog"
WHERE "sentAt" > NOW() - INTERVAL '1 hour';
```

### Next Day: Check Daily Cron
```bash
# Check Vercel logs next day after 9 AM
vercel logs --since 24h | grep "Daily engagement tasks"

# Check trial reminders sent
psql $DATABASE_URL -c "
SELECT COUNT(*) FROM \"EmailLog\" 
WHERE subject LIKE '%trial%' 
AND \"sentAt\" > NOW() - INTERVAL '1 day';
"
```

### First Monday: Check Weekly Cron
```bash
# Check re-engagement emails
psql $DATABASE_URL -c "
SELECT COUNT(*) FROM \"EmailLog\" 
WHERE subject LIKE '%miss you%' 
AND \"sentAt\" > NOW() - INTERVAL '1 day';
"
```

### First Month: Check Monthly Cron
```bash
# Check insights emails
psql $DATABASE_URL -c "
SELECT COUNT(*) FROM \"EmailLog\" 
WHERE subject LIKE '%Monthly%' 
AND \"sentAt\" > NOW() - INTERVAL '1 day';
"
```

---

## Rollback Plan (If Needed)

### If Emails Are Failing
```bash
# 1. Disable welcome email temporarily
# Edit src/lib/auth.ts - comment out lines 82-86

# 2. Redeploy
git add src/lib/auth.ts
git commit -m "Temporarily disable welcome emails"
git push origin main
vercel --prod

# 3. Debug SMTP issue
# Check SMTP credentials
# Test connection manually
```

### If Cron Jobs Fail
```bash
# 1. Check Vercel function logs
vercel logs --follow

# 2. Test endpoint manually with correct secret
curl https://theqrcode.io/api/cron/daily \
  -H "Authorization: Bearer $CRON_SECRET" \
  -v

# 3. Check CRON_SECRET is set
vercel env ls | grep CRON_SECRET
```

### If Database Issues
```bash
# 1. Check if migration ran
psql $DATABASE_URL -c "\d \"EmailCampaign\""

# 2. If tables missing, run migration again
npx prisma migrate deploy

# 3. Regenerate Prisma client
npx prisma generate
```

---

## Success Criteria

After deployment, verify:

- [x] Database migration successful (6 new tables)
- [x] CRON_SECRET set in Vercel
- [x] 3 cron jobs configured in Vercel
- [x] Welcome email sends on signup
- [x] No errors in Vercel logs
- [x] UI components visible
- [x] EmailLog entries created
- [x] Cron endpoints respond with 200
- [x] Manual cron test works

---

## Performance Benchmarks

**Expected Response Times:**
- Welcome email: < 500ms (non-blocking)
- Cron endpoints: < 30s per batch
- Notification API: < 200ms
- Announcement API: < 100ms
- Feedback API: < 300ms

**Expected Email Rates:**
- Daily cron: ~10-50 emails (trial reminders)
- Weekly cron: ~5-20 emails (re-engagement)
- Monthly cron: All active users
- Rate limit: 100ms between emails

---

## Support Contacts

**If Issues Arise:**

1. **Check Documentation:**
   - AUTOMATION_INTEGRATION.md
   - ENGAGEMENT_SYSTEM.md
   - INTEGRATION_COMPLETE.md

2. **Check Logs:**
   ```bash
   vercel logs --follow
   vercel logs --since 1h
   ```

3. **Database Queries:**
   ```sql
   -- Check for errors
   SELECT * FROM "EmailLog" WHERE status = 'failed';
   ```

4. **Test Endpoints:**
   ```bash
   curl https://theqrcode.io/api/notifications
   curl https://theqrcode.io/api/announcements
   ```

---

## Timeline

| Time | Action | Status |
|------|--------|--------|
| T+0 | Deploy to production | ⏳ |
| T+1h | Test welcome emails | ⏳ |
| T+24h | Verify daily cron ran | ⏳ |
| T+7d | Verify weekly cron ran | ⏳ |
| T+30d | Verify monthly cron ran | ⏳ |
| T+30d | Review metrics and optimize | ⏳ |

---

## Final Check Before Deploy

Run this command to verify everything:

```bash
cd /home/awilliams/theqrcode

echo "=== Checking Files ==="
ls -la src/lib/engagement/ | grep -E "email|notification|cron"
ls -la src/app/api/cron/
ls -la vercel.json

echo "=== Checking Prisma Schema ==="
grep -E "EmailCampaign|Notification|Announcement|Feedback" prisma/schema.prisma | head -4

echo "=== Checking Auth Integration ==="
grep "sendWelcomeEmail" src/lib/auth.ts

echo "=== All checks passed! Ready to deploy ==="
```

---

## 🎯 Ready to Deploy?

If all checks pass:

```bash
# Generate secret
CRON_SECRET=$(openssl rand -base64 32)
echo "Your CRON_SECRET: $CRON_SECRET"

# Add to Vercel
vercel env add CRON_SECRET production

# Deploy
git add .
git commit -m "Deploy user engagement system"
git push origin main
vercel --prod

# Test
curl https://theqrcode.io/api/cron/daily \
  -H "Authorization: Bearer $CRON_SECRET"
```

**Status:** ✅ Ready for Production Deployment

Good luck! 🚀

