# API Endpoints Reference

Complete reference of all API endpoints in TheQRCode.io for AI assistants and developers.

## Authentication Endpoints

### `/api/auth/[...nextauth]`
- **Purpose:** NextAuth.js authentication handler
- **Methods:** GET, POST
- **Auth:** Public
- **Description:** Handles OAuth callbacks, session management, and authentication

### `/api/auth/check-user`
- **Purpose:** Check if user exists
- **Methods:** POST
- **Auth:** Public
- **Description:** Validates user email/account existence

### `/api/auth/signup-password`
- **Purpose:** Create account with password
- **Methods:** POST
- **Auth:** Public
- **Body:** `{ email, password, name }`

### `/api/auth/signup-plan`
- **Purpose:** Signup with plan selection
- **Methods:** POST
- **Auth:** Public
- **Body:** `{ email, plan }`

### `/api/auth/forgot-password`
- **Purpose:** Request password reset
- **Methods:** POST
- **Auth:** Public
- **Body:** `{ email }`

### `/api/auth/reset-password`
- **Purpose:** Reset password with token
- **Methods:** POST
- **Auth:** Public
- **Body:** `{ token, password }`

### `/api/auth/otp/send`
- **Purpose:** Send OTP for email verification
- **Methods:** POST
- **Auth:** Public
- **Body:** `{ email }`

### `/api/auth/otp/verify`
- **Purpose:** Verify OTP token
- **Methods:** POST
- **Auth:** Public
- **Body:** `{ email, token }`

### `/api/auth/verify-email`
- **Purpose:** Verify email with token
- **Methods:** GET
- **Auth:** Public
- **Query:** `?token=...`

### `/api/auth/resend-verification`
- **Purpose:** Resend email verification
- **Methods:** POST
- **Auth:** Public
- **Body:** `{ email }`

### `/api/auth/setup-subscription`
- **Purpose:** Setup initial subscription
- **Methods:** POST
- **Auth:** Authenticated
- **Body:** `{ plan }`

## QR Code Endpoints

### `/api/qr-codes`
- **Purpose:** List/create QR codes
- **Methods:** GET, POST
- **Auth:** Authenticated
- **GET Query:** `?page=1&limit=10`
- **POST Body:** `{ name, type, content, settings }`

### `/api/qr-codes/[id]`
- **Purpose:** Get/update/delete specific QR code
- **Methods:** GET, PATCH, DELETE
- **Auth:** Authenticated (owner only)
- **PATCH Body:** `{ name?, content?, settings? }`

## Analytics Endpoints

### `/api/analytics`
- **Purpose:** Get user analytics summary
- **Methods:** GET
- **Auth:** Authenticated
- **Query:** `?period=week|month|year`

### `/api/analytics/[qrCodeId]`
- **Purpose:** Get analytics for specific QR code
- **Methods:** GET
- **Auth:** Authenticated (owner only)
- **Query:** `?period=week|month|year`

### `/api/analytics/export`
- **Purpose:** Export analytics data
- **Methods:** GET
- **Auth:** Authenticated
- **Query:** `?format=csv|json&period=...`

### `/api/analytics/notifications`
- **Purpose:** Get/manage analytics notifications
- **Methods:** GET, POST
- **Auth:** Authenticated
- **POST Body:** `{ qrCodeId?, threshold, type }`

## Tracking Endpoints

### `/api/track/[shortCode]`
- **Purpose:** Track QR code scan
- **Methods:** GET
- **Auth:** Public
- **Description:** Records scan analytics and redirects to QR code URL

### `/api/qr-info/[shortCode]`
- **Purpose:** Get QR code metadata (public)
- **Methods:** GET
- **Auth:** Public
- **Description:** Returns QR code info without tracking scan

### `/api/qr-image/[shortCode]`
- **Purpose:** Get QR code image
- **Methods:** GET
- **Auth:** Public
- **Description:** Returns QR code image file

## API v1 Endpoints (Developer API)

### `/api/v1/qr-codes`
- **Purpose:** List/create QR codes via API
- **Methods:** GET, POST
- **Auth:** API Key required
- **Headers:** `Authorization: Bearer <api-key>`
- **POST Body:** `{ name, type, content, settings }`

### `/api/v1/qr-codes/[id]`
- **Purpose:** Get/update/delete QR code via API
- **Methods:** GET, PATCH, DELETE
- **Auth:** API Key required

### `/api/v1/qr-codes/bulk`
- **Purpose:** Bulk create QR codes
- **Methods:** POST
- **Auth:** API Key required
- **Body:** `{ qrCodes: [...] }`

### `/api/v1/analytics`
- **Purpose:** Get analytics via API
- **Methods:** GET
- **Auth:** API Key required
- **Query:** `?qrCodeId=...&period=...`

### `/api/v1/scans`
- **Purpose:** Get scan data via API
- **Methods:** GET
- **Auth:** API Key required
- **Query:** `?qrCodeId=...&limit=...&offset=...`

### `/api/v1/api-keys`
- **Purpose:** Manage API keys
- **Methods:** GET, POST
- **Auth:** Authenticated
- **POST Body:** `{ name, permissions, environment }`

### `/api/v1/api-keys/[id]`
- **Purpose:** Get/update/delete API key
- **Methods:** GET, PATCH, DELETE
- **Auth:** Authenticated (owner only)

### `/api/v1/webhooks`
- **Purpose:** Manage webhooks
- **Methods:** GET, POST
- **Auth:** Authenticated
- **POST Body:** `{ name, url, events }`

