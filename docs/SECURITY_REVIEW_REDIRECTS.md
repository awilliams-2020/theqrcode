# Security Review: Redirect Endpoints

## Overview
This document reviews the security of redirect endpoints in the TheQRCode application, focusing on vulnerabilities that could allow information disclosure or code execution.

## Endpoints Reviewed

### 1. `/api/track/[shortCode]` (GET)
**Location:** `src/app/api/track/[shortCode]/route.ts`

**Functionality:** 
- Looks up QR code by shortCode
- Returns HTML page with redirect URL embedded
- Handles different QR code types (url, contact, email, wifi, text, menu)

**Security Issues Found:**

#### 🔴 CRITICAL: XSS Vulnerabilities

**Issue 1: Unsanitized redirectUrl in HTML/JavaScript**
- **Lines 269-361:** `redirectUrl` is directly embedded in HTML and JavaScript without escaping
- **Vulnerable Code:**
  ```typescript
  let redirectUrl = qrCode.content
  // ...
  <p class="redirect-url">${redirectUrl}</p>
  <a href="${redirectUrl}" class="manual-link">...</a>
  window.location.href = '${redirectUrl}';
  ```
- **Attack Vector:** If `qrCode.content` contains malicious JavaScript, it will execute
- **Example Attack:**
  ```
  javascript:alert(document.cookie)
  data:text/html,<script>alert('XSS')</script>
  ```

**Issue 2: Unsanitized contact data in HTML**
- **Lines 481-554:** Contact data is directly embedded without HTML escaping
- **Vulnerable Code:**
  ```typescript
  <h1>${contactData.firstName} ${contactData.lastName}</h1>
  <span class="detail-text">${contactData.email}</span>
  ```
- **Attack Vector:** Malicious contact names/emails with HTML/JavaScript payloads

**Issue 3: Unsanitized email content**
- **Line 697:** Email content directly embedded
- **Vulnerable Code:**
  ```typescript
  <p class="email-address">${qrCode.content}</p>
  ```
- **Attack Vector:** Email addresses with XSS payloads

**Issue 4: Unsanitized WiFi data**
- **Lines 908, 921, 939:** WiFi SSID and password directly embedded
- **Vulnerable Code:**
  ```typescript
  <p>${wifiData.ssid}</p>
  <div class="detail-value password">${wifiData.password}</div>
  ```
- **Attack Vector:** Malicious SSID/password values

**Issue 5: Unsanitized text content**
- **Line 1143:** Text content directly embedded
- **Vulnerable Code:**
  ```typescript
  <p>${qrCode.content}</p>
  ```

**Issue 6: Unsanitized shortCode in JavaScript**
- **Line 18:** `shortCode` used in JavaScript without escaping
- **Vulnerable Code:**
  ```typescript
  const shortCode = '${shortCode}';
  ```
- **Attack Vector:** If shortCode contains quotes or backslashes, it breaks out of the string

#### 🟡 MEDIUM: Open Redirect Vulnerability

**Issue:** No validation of redirect URLs
- **Lines 269-274:** URLs are only checked for protocol prefix, not validated
- **Vulnerable Code:**
  ```typescript
  let redirectUrl = qrCode.content
  if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
    redirectUrl = `https://${redirectUrl}`
  }
  ```
- **Attack Vector:** 
  - `javascript:` URLs (if browser allows)
  - `data:` URLs
  - Protocol-relative URLs (`//evil.com`)
  - URLs with newlines or other control characters

#### 🟡 MEDIUM: Error Information Leakage

**Issue:** Errors may leak sensitive information
- **Lines 1194-1201:** Errors are logged with full context including shortCode
- **Vulnerable Code:**
  ```typescript
  captureException(error, {
    endpoint: '/api/track/[shortCode]',
    method: 'GET',
    shortCode
  })
  ```
- **Risk:** Error messages might contain database errors, stack traces, or other sensitive data

### 2. `/api/track/[shortCode]` (POST)
**Location:** `src/app/api/track/[shortCode]/route.ts`

**Functionality:** Records scan events without redirecting

