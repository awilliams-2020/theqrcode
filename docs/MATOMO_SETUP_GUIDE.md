# Matomo Analytics - Setup Guide

Step-by-step guide to get comprehensive Matomo tracking working in your TheQRCode.io installation.

## Prerequisites

- A Matomo instance (self-hosted or cloud)
- Admin access to your Matomo dashboard
- Access to TheQRCode.io environment variables

## Step 1: Install and Configure Matomo

### Option A: Self-Hosted Matomo

1. Follow the [Matomo installation guide](https://matomo.org/docs/installation/)
2. Create a new website in Matomo
3. Note your Matomo URL and Site ID

### Option B: Matomo Cloud

1. Sign up at [matomo.org](https://matomo.org/start-free-analytics-trial/)
2. Create a new website
3. Note your Matomo URL and Site ID

## Step 2: Configure Environment Variables

Add these to your `.env` file:

```env
# Required for both client and server tracking
NEXT_PUBLIC_MATOMO_URL=https://your-matomo-instance.com
NEXT_PUBLIC_MATOMO_SITE_ID=1

# Required for server-side tracking (get from Matomo Dashboard > Settings > Security)
MATOMO_AUTH_TOKEN=your_auth_token_here
```

### Getting Your Auth Token

1. Log into Matomo Dashboard
2. Go to **Settings > Personal > Security**
3. Click **Create new token**
4. Give it a description like "TheQRCode Server Tracking"
5. Select **Write** permission
6. Copy the token and add it to your `.env` file

## Step 3: Configure Custom Dimensions

Custom dimensions allow you to segment and filter your analytics data.

### Visit-Scoped Dimensions

In Matomo Dashboard, go to **Settings > Custom Dimensions** and click **Configure a new dimension**:

| Dimension ID | Name | Scope | Active | Extractions |
|--------------|------|-------|--------|-------------|
| 1 | User ID | Visit | ✅ | - |
| 2 | Subscription Plan | Visit | ✅ | - |
| 3 | Subscription Status | Visit | ✅ | - |
| 4 | User Role | Visit | ✅ | - |

### Action-Scoped Dimensions

Continue creating dimensions:

| Dimension ID | Name | Scope | Active | Extractions |
|--------------|------|-------|--------|-------------|
| 5 | QR Code ID | Action | ✅ | - |
| 6 | QR Code Type | Action | ✅ | - |
| 7 | QR Code Dynamic | Action | ✅ | - |
| 8 | API Endpoint | Action | ✅ | - |
| 9 | API Version | Action | ✅ | - |
| 10 | Error Type | Action | ✅ | - |
| 11 | Conversion Type | Action | ✅ | - |
| 12 | Payment Plan | Action | ✅ | - |
| 13 | Campaign Source | Action | ✅ | - |

**Note:** The dimension IDs in Matomo must match the IDs in `/src/lib/matomo-config.ts`. If they don't match, update the config file.

## Step 4: Configure Goals

Goals track important conversions and milestones.

In Matomo Dashboard, go to **Settings > Measurables > Goals** and click **Add a new goal**:

### User Acquisition Goals

**Goal 1: User Signup**
- Name: `User Signup`
- Description: `New user registration`
- Goal is triggered: `Manually (using the Tracking code)`
- Revenue: Not enabled

**Goal 2: Email Verified**
- Name: `Email Verified`
- Description: `Email verification completed`
- Goal is triggered: `Manually`

**Goal 3: Trial Started**
- Name: `Trial Started`
- Description: `Free trial started`
- Goal is triggered: `Manually`

### Engagement Goals

**Goal 4: First QR Code Created**
- Name: `First QR Code Created`
- Description: `User created their first QR code`
- Goal is triggered: `Manually`

**Goal 5: QR Code Shared**
- Name: `QR Code Shared`
- Description: `QR code downloaded or shared`
- Goal is triggered: `Manually`

**Goal 6: First Scan Received**
- Name: `First Scan Received`
- Description: `First scan on any QR code`
- Goal is triggered: `Manually`

### Revenue Goals

**Goal 10: Subscription Started**
- Name: `Subscription Started`
- Description: `Paid subscription started`
- Goal is triggered: `Manually`
- Revenue: ✅ **Enable** (Revenue will be tracked per conversion)

**Goal 11: Subscription Upgraded**
- Name: `Subscription Upgraded`
- Description: `Upgraded to higher tier`
- Goal is triggered: `Manually`
- Revenue: ✅ **Enable**

**Goal 12: Subscription Renewed**
- Name: `Subscription Renewed`
- Description: `Subscription renewed`
- Goal is triggered: `Manually`
- Revenue: ✅ **Enable**

### API Goals

**Goal 20: API Key Created**
- Name: `API Key Created`
- Description: `API key generated`
- Goal is triggered: `Manually`

**Goal 21: First API Call**
- Name: `First API Call`
- Description: `First API request made`
- Goal is triggered: `Manually`

### Milestone Goals

**Goal 30: 10 QR Codes**
- Name: `10 QR Codes`
- Description: `Created 10 QR codes`
- Goal is triggered: `Manually`

**Goal 31: 100 Scans**
- Name: `100 Scans`
- Description: `Received 100 total scans`
- Goal is triggered: `Manually`

**Goal 32: 1000 Scans**
- Name: `1000 Scans`
- Description: `Received 1000 total scans`
- Goal is triggered: `Manually`

## Step 5: Verify Configuration

### Update Config File (If Needed)

If your Matomo dimension or goal IDs don't match the defaults, update `/src/lib/matomo-config.ts`:

```typescript
export const MatomoCustomDimensions = {
  USER_ID: 1,                    // Update these IDs if different
  SUBSCRIPTION_PLAN: 2,
  // ... etc
};

export const MatomoGoals = {
  USER_SIGNUP: 1,                // Update these IDs if different
  EMAIL_VERIFIED: 2,
  // ... etc
};
```

### Test the Installation

1. Restart your Next.js application:
   ```bash
   npm run dev
   ```

2. Open your browser console and check for:
   - `_paq` array should be defined
   - Network requests to `/matomo.php` when you navigate pages

3. Test tracking:
   ```typescript
   // Open browser console
   window._paq.push(['trackEvent', 'Test', 'Test Event']);
   ```

4. Check Matomo Dashboard:
   - Go to **Visitors > Real-time**
   - You should see your test event

## Step 6: Deploy to Production

1. Add environment variables to your production environment
2. Deploy your application
3. Verify tracking is working in production

## Step 7: Set Up Reports and Dashboards

### Recommended Dashboards

**User Acquisition Dashboard**
- New users over time
- Signup conversion rate
- Email verification rate
- Traffic sources

**QR Code Analytics Dashboard**
- QR codes created over time
- QR code types distribution
- Total scans over time
- Scans by device/location

**Revenue Dashboard**
- Subscription revenue over time
- Upgrades vs. new subscriptions
- Churn rate
- Average revenue per user (ARPU)

**Engagement Dashboard**
- Active users
- Feature usage
- Time on site
- Page views per session

### Custom Segments

Create segments for better analysis:

1. **Free Users**
   - Custom Dimension: Subscription Plan = "free"

2. **Paid Users**
   - Custom Dimension: Subscription Plan ∈ ["starter", "pro", "business"]

3. **Trial Users**
   - Custom Dimension: Subscription Status = "trialing"

4. **Power Users**
   - Goal: 10 QR Codes is converted

## Step 8: Set Up Alerts (Optional)

Configure email alerts for important events:

1. Go to **Settings > Alerts**
2. Create alerts for:
   - Daily signups drop below threshold
   - Revenue drop
   - Error rate increase
   - High churn rate

## Troubleshooting

### Tracking Not Working

**Check 1: Environment Variables**
```bash
# In your terminal
echo $NEXT_PUBLIC_MATOMO_URL
echo $NEXT_PUBLIC_MATOMO_SITE_ID
```

**Check 2: Browser Console**
```javascript
// Should show array
console.log(window._paq);
```

**Check 3: Network Tab**
- Look for requests to `/matomo.php`
- Check response status (should be 200)

**Check 4: Matomo Logs**
- Check server logs in Matomo
- Look for tracking API errors

### Custom Dimensions Not Showing

1. Verify dimensions are created in Matomo
2. Check dimension IDs match config file
3. Re-archive reports:
   ```bash
   ./console core:archive --force-all-websites
   ```

### Goals Not Triggering

1. Check goal IDs in config match Matomo
2. Verify goal is set to "Manually triggered"
3. Check Matomo Real-time visitor log

### Server-Side Tracking Failing

1. Verify `MATOMO_AUTH_TOKEN` is set correctly
2. Check token has "Write" permission
3. Check Matomo server logs for authentication errors

## Security Best Practices

1. **Protect Auth Token**
   - Never commit `.env` file
   - Use secrets management in production
   - Rotate token periodically

2. **GDPR Compliance**
   - Enable IP anonymization in Matomo
   - Set up cookie consent if required
   - Document data retention policies

3. **Rate Limiting**
   - Matomo has built-in rate limiting
   - Monitor for unusual tracking patterns
   - Set up alerts for suspicious activity

## Next Steps

- Review [MATOMO_TRACKING.md](./MATOMO_TRACKING.md) for detailed implementation guide
- Check [MATOMO_QUICK_REFERENCE.md](./MATOMO_QUICK_REFERENCE.md) for code examples
- Set up custom dashboards in Matomo
- Configure email reports
- Train team on using Matomo analytics

## Support

- [Matomo Documentation](https://matomo.org/docs/)
- [Matomo Community Forums](https://forum.matomo.org/)
- [Matomo Issue Tracker](https://github.com/matomo-org/matomo/issues)

---

**Setup Time:** ~30-60 minutes  
**Difficulty:** Intermediate  
**Last Updated:** October 2025