### `/api/v1/webhooks/[id]`
- **Purpose:** Get/update/delete webhook
- **Methods:** GET, PATCH, DELETE
- **Auth:** Authenticated (owner only)

### `/api/v1/share`
- **Purpose:** Share QR code via API
- **Methods:** POST
- **Auth:** API Key required
- **Body:** `{ qrCodeId, shareMethod, email?, subject? }`

## User Endpoints

### `/api/user/subscription`
- **Purpose:** Get/update user subscription
- **Methods:** GET, PATCH
- **Auth:** Authenticated
- **PATCH Body:** `{ plan }`

### `/api/user/timezone`
- **Purpose:** Update user timezone
- **Methods:** POST
- **Auth:** Authenticated
- **Body:** `{ timezone }`

### `/api/user/export-data`
- **Purpose:** Export user data (GDPR)
- **Methods:** GET
- **Auth:** Authenticated
- **Query:** `?format=json|csv`

### `/api/user/delete-account`
- **Purpose:** Delete user account
- **Methods:** POST
- **Auth:** Authenticated
- **Body:** `{ confirm: true }`

## Stripe Endpoints

### `/api/stripe/checkout`
- **Purpose:** Create Stripe checkout session
- **Methods:** POST
- **Auth:** Authenticated
- **Body:** `{ priceId, plan }`

### `/api/stripe/portal`
- **Purpose:** Create Stripe customer portal session
- **Methods:** POST
- **Auth:** Authenticated

### `/api/stripe/create-customer`
- **Purpose:** Create Stripe customer
- **Methods:** POST
- **Auth:** Authenticated
- **Body:** `{ email }`

### `/api/stripe/webhook`
- **Purpose:** Handle Stripe webhooks
- **Methods:** POST
- **Auth:** Stripe signature verification
- **Description:** Processes subscription events, payment updates

## Notification Endpoints

### `/api/notifications`
- **Purpose:** Get user notifications
- **Methods:** GET, POST
- **Auth:** Authenticated
- **GET Query:** `?unreadOnly=true`
- **POST Body:** `{ type, title, message, actionUrl }`

### `/api/notifications/[id]`
- **Purpose:** Get/update/delete notification
- **Methods:** GET, PATCH, DELETE
- **Auth:** Authenticated (owner only)
- **PATCH Body:** `{ isRead: true }`

## Announcement Endpoints

### `/api/announcements`
- **Purpose:** Get active announcements
- **Methods:** GET, POST
- **Auth:** GET public, POST admin only
- **POST Body:** `{ title, content, type, targetPlans }`

### `/api/announcements/[id]/view`
- **Purpose:** Mark announcement as viewed
- **Methods:** POST
- **Auth:** Authenticated
- **Description:** Records user view of announcement

## Cron Endpoints

### `/api/cron/daily`
- **Purpose:** Daily cron job
- **Methods:** GET, POST
- **Auth:** CRON_SECRET header
- **Description:** Runs daily tasks (email campaigns, trial reminders)

### `/api/cron/weekly`
- **Purpose:** Weekly cron job
- **Methods:** GET, POST
- **Auth:** CRON_SECRET header
- **Description:** Runs weekly tasks (analytics reports)

### `/api/cron/monthly`
- **Purpose:** Monthly cron job
- **Methods:** GET, POST
- **Auth:** CRON_SECRET header
- **Description:** Runs monthly tasks (usage summaries)

### `/api/cron/health-check`
- **Purpose:** Health check endpoint
- **Methods:** GET
- **Auth:** CRON_SECRET header
- **Description:** Monitors system health

## Utility Endpoints

### `/api/health` & `/api/health/check`
- **Purpose:** Application health check
- **Methods:** GET
- **Auth:** Public
- **Description:** Returns application status

### `/api/contact/[shortCode]`
- **Purpose:** Handle contact QR code actions
- **Methods:** GET, POST
- **Auth:** Public
- **Description:** Processes vCard contact QR codes

### `/api/contact`
- **Purpose:** General contact endpoint
- **Methods:** POST
- **Auth:** Public
- **Body:** `{ email, message, subject }`

### `/api/feedback`
- **Purpose:** Submit user feedback
- **Methods:** POST
- **Auth:** Authenticated (optional)
- **Body:** `{ type, category, rating, subject, message, page }`

### `/api/realtime/polling`
- **Purpose:** Real-time data polling
- **Methods:** GET
- **Auth:** Authenticated
- **Query:** `?lastUpdate=...`

### `/api/webhook-test`
- **Purpose:** Test webhook delivery
- **Methods:** POST
- **Auth:** Authenticated
- **Body:** `{ webhookId, eventType }`

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

## Authentication

### Session-based (Web)
- Uses NextAuth.js sessions
- Cookie-based authentication
- Check with `await auth()` in route handlers

### API Key (v1 endpoints)
- Header: `Authorization: Bearer <api-key>`
- API keys managed via `/api/v1/api-keys`
- Rate limiting: 1000 requests/hour (default)

## Rate Limiting

- **Web endpoints:** Per-user rate limiting
- **API v1 endpoints:** Per API key rate limiting
- **Public endpoints:** IP-based rate limiting

## Error Codes

- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `429` - Rate limit exceeded
- `500` - Internal server error

## Notes for AI Assistants

1. **Always check authentication** before accessing user data
2. **Validate ownership** when accessing resources (QR codes, API keys, etc.)
3. **Use Prisma transactions** for multi-step operations
4. **Handle errors gracefully** with proper error messages
5. **Follow existing patterns** in similar endpoints
6. **Test API endpoints** using the test suite in `tests/`
