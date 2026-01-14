# Data Model Reference

Complete reference of the database schema and data models for TheQRCode.io.

## Core Models

### User
**Purpose:** User accounts and authentication

**Fields:**
- `id` (String, PK) - Unique user identifier
- `email` (String, unique) - User email address
- `name` (String?) - User display name
- `password` (String?) - Hashed password (for password auth)
- `image` (String?) - Profile image URL
- `emailVerified` (DateTime?) - Email verification timestamp
- `isAdmin` (Boolean) - Admin flag
- `timezone` (String) - User timezone (default: "UTC")
- `lastLoginAt` (DateTime?) - Last login timestamp
- `isDeleted` (Boolean) - Soft delete flag
- `deletedAt` (DateTime?) - Deletion timestamp
- `createdAt` (DateTime) - Account creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `accounts` (Account[]) - OAuth accounts
- `apiKeys` (ApiKey[]) - API keys
- `qrCodes` (QrCode[]) - User's QR codes
- `subscription` (Subscription?) - User subscription (one-to-one)
- `webhooks` (Webhook[]) - User's webhooks
- `qrShares` (QrShare[]) - QR code shares

**Indexes:**
- `email` (unique)

### QrCode
**Purpose:** QR code definitions and metadata

**Fields:**
- `id` (String, PK) - Unique QR code identifier
- `userId` (String, FK) - Owner user ID
- `name` (String) - QR code name
- `type` (String) - QR code type: "url", "wifi", "contact", "email", "text", "menu"
- `content` (String) - QR code content/data
- `shortUrl` (String?, unique) - Short URL for redirects
- `settings` (Json) - QR code styling and configuration
- `isDynamic` (Boolean) - Whether QR code can be updated
- `isSandbox` (Boolean) - Created via sandbox API key
- `isDeleted` (Boolean) - Soft delete flag
- `deletedAt` (DateTime?) - Deletion timestamp
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `user` (User) - Owner user
- `scans` (Scan[]) - Scan records
- `shares` (QrShare[]) - Share records

**Indexes:**
- `shortUrl` (unique)
- `userId` + `createdAt` (composite)

**QR Code Types:**
- `url` - Standard URL redirect
- `wifi` - WiFi network credentials
- `contact` - vCard contact information
- `email` - Email with subject/body
- `text` - Plain text content
- `menu` - Restaurant menu (structured JSON)

### Scan
**Purpose:** QR code scan analytics and tracking

**Fields:**
- `id` (String, PK) - Unique scan identifier
- `qrCodeId` (String, FK) - Related QR code ID
- `ipAddress` (String?) - Scanner IP address
- `userAgent` (String?) - Browser/user agent string
- `country` (String?) - Country from IP geolocation
- `city` (String?) - City from IP geolocation
- `device` (String?) - Device type (mobile, desktop, tablet)
- `os` (String?) - Operating system
- `browser` (String?) - Browser name
- `referrer` (String?) - HTTP referrer
- `scannedAt` (DateTime) - Scan timestamp

**Relations:**
- `qrCode` (QrCode) - Related QR code

**Indexes:**
- `qrCodeId` + `scannedAt` (composite)
- `scannedAt` (for time-based queries)

### Subscription
**Purpose:** User subscription and billing information

**Fields:**
- `id` (String, PK) - Unique subscription identifier
- `userId` (String, FK, unique) - User ID (one-to-one)
- `stripeCustomerId` (String?, unique) - Stripe customer ID
- `stripeSubscriptionId` (String?, unique) - Stripe subscription ID
- `stripePriceId` (String?) - Stripe price ID
- `plan` (String) - Plan name: "free", "starter", "pro", "business"
- `status` (String) - Status: "active", "canceled", "trialing", etc.
- `stripeCurrentPeriodEnd` (DateTime?) - Current billing period end
- `trialEndsAt` (DateTime?) - Trial expiration date
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `user` (User) - Owner user

**Indexes:**
- `userId` (unique)
- `stripeCustomerId` (unique)
- `stripeSubscriptionId` (unique)

**Plans:**
- `free` - Free tier (limited features)
- `starter` - $9/month (enhanced analytics)
- `pro` - $29/month (API access, webhooks)
- `business` - $99/month (enterprise features)

## Authentication Models

