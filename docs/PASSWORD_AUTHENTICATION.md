# Password Authentication

## Overview

Email/password authentication has been implemented alongside OTP and OAuth methods. Users can now sign up and sign in using their email and a secure password, with full password reset functionality.

## Features

- ✅ Email and password signup
- ✅ Email and password signin
- ✅ Password strength validation
- ✅ Secure password hashing with bcrypt
- ✅ Password reset via email
- ✅ Reset link expiration (1 hour)
- ✅ Rate limiting on password reset requests
- ✅ Security best practices (no email enumeration)

## User Flow

### Sign Up with Password

1. User goes to `/auth/signup`
2. Clicks "Password" button
3. Enters optional name, email, and password
4. Password is validated for strength
5. Account is created with hashed password
6. User is automatically signed in
7. Redirected to dashboard

### Sign In with Password

1. User goes to `/auth/signin`
2. Clicks "Password" button
3. Enters email and password
4. Credentials are verified
5. Session is created
6. Redirected to dashboard

### Password Reset Flow

1. **Request Reset**
   - User clicks "Forgot password?" on signin page
   - Goes to `/auth/forgot-password`
   - Enters email address
   - Reset link sent via email (1 hour validity)

2. **Reset Password**
   - User clicks reset link in email
   - Taken to `/auth/reset-password?token=...`
   - Enters new password twice
   - Password is updated
   - Auto-redirected to signin page

## Password Requirements

- **Minimum length**: 8 characters
- **Maximum length**: 128 characters  
- **Must contain**: At least one number
- **Must contain**: At least one letter
- **Case**: Case-sensitive

### Examples

✅ **Valid passwords**:
- `password123`
- `MySecure1Pass`
- `P@ssw0rd!`
- `hello_world_2025`

❌ **Invalid passwords**:
- `short1` (too short)
- `password` (no number)
- `12345678` (no letter)

## API Endpoints

### POST `/api/auth/signup-password`

