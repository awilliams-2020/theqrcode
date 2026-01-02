# Analytics Email Discrepancy Fix

## Issue Summary

User `cmgztfi360003qm4wi67ix7tz` reported discrepancies between:
- **Monthly email**: Shows 0 scans, 7 active QR codes (should be 4 active QR codes)
- **Daily email**: Shows 2 scans "today" but scans happened on Dec 31 in EST timezone, while email was sent Jan 1 (timezone issue)

## Investigation Results

### Database State (as of Jan 2, 2026)

**User Details:**
- User ID: `cmgztfi360003qm4wi67ix7tz`
- Email: `adam.lee.williams.1989@gmail.com`
- Name: `adam williams`

**QR Codes:**
- Total QR codes: 7
- Active (non-deleted): 4
- Deleted: 3

**Active QR Codes:**
1. `Hello World` (created: 2025-12-20)
2. `XSS test` (created: 2025-12-20)
3. `Redbudway` (created: 2025-12-20)
4. `Restaurant` (created: 2025-12-03)

**Scan Activity:**
- Total scans: 16
- Last scan: Dec 31, 2025 at 21:05:34 UTC
- Scans in January 2026: 0 (all scans are from December 2025)

### Email Logs

1. **Daily Analytics Email** (sent: Jan 1, 2026 at 14:00:02 UTC)
   - Subject: "📊 Your Daily QR Code Analytics Summary"
   - Status: Sent
   - **Verified**: At the time of sending, there were 2 scans in the previous 24 hours (Dec 31 at 21:05 and 21:03 UTC), so this is **CORRECT**

2. **Monthly Insights Email** (sent: Jan 1, 2026 at 15:00:05 UTC)
   - Subject: "📊 Your Monthly QR Code Insights"
   - Status: Sent
   - **Issue Found**: Shows 7 "active" QR codes but only 4 are actually active (non-deleted)

## Root Cause

### Monthly Insights Bug

The `sendMonthlyInsights()` function in `src/lib/engagement/email-automation.ts` had a bug:

**Problem:**
- Line 271: `qrCodes: true` - This includes ALL QR codes, including deleted ones
- Line 325: `qrCodeCount: user.qrCodes.length` - Counts ALL QR codes (7), not just active ones (4)
- Line 283: `const qrCodeIds = user.qrCodes.map(qr => qr.id)` - Includes deleted QR codes in scan queries

**Impact:**
- Monthly email incorrectly shows 7 "active" QR codes when only 4 are actually active
- Scan counts are correct (0 scans in January) but QR code count is wrong

### Daily Analytics - Timezone Bug Fixed

The `sendDailyAnalyticsDigest()` function had a timezone bug:
- **Problem**: Used UTC time for "today" calculation instead of user's timezone
- **Impact**: 
  - Email was sent on Jan 1, 2026 at 14:00:02 UTC (09:00 EST)
  - Scans happened on Dec 31 at 21:05 UTC (16:05 EST)
  - From EST perspective: scans happened "yesterday" (Dec 31), not "today" (Jan 1)
  - But email showed "2 scans today" because it used UTC (where scans were within 24 hours)
- **Fix**: Now uses user's timezone field to calculate "today" and "yesterday" in their local timezone, then converts to UTC for database queries

## Fixes Applied

### Fix 1: Monthly Insights - Exclude Deleted QR Codes

### Changes to `src/lib/engagement/email-automation.ts`

1. **Filter QR codes in query** (Line 270-272):
   ```typescript
   qrCodes: {
     where: { isDeleted: false },
   },
   ```

2. **Filter active QR codes explicitly** (Line 280):
   ```typescript
   const activeQrCodes = user.qrCodes.filter(qr => !qr.isDeleted)
   ```

3. **Use active QR codes only** (Line 282-283):
   ```typescript
   if (!user.email || activeQrCodes.length === 0) continue
   const qrCodeIds = activeQrCodes.map(qr => qr.id)
   ```

4. **Count active QR codes** (Line 325, 333):
   ```typescript
   qrCodeCount: activeQrCodes.length,  // Now shows 4 instead of 7
   ```

5. **Top QR code from active list** (Line 317):
   ```typescript
   const topQrCode = activeQrCodes[0]?.name || 'N/A'
   ```

### Fix 2: Daily Analytics - Use User's Timezone

### Changes to `src/lib/engagement/analytics-notifications.ts`

1. **Fetch user's timezone** (Line 277):
   ```typescript
   timezone: true,
   ```

2. **Use timezone for day calculations** (Line 299-300):
   ```typescript
   const userTimezone = user.timezone || 'UTC'
   const { todayStart, todayEnd, yesterdayStart, yesterdayEnd } = getDayBoundsInUTC(userTimezone)
   ```

3. **Added `getDayBoundsInUTC()` function**:
   - Calculates "today" and "yesterday" boundaries in user's local timezone
   - Converts those boundaries to UTC for database queries
   - Handles timezone offsets and DST correctly

4. **Updated scan queries** (Lines 304-317):
   - Uses `todayStart` and `todayEnd` instead of `oneDayAgo`
   - Uses `yesterdayStart` and `yesterdayEnd` for comparison
   - Ensures "today" means today in the user's timezone, not UTC

## Expected Behavior After Fix

### Monthly Insights Email
- **QR Code Count**: Will show 4 active QR codes (instead of 7)
- **Scan Count**: Will continue to show 0 scans for January (correct)
- **Top QR Code**: Will be selected from active QR codes only

### Daily Analytics Email
- **Timezone-aware**: Now uses user's timezone to determine "today"
- **Example**: If user is in EST and scans happened on Dec 31 at 16:05 EST:
  - Email sent Jan 1 at 09:00 EST will correctly show 0 scans "today"
  - Scans will be counted as "yesterday" (Dec 31) instead
- **User timezone**: Must be set correctly in database (e.g., "America/New_York" for EST)

## Testing Recommendations

1. **Test Monthly Insights**:
   - Create a user with both active and deleted QR codes
   - Run `sendMonthlyInsights()` function
   - Verify email shows only active QR code count

2. **Test Daily Analytics**:
   - Verify scan counts match the 24-hour window calculation
   - Test edge cases (timezone boundaries, midnight crossings)

3. **Database Verification**:
   ```sql
   -- Verify active QR codes count
   SELECT COUNT(*) as active_qr_codes 
   FROM "QrCode" 
   WHERE "userId" = 'USER_ID' AND "isDeleted" = false;
   
   -- Verify monthly scans
   SELECT COUNT(*) as month_scans 
   FROM "Scan" s
   JOIN "QrCode" q ON s."qrCodeId" = q.id
   WHERE q."userId" = 'USER_ID' 
     AND q."isDeleted" = false
     AND s."scannedAt" >= date_trunc('month', CURRENT_DATE);
   ```

## Related Files

- `src/lib/engagement/email-automation.ts` - Fixed monthly insights function (exclude deleted QR codes)
- `src/lib/engagement/analytics-notifications.ts` - Fixed daily analytics function (use user's timezone)
- `src/lib/engagement/email-templates.ts` - Email templates (no changes needed)

## User Action Required

To fix the timezone issue for existing users:
1. Update user's timezone in database:
   ```sql
   UPDATE "User" 
   SET timezone = 'America/New_York' 
   WHERE id = 'cmgztfi360003qm4wi67ix7tz';
   ```
2. Or update via application settings if timezone selection is available
3. Default timezone is 'UTC' if not set

## Date

Fixed: January 2, 2026