**Security Issues:**

#### 🟡 MEDIUM: Error Information Leakage
- **Lines 1416-1422:** Similar error handling issues as GET endpoint
- **Lines 1286-1289:** Database errors returned to client with details

### 3. `/r/[shortCode]` (Page)
**Location:** `src/app/r/[shortCode]/page.tsx`

**Functionality:** Client-side redirect to `/api/track/[shortCode]`

**Security Issues:**

#### 🟢 LOW: No direct vulnerabilities
- Uses Next.js routing, which should sanitize URL parameters
- However, relies on `/api/track/[shortCode]` which has vulnerabilities

### 4. `/display/[shortCode]` (Page)
**Location:** `src/app/display/[shortCode]/page.tsx`

**Functionality:** Displays QR code content

**Security Issues:**

#### 🟡 MEDIUM: XSS in Display Page
- **Lines 260-346:** Contact data parsed and displayed without HTML escaping
- **Lines 352-468:** WiFi data displayed without HTML escaping
- **Lines 470-512:** Text content displayed without HTML escaping
- **Lines 514-566:** Email content displayed without HTML escaping

## Recommendations

### Immediate Actions (Critical)

1. **Implement HTML Escaping**
   - Use a library like `he` or `escape-html` to escape all user content
   - Create a utility function for safe HTML rendering
   - Example:
     ```typescript
     import he from 'he'
     const safeHtml = (str: string) => he.encode(str, { useNamedReferences: true })
     ```

2. **Validate and Sanitize Redirect URLs**
   - Whitelist allowed protocols (only `http://` and `https://`)
   - Validate URL format using `URL` constructor
   - Block `javascript:`, `data:`, and other dangerous protocols
   - Example:
     ```typescript
     function validateRedirectUrl(url: string): string | null {
       try {
         const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
         if (!['http:', 'https:'].includes(parsed.protocol)) {
           return null
         }
         return parsed.toString()
       } catch {
         return null
       }
     }
     ```

3. **Sanitize JavaScript String Interpolation**
   - Escape quotes and backslashes in shortCode
   - Use JSON.stringify for safe JavaScript string embedding
   - Example:
     ```typescript
     const safeJsString = JSON.stringify(shortCode)
     ```

### Short-term Actions (High Priority)

4. **Implement Content Security Policy (CSP)**
   - Add CSP headers to prevent XSS attacks
   - Restrict inline scripts and styles
   - Example:
     ```typescript
     headers: {
       'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
     }
     ```

5. **Sanitize Error Messages**
   - Don't expose internal error details to clients
   - Log detailed errors server-side only
   - Return generic error messages to clients
   - Example:
     ```typescript
     return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
     // Log detailed error server-side
     console.error('Detailed error:', error)
     ```

6. **Add Input Validation**
   - Validate shortCode format (alphanumeric, length limits)
   - Reject invalid shortCodes early
   - Example:
     ```typescript
     if (!/^[a-zA-Z0-9]{1,20}$/.test(shortCode)) {
       return NextResponse.json({ error: 'Invalid QR code' }, { status: 400 })
     }
     ```

### Long-term Actions (Medium Priority)

7. **Implement Rate Limiting**
   - Prevent abuse of redirect endpoints
   - Use middleware or a rate limiting library

8. **Add Security Headers**
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Referrer-Policy: strict-origin-when-cross-origin

9. **Regular Security Audits**
   - Use automated security scanning tools
   - Regular code reviews focusing on user input handling

## Testing Recommendations

1. **XSS Testing**
   - Test with payloads: `<script>alert('XSS')</script>`, `javascript:alert(1)`, `"onerror="alert(1)`
   - Test all user-controlled fields (content, contact data, WiFi data, etc.)

2. **Open Redirect Testing**
   - Test with: `javascript:`, `data:`, `//evil.com`, `http://evil.com`
   - Verify redirects only go to whitelisted domains

3. **Error Handling Testing**
   - Test with invalid shortCodes
   - Verify error messages don't leak sensitive information

## References

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP Open Redirect Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)

