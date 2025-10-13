# Environment Variables Setup

Add these to your `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/theqrcode"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# SMTP Email Configuration (Already configured)
SMTP_HOST="mail.redbudway.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="noreply@theqrcode.io"
SMTP_PASS="your-smtp-password"
SMTP_FROM="noreply@theqrcode.io"
CONTACT_EMAIL="support@theqrcode.io"

# NEW: Cron Job Security
CRON_SECRET="your-random-secure-secret-here"

# Google Ads Conversion Tracking (Optional - for marketing campaigns)
# Get these values from Google Ads > Tools > Conversions
NEXT_PUBLIC_GOOGLE_ADS_ID="AW-XXXXXXXXXX"
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_TRIAL="AbC-DefG123"
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_DEMO="XyZ-AbcD456"
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_PAYMENT="PaymentConversion"
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_API="ApiKeyConversion"
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_BUSINESS="BusinessUpgrade"

# App Settings
NODE_ENV="development"
```

## Generate CRON_SECRET

```bash
# Generate a secure random secret
openssl rand -base64 32
```

## Add to Vercel

```bash
vercel env add CRON_SECRET
# Paste the generated secret when prompted
```

## Google Ads Setup (Optional)

### 1. Create Google Ads Account
- Go to https://ads.google.com
- Create a new account or use existing
- Set up billing information

### 2. Create Conversion Actions

In Google Ads dashboard:
1. Go to **Tools & Settings** > **Measurement** > **Conversions**
2. Click **+ New conversion action**
3. Select **Website**

Create these conversion actions:

#### Trial Signup Conversion
- **Goal:** Submit lead form
- **Name:** Trial Signup
- **Value:** Use the same value for each conversion ($20)
- **Count:** One
- Copy the conversion ID (e.g., `AW-123456789/AbC-DefG123`)
- Set as `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_TRIAL`

#### Demo Usage Conversion (Micro-conversion)
- **Goal:** Page view or custom event
- **Name:** Demo QR Generated
- **Value:** Use the same value for each conversion ($5)
- **Count:** Every
- Copy the conversion ID
- Set as `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_DEMO`

#### Paid Subscription Conversion
- **Goal:** Purchase
- **Name:** Paid Subscription
- **Value:** Use transaction-specific value
- **Count:** One
- Copy the conversion ID
- Set as `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_PAYMENT`

#### API Key Created (Pro feature)
- **Goal:** Custom event
- **Name:** API Key Created
- **Value:** $15
- Copy and set as `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_API`

#### Business Plan Upgrade
- **Goal:** Purchase
- **Name:** Business Plan Upgrade
- **Value:** $50
- Copy and set as `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_BUSINESS`

### 3. Get Your Google Ads ID

1. In Google Ads, go to **Tools & Settings** > **Setup** > **Account settings**
2. Find your **Customer ID** (format: 123-456-7890)
3. Convert to AW format: `AW-1234567890` (remove dashes)
4. Set as `NEXT_PUBLIC_GOOGLE_ADS_ID`

### 4. Test Conversion Tracking

After deploying with the environment variables:

1. Visit your site in an incognito browser
2. Perform a conversion action (e.g., trial signup)
3. In Google Ads, go to **Tools** > **Conversions**
4. Check if the conversion appears (may take up to 24 hours)

### 5. Usage in Code

The tracking is already set up in:
- `src/app/layout.tsx` - Base tracking script
- `src/lib/google-ads.ts` - Conversion tracking utilities
- `src/types/gtag.d.ts` - TypeScript definitions

To track conversions in your components:

```typescript
import { trackConversion } from '@/lib/google-ads';

// After successful trial signup
trackConversion('trial_signup', undefined, userId);

// After demo usage
trackConversion('demo_usage');

// After paid subscription
trackConversion('paid_subscription', subscriptionAmount, subscriptionId);
```

### 6. Verify Setup

Check browser console for:
- `Google Ads conversion tracked: trial_signup` messages
- No errors about missing gtag

Check Network tab for:
- Requests to `googletagmanager.com`
- Conversion ping requests