### Account
**Purpose:** OAuth provider accounts (Google, etc.)

**Fields:**
- `id` (String, PK)
- `userId` (String, FK)
- `type` (String) - Account type
- `provider` (String) - OAuth provider name
- `providerAccountId` (String) - Provider's user ID
- `refresh_token` (String?) - OAuth refresh token
- `access_token` (String?) - OAuth access token
- `expires_at` (Int?) - Token expiration timestamp
- `token_type` (String?) - Token type
- `scope` (String?) - OAuth scopes
- `id_token` (String?) - ID token
- `session_state` (String?) - Session state

**Relations:**
- `user` (User)

**Indexes:**
- `provider` + `providerAccountId` (unique composite)

### VerificationToken
**Purpose:** Email verification tokens

**Fields:**
- `identifier` (String) - Email address
- `token` (String, unique) - Verification token
- `expires` (DateTime) - Expiration timestamp

**Indexes:**
- `identifier` + `token` (unique composite)

### OtpToken
**Purpose:** One-time password tokens for email verification

**Fields:**
- `id` (String, PK)
- `email` (String) - Email address
- `token` (String) - OTP token
- `expiresAt` (DateTime) - Expiration timestamp
- `createdAt` (DateTime) - Creation timestamp
- `usedAt` (DateTime?) - Usage timestamp
- `attempts` (Int) - Verification attempts count

**Indexes:**
- `email` + `expiresAt` (composite)
- `token` (for lookups)

### PasswordResetToken
**Purpose:** Password reset tokens

**Fields:**
- `id` (String, PK)
- `email` (String) - Email address
- `token` (String, unique) - Reset token
- `expiresAt` (DateTime) - Expiration timestamp
- `createdAt` (DateTime) - Creation timestamp
- `usedAt` (DateTime?) - Usage timestamp

**Indexes:**
- `email` + `expiresAt` (composite)
- `token` (for lookups)

### EmailVerificationToken
**Purpose:** Email verification tokens

**Fields:**
- `id` (String, PK)
- `email` (String) - Email address
- `token` (String, unique) - Verification token
- `expiresAt` (DateTime) - Expiration timestamp
- `createdAt` (DateTime) - Creation timestamp
- `usedAt` (DateTime?) - Usage timestamp

**Indexes:**
- `email` + `expiresAt` (composite)
- `token` (for lookups)

## API & Integration Models

### ApiKey
**Purpose:** API keys for developer API access

**Fields:**
- `id` (String, PK)
- `userId` (String, FK) - Owner user ID
- `name` (String) - API key name/description
- `keyHash` (String, unique) - Hashed API key
- `keyPrefix` (String) - Key prefix for display
- `permissions` (String[]) - Permissions array
- `rateLimit` (Int) - Requests per hour limit (default: 1000)
- `environment` (String) - "sandbox" or "production"
- `lastUsedAt` (DateTime?) - Last usage timestamp
- `expiresAt` (DateTime?) - Expiration timestamp
- `isActive` (Boolean) - Active status
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `user` (User) - Owner user
- `apiUsage` (ApiUsage[]) - Usage records

**Indexes:**
- `keyHash` (unique)

### ApiUsage
**Purpose:** API usage tracking and analytics

**Fields:**
- `id` (String, PK)
- `apiKeyId` (String, FK) - Related API key ID
- `endpoint` (String) - API endpoint path
- `method` (String) - HTTP method
- `statusCode` (Int) - HTTP status code
- `responseTime` (Int) - Response time in milliseconds
- `ipAddress` (String?) - Request IP
- `userAgent` (String?) - User agent string
- `createdAt` (DateTime) - Request timestamp

**Relations:**
- `apiKey` (ApiKey) - Related API key

**Indexes:**
- `apiKeyId` + `createdAt` (composite)
- `createdAt` (for time-based queries)

### Webhook
**Purpose:** Webhook configurations for event notifications

**Fields:**
- `id` (String, PK)
- `userId` (String, FK) - Owner user ID
- `name` (String) - Webhook name
- `url` (String) - Webhook URL
- `events` (String[]) - Event types to subscribe to
- `secret` (String) - Webhook signing secret
- `isActive` (Boolean) - Active status
- `lastTriggeredAt` (DateTime?) - Last trigger timestamp
- `failureCount` (Int) - Consecutive failure count
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `user` (User) - Owner user
- `webhookEvents` (WebhookEvent[]) - Event delivery records

