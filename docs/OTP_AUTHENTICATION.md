# OTP (One-Time Password) Authentication

## Overview

Email-based OTP authentication has been implemented as an alternative to traditional password-based authentication. Users can now sign in or sign up using a 6-digit code sent to their email address.

## Features

- ✅ Passwordless authentication via email OTP
- ✅ 6-digit numeric codes
- ✅ 10-minute expiration time
- ✅ Rate limiting (5 OTP requests per hour per email)
- ✅ Brute force protection (5 verification attempts max)
- ✅ Auto-creates user account on first sign-in
- ✅ Works alongside existing OAuth providers (Google, GitHub)

## How It Works

### User Flow

1. **Request OTP**
   - User enters their email address
   - System generates a 6-digit code
   - Code is sent via email
   - Code expires in 10 minutes

2. **Verify OTP**
   - User enters the 6-digit code
   - System verifies the code
   - If valid, user is authenticated
   - New users get a free account automatically

### Technical Flow

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   User      │      │  OTP API     │      │  NextAuth    │
└─────────────┘      └──────────────┘      └──────────────┘
      │                     │                      │
      │──(1) Send OTP───────>                     │
      │    POST /api/auth/otp/send                │
      │                     │                      │
      │<──(2) Code sent─────│                     │
      │                     │                      │
      │──(3) Verify OTP──────────────────────────>│
      │    signIn('credentials', {email, token})  │
      │                                            │
      │<──(4) Authenticated────────────────────────│
      │                                            │
```

## Implementation Details

### Database Schema

New `OtpToken` model in Prisma schema:

```prisma
model OtpToken {
  id         String   @id @default(cuid())
  email      String
  token      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  usedAt     DateTime?
  attempts   Int      @default(0)

  @@index([email, expiresAt])
  @@index([token])
}
```

### API Endpoints

#### POST `/api/auth/otp/send`
Generates and sends an OTP to the user's email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Code sent to your email"
}
```

**Response (Rate Limited):**
```json
{
  "error": "Too many requests. Please try again later."
}
```

#### POST `/api/auth/otp/verify`
Verifies an OTP code (used internally by NextAuth).

**Request:**
```json
{
  "email": "user@example.com",
  "token": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Code verified successfully"
}
```

**Response (Invalid):**
```json
{
  "error": "Invalid code"
}
```

### NextAuth Integration

Added `CredentialsProvider` to NextAuth configuration:

```typescript
CredentialsProvider({
  id: 'otp',
  name: 'Email OTP',
  credentials: {
    email: { label: 'Email', type: 'email' },
    token: { label: 'Code', type: 'text' },
  },
  async authorize(credentials) {
    // Verify OTP
    // Find or create user
    // Return user object
  },
})
```

**Session Strategy:** Changed from `database` to `jwt` to support Credentials provider.

### Email Template

OTP emails include:
- Branded header with TheQRCode.io logo
- Large, centered 6-digit code
- Expiration time (10 minutes)
- Security notice
- Professional footer

### Security Features

1. **Rate Limiting**
   - Max 5 OTP requests per email per hour
   - Prevents spam and abuse

2. **Attempt Tracking**
   - Max 5 verification attempts per code
   - Prevents brute force attacks

3. **Token Expiration**
   - Codes expire after 10 minutes
   - Old codes are automatically cleaned up

4. **Single Use**
   - Each code can only be used once
   - Marked as used after successful verification

5. **Email Validation**
   - Server-side email format validation
   - Client-side validation in forms

## Files Added/Modified

### New Files
- `/src/lib/otp.ts` - OTP generation and verification utilities
- `/src/app/api/auth/otp/send/route.ts` - OTP sending endpoint
- `/src/app/api/auth/otp/verify/route.ts` - OTP verification endpoint
- `/docs/OTP_AUTHENTICATION.md` - This documentation

### Modified Files
- `/prisma/schema.prisma` - Added OtpToken model
- `/src/lib/auth.ts` - Added Credentials provider, changed to JWT strategy
- `/src/app/auth/signin/page.tsx` - Added OTP signin flow UI
- `/src/app/auth/signup/page.tsx` - Added OTP signup flow UI

## Usage

### For Users

**Sign In:**
1. Go to `/auth/signin`
2. Click "Sign in with Email Code"
3. Enter email address
4. Check email for 6-digit code
5. Enter code to sign in

**Sign Up:**
1. Go to `/auth/signup`
2. Click "Sign up with Email Code"
3. Enter email address
4. Check email for 6-digit code
5. Enter code to create account

### For Developers

**Send OTP:**
```typescript
const response = await fetch('/api/auth/otp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' }),
})
```

**Sign In with OTP:**
```typescript
import { signIn } from 'next-auth/react'

const result = await signIn('credentials', {
  email: 'user@example.com',
  token: '123456',
  redirect: false,
})
```

## Configuration

### Environment Variables

Required for OTP to work:
```env
# Email Configuration
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@yourdomain.com

# NextAuth Configuration
NEXTAUTH_URL=https://theqrcode.io
NEXTAUTH_SECRET=your_nextauth_secret
```

## Testing

### Manual Testing

1. **Test OTP Send:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/otp/send \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com"}'
   ```

2. **Check email for code**

3. **Test OTP Sign In:**
   - Go to http://localhost:3000/auth/signin
   - Click "Sign in with Email Code"
   - Enter your email
   - Enter the code from your email

### Automated Testing

Create test files in `/tests/auth/`:

```typescript
// tests/auth/otp.test.ts
describe('OTP Authentication', () => {
  test('should send OTP', async () => {
    // Test implementation
  })
  
  test('should verify valid OTP', async () => {
    // Test implementation
  })
  
  test('should reject expired OTP', async () => {
    // Test implementation
  })
})
```

## Maintenance

### Cleanup Expired Tokens

A cleanup function is provided to remove expired OTP tokens:

```typescript
import { cleanupExpiredOTPTokens } from '@/lib/otp'

// Run periodically (e.g., in a cron job)
const deletedCount = await cleanupExpiredOTPTokens()
console.log(`Cleaned up ${deletedCount} expired OTP tokens`)
```

**Recommendation:** Add this to your daily cron jobs in `/src/app/api/cron/daily/route.ts`

## Troubleshooting

### OTP Not Received

1. Check SMTP configuration in `.env`
2. Check email server logs
3. Check spam/junk folder
4. Verify email address is valid

### Invalid Code Error

1. Check if code has expired (>10 minutes)
2. Check if code has already been used
3. Check if too many attempts (>5)
4. Request a new code

### Rate Limit Error

- User has requested too many codes (>5 per hour)
- Wait 1 hour or clear rate limit cache
- For development, restart server to clear memory cache

### Redirect Not Working After OTP Verification

**Fixed:** Ensure the provider ID matches in both auth config and signIn call:
- Auth config uses: `id: 'otp'`
- Sign in call must use: `signIn('otp', ...)`
- Added session refresh: `await getSession()` before redirect
- Added router refresh: `router.refresh()` after redirect

## Future Improvements

- [ ] Add Redis for distributed rate limiting
- [ ] Add SMS OTP as alternative to email
- [ ] Add configurable expiration times
- [ ] Add admin dashboard to view OTP usage
- [ ] Add monitoring and alerts for failed OTP attempts
- [ ] Add A/B testing for different code lengths
- [ ] Add internationalization for email templates

## Support

For issues or questions:
- Check application logs
- Review this documentation
- Contact: support@theqrcode.io