Create a new account with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure123",
  "name": "John Doe" // optional
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Account created successfully"
}
```

**Response (Error - 400):**
```json
{
  "error": "Password must be at least 8 characters long"
}
```

### POST `/api/auth/forgot-password`

Request a password reset email.

**Rate Limit**: 3 requests per hour per email

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (Always 200 for security):**
```json
{
  "success": true,
  "message": "If an account exists with this email, a reset link has been sent"
}
```

**Note**: Returns success even if email doesn't exist to prevent email enumeration attacks.

### POST `/api/auth/reset-password`

Reset password using reset token.

**Request:**
```json
{
  "token": "abc123...",
  "password": "newSecure123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Response (Error - 400):**
```json
{
  "error": "Reset link has expired"
}
```

## Database Schema

### User Model (Updated)

```prisma
model User {
  id            String        @id @default(cuid())
  name          String?
  email         String        @unique
  emailVerified DateTime?
  password      String?       // <-- New field (nullable)
  image         String?
  // ... other fields
}
```

The `password` field is nullable because users can authenticate via:
- Password (has password field)
- OAuth (no password field)
- OTP (no password field)

### PasswordResetToken Model (New)

```prisma
model PasswordResetToken {
  id         String   @id @default(cuid())
  email      String
  token      String   @unique
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  usedAt     DateTime?

  @@index([email, expiresAt])
  @@index([token])
}
```

## NextAuth Integration

### Password Provider

```typescript
CredentialsProvider({
  id: 'password',
  name: 'Email and Password',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    // Verify password and return user
  },
})
```

### Usage

```typescript
import { signIn } from 'next-auth/react'

// Sign in with password
const result = await signIn('password', {
  email: 'user@example.com',
  password: 'secure123',
  redirect: false,
})
```

## Security Features

### 1. Password Hashing

- **Algorithm**: bcrypt
- **Salt rounds**: 12
- **Library**: bcryptjs

```typescript
import bcrypt from 'bcryptjs'

// Hash password
const salt = await bcrypt.genSalt(12)
const hashedPassword = await bcrypt.hash(password, salt)

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword)
```

### 2. Password Strength Validation

Server-side validation ensures passwords meet minimum requirements:

```typescript
export function validatePassword(password: string) {
  if (password.length < 8) return { valid: false, message: '...' }
  if (password.length > 128) return { valid: false, message: '...' }
  if (!/\d/.test(password)) return { valid: false, message: '...' }
  if (!/[a-zA-Z]/.test(password)) return { valid: false, message: '...' }
  return { valid: true }
}
```

### 3. Reset Token Security

- **Token generation**: Cryptographically secure random bytes
- **Token length**: 32 bytes (64 hex characters)
- **Token expiration**: 1 hour
- **Single use**: Tokens can only be used once
- **Cleanup**: Expired tokens are removed

```typescript
import crypto from 'crypto'

const token = crypto.randomBytes(32).toString('hex')
```

### 4. Rate Limiting

**Password Reset Requests**:
- **Limit**: 3 requests per hour per email
- **Storage**: In-memory (consider Redis for production)
- **Purpose**: Prevent abuse and DoS attacks

### 5. No Email Enumeration

Password reset endpoint always returns success, regardless of whether the email exists. This prevents attackers from using the endpoint to discover valid email addresses.

## Email Templates

### Password Reset Email

**Subject**: Reset Your Password - TheQRCode.io

**Features**:
- Branded header
- Clear call-to-action button
- Reset link (also as text)
- Expiration notice (1 hour)
- Security notice
- Professional footer

**Preview**:
```html
<div style="...">
  <h1>TheQRCode.io</h1>
  <h2>Reset Your Password</h2>
  <p>You requested to reset your password...</p>
  <a href="https://theqrcode.io/auth/reset-password?token=...">
    Reset Password
  </a>
  <p>This link will expire in 1 hour.</p>
</div>
```

## Files Created/Modified

### New Files

**Core Utilities**:
- `/src/lib/password.ts` - Password hashing, validation, reset tokens

**API Routes**:
- `/src/app/api/auth/signup-password/route.ts` - Password signup
- `/src/app/api/auth/forgot-password/route.ts` - Request password reset
- `/src/app/api/auth/reset-password/route.ts` - Reset password

**Pages**:
- `/src/app/auth/forgot-password/page.tsx` - Forgot password form
- `/src/app/auth/reset-password/page.tsx` - Reset password form

**Documentation**:
- `/docs/PASSWORD_AUTHENTICATION.md` - This file

### Modified Files

**Database**:
- `/prisma/schema.prisma` - Added password field to User, added PasswordResetToken model

**Authentication**:
- `/src/lib/auth.ts` - Added password Credentials provider
- `/src/app/auth/signin/page.tsx` - Added password signin UI
- `/src/app/auth/signup/page.tsx` - Added password signup UI

## Usage Examples

### Sign Up with Password (Frontend)

```typescript
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Create account
    const response = await fetch('/api/auth/signup-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const data = await response.json()
      alert(data.error)
      return
    }

    // Sign in
    const result = await signIn('password', {
      email,
      password,
      redirect: false,
    })

    if (result?.ok) {
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign Up</button>
    </form>
  )
}
```

### Request Password Reset

```typescript
const response = await fetch('/api/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' }),
})

const data = await response.json()
console.log(data.message) // "If an account exists..."
```

### Reset Password

```typescript
const response = await fetch('/api/auth/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: 'abc123...',
    password: 'newSecure123',
  }),
})

if (response.ok) {
  // Redirect to signin
  window.location.href = '/auth/signin'
}
```

## Testing

### Manual Testing

1. **Test Signup**:
   - Go to http://localhost:3000/auth/signup
   - Click "Password" button
   - Enter email and password
   - Verify account creation and auto-signin

2. **Test Signin**:
   - Go to http://localhost:3000/auth/signin
   - Click "Password" button
   - Enter credentials
   - Verify successful signin

3. **Test Password Reset**:
   - Click "Forgot password?"
   - Enter email
   - Check email for reset link
   - Click link
   - Enter new password
   - Verify password is updated
   - Sign in with new password

### Edge Cases to Test

- ❌ Weak passwords (no number, too short, etc.)
- ❌ Mismatched passwords on reset
- ❌ Expired reset tokens
- ❌ Invalid reset tokens
- ❌ Already used reset tokens
- ✅ Rate limiting (3 reset requests)
- ✅ Non-existent email addresses
- ✅ Password with special characters

## Troubleshooting

### "Invalid email or password"

**Possible causes**:
1. Incorrect email or password
2. Account created with OAuth (no password set)
3. Account created with OTP (no password set)

**Solution**: Use the authentication method you originally signed up with, or reset your password.

### Password reset email not received

**Check**:
1. SMTP configuration in `.env`
2. Email server logs
3. Spam/junk folder
4. Email address spelling

### "Reset link has expired"

Reset links expire after 1 hour. Request a new password reset link.

### "Reset link has already been used"

Each reset link can only be used once. Request a new one if needed.

## Maintenance

### Clean Up Expired Reset Tokens

Add to daily cron job:

```typescript
// src/app/api/cron/daily/route.ts
import { cleanupExpiredPasswordResetTokens } from '@/lib/password'

export async function GET(request: NextRequest) {
  // ... other tasks
  
  // Clean up expired password reset tokens
  const deletedTokens = await cleanupExpiredPasswordResetTokens()
  console.log(`Cleaned up ${deletedTokens} expired password reset tokens`)
  
  // ... other tasks
}
```

## Future Improvements

- [ ] Add "Remember me" functionality
- [ ] Add password strength meter in UI
- [ ] Add 2FA (Two-Factor Authentication)
- [ ] Add Redis for distributed rate limiting
- [ ] Add password history (prevent reuse)
- [ ] Add login attempt tracking and lockout
- [ ] Add "Sign in with passkey" (WebAuthn)
- [ ] Add configurable password policies
- [ ] Add admin dashboard for user management
- [ ] Add email notifications for password changes

## Dependencies

```json
{
  "bcryptjs": "^2.4.3",
  "@types/bcryptjs": "^2.4.6"
}
```

## Related Documentation

- [OTP_AUTHENTICATION.md](./OTP_AUTHENTICATION.md) - OTP authentication
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment configuration
- [ENGAGEMENT_SYSTEM.md](./ENGAGEMENT_SYSTEM.md) - Email automation

## Support

For issues or questions:
- Review this documentation
- Check application logs
- Test with curl/Postman
- Contact: support@theqrcode.io