**Indexes:**
- `userId` + `createdAt` (composite)

**Webhook Events:**
- `qr_code.created` - QR code created
- `qr_code.updated` - QR code updated
- `qr_code.deleted` - QR code deleted
- `scan.created` - QR code scanned
- `subscription.updated` - Subscription changed

### WebhookEvent
**Purpose:** Webhook delivery tracking and retry logic

**Fields:**
- `id` (String, PK)
- `webhookId` (String, FK) - Related webhook ID
- `eventType` (String) - Event type
- `payload` (Json) - Event payload data
- `status` (String) - "pending", "delivered", "failed"
- `responseCode` (Int?) - HTTP response code
- `responseBody` (String?) - Response body
- `attempts` (Int) - Delivery attempts count
- `maxAttempts` (Int) - Maximum retry attempts (default: 3)
- `nextRetryAt` (DateTime?) - Next retry timestamp
- `deliveredAt` (DateTime?) - Successful delivery timestamp
- `createdAt` (DateTime) - Creation timestamp

**Relations:**
- `webhook` (Webhook) - Related webhook

**Indexes:**
- `webhookId` + `status` (composite)
- `nextRetryAt` (for retry scheduling)

## Engagement Models

### QrShare
**Purpose:** QR code sharing tracking

**Fields:**
- `id` (String, PK)
- `qrCodeId` (String, FK) - Related QR code ID
- `userId` (String, FK) - User who shared
- `message` (String) - Share message
- `shareMethod` (String) - "social", "email", "sms", "link", "download"
- `email` (String?) - Recipient email (for email shares)
- `subject` (String?) - Email subject (for email shares)
- `createdAt` (DateTime) - Share timestamp

**Relations:**
- `qrCode` (QrCode) - Related QR code
- `user` (User) - User who shared

**Indexes:**
- `qrCodeId` + `createdAt` (composite)
- `userId` + `createdAt` (composite)

### Notification
**Purpose:** In-app user notifications

**Fields:**
- `id` (String, PK)
- `userId` (String, FK) - Recipient user ID
- `type` (String) - "usage_alert", "plan_limit", "milestone", "tip", "update"
- `title` (String) - Notification title
- `message` (String) - Notification message
- `actionUrl` (String?) - Action URL
- `priority` (String) - "low", "normal", "high", "urgent"
- `isRead` (Boolean) - Read status
- `readAt` (DateTime?) - Read timestamp
- `createdAt` (DateTime) - Creation timestamp

**Indexes:**
- `userId` + `isRead` (composite)
- `createdAt` (for sorting)

### Announcement
**Purpose:** Platform announcements and feature updates

**Fields:**
- `id` (String, PK)
- `title` (String) - Announcement title
- `content` (String) - Announcement content
- `type` (String) - "feature", "update", "maintenance", "promotion"
- `priority` (String) - "low", "normal", "high"
- `targetPlans` (String[]) - Target subscription plans
- `isActive` (Boolean) - Active status
- `startDate` (DateTime) - Start date
- `endDate` (DateTime?) - End date
- `ctaText` (String?) - Call-to-action text
- `ctaUrl` (String?) - Call-to-action URL
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `views` (AnnouncementView[]) - View records

**Indexes:**
- `isActive` + `startDate` (composite)

### AnnouncementView
**Purpose:** Track announcement views per user

**Fields:**
- `id` (String, PK)
- `announcementId` (String, FK) - Related announcement ID
- `userId` (String, FK) - User who viewed
- `viewedAt` (DateTime) - View timestamp

**Relations:**
- `announcement` (Announcement) - Related announcement

**Indexes:**
- `announcementId` + `userId` (unique composite)
- `userId` (for user queries)

### EmailCampaign
**Purpose:** Email marketing campaigns

**Fields:**
- `id` (String, PK)
- `name` (String) - Campaign name
- `subject` (String) - Email subject
- `template` (String) - Email template/content
- `targetAudience` (String) - "all", "free", "starter", "pro", "business", "trial_ending", "inactive"
- `status` (String) - "draft", "scheduled", "sent", "cancelled"
- `scheduledFor` (DateTime?) - Scheduled send time
- `sentAt` (DateTime?) - Actual send time
- `sentCount` (Int) - Emails sent count
- `openCount` (Int) - Emails opened count
- `clickCount` (Int) - Links clicked count
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Relations:**
- `emailLogs` (EmailLog[]) - Email delivery logs

**Indexes:**
- `status` + `scheduledFor` (composite)

### EmailLog
**Purpose:** Individual email delivery tracking

**Fields:**
- `id` (String, PK)
- `campaignId` (String?, FK) - Related campaign ID (optional)
- `userId` (String, FK) - Recipient user ID
- `emailType` (String) - "campaign", "notification", "announcement"
- `subject` (String) - Email subject
- `status` (String) - "sent", "opened", "clicked", "bounced", "failed"
- `sentAt` (DateTime) - Send timestamp
- `openedAt` (DateTime?) - Open timestamp
- `clickedAt` (DateTime?) - Click timestamp

**Relations:**
- `campaign` (EmailCampaign?) - Related campaign

**Indexes:**
- `userId` + `emailType` (composite)
- `campaignId` (for campaign queries)

## Feedback & Support Models

### Feedback
**Purpose:** User feedback and feature requests

**Fields:**
- `id` (String, PK)
- `userId` (String, FK) - Submitter user ID (optional)
- `type` (String) - "bug", "feature", "improvement", "general"
- `category` (String?) - "usability", "performance", "design", "functionality"
- `rating` (Int?) - Rating 1-5 stars
- `subject` (String) - Feedback subject
- `message` (String) - Feedback message
- `page` (String?) - Page URL where submitted
- `status` (String) - "new", "reviewing", "planned", "completed", "declined"
- `priority` (String) - "low", "normal", "high"
- `adminNotes` (String?) - Admin notes
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Indexes:**
- `userId` + `createdAt` (composite)
- `status` + `priority` (composite)

## Monitoring Models

### UptimeCheck
**Purpose:** System uptime monitoring

**Fields:**
- `id` (String, PK)
- `status` (String) - "up", "down", "degraded"
- `responseTime` (Int?) - Response time in milliseconds
- `statusCode` (Int?) - HTTP status code
- `errorMessage` (String?) - Error message if failed
- `checkedAt` (DateTime) - Check timestamp

**Indexes:**
- `checkedAt` (for time-based queries)
- `status` + `checkedAt` (composite)

### DowntimeIncident
**Purpose:** Track downtime incidents

**Fields:**
- `id` (String, PK)
- `startedAt` (DateTime) - Incident start time
- `endedAt` (DateTime?) - Incident end time
- `duration` (Int?) - Duration in seconds
- `cause` (String?) - "server_error", "database_error", "timeout", "unknown"
- `affectedPaths` (String[]) - Affected endpoints/paths
- `resolved` (Boolean) - Resolution status
- `notes` (String?) - Incident notes

**Indexes:**
- `startedAt` (for time-based queries)
- `resolved` + `startedAt` (composite)

## Security Models

### TrialAbusePrevention
**Purpose:** Prevent trial abuse by tracking deleted accounts

**Fields:**
- `id` (String, PK)
- `emailHash` (String, unique) - Hashed email address
- `deletedAt` (DateTime) - Account deletion timestamp

**Indexes:**
- `emailHash` (unique)

## Common Patterns

### Soft Deletes
Models with soft delete support:
- `User` - `isDeleted`, `deletedAt`
- `QrCode` - `isDeleted`, `deletedAt`

### Timestamps
All models include:
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp (auto-updated)

### Relations
- Use `onDelete: Cascade` for child records
- Use `onDelete: SetNull` for optional relations
- Foreign keys are indexed for performance

### JSON Fields
- `QrCode.settings` - QR code styling configuration
- `WebhookEvent.payload` - Event payload data

## Notes for AI Assistants

1. **Always check soft deletes** - Filter by `isDeleted: false` when querying
2. **Use transactions** - For multi-model operations
3. **Index usage** - Leverage composite indexes for efficient queries
4. **Relations** - Use Prisma `include` to fetch related data efficiently
5. **JSON fields** - Parse/validate JSON fields with Zod schemas
6. **Timestamps** - Use `createdAt`/`updatedAt` for sorting and filtering
