# XSS Test Guide

## Quick XSS Tests for HTML Escaping

Here are specific XSS payloads you can test with your QR codes to verify the escaping is working correctly.

## Test Cases

### 1. URL QR Code Tests

**Test 1: Basic XSS in URL**
```
https://example.com/page<script>alert('XSS')</script>
```
**Expected:** URL should be blocked or sanitized (safeUrl returns '#')

**Test 2: JavaScript Protocol**
```
javascript:alert('XSS')
```
**Expected:** Should be blocked (safeUrl returns '#')

**Test 3: Data Protocol**
```
data:text/html,<script>alert('XSS')</script>
```
**Expected:** Should be blocked (safeUrl returns '#')

**Test 4: URL with HTML Entities**
```
https://example.com/page?param=<script>alert('XSS')</script>
```
**Expected:** Should redirect correctly, display text should show escaped version

**Test 5: URL with Quotes**
```
https://example.com/page"onclick="alert(1)
```
**Expected:** Should redirect correctly, display text should show escaped version

### 2. Contact QR Code Tests

**Test 1: XSS in First Name**
- First Name: `<script>alert('XSS')</script>`
- Last Name: `Test`
- Email: `test@example.com`

**Expected:** Should display as literal text: `&lt;script&gt;alert('XSS')&lt;/script&gt;`

**Test 2: XSS in Email**
- First Name: `John`
- Last Name: `Doe`
- Email: `user<script>alert('XSS')</script>@example.com`

**Expected:** Should display as literal text, email validation should fail or show escaped

**Test 3: XSS in Organization**
- First Name: `John`
- Last Name: `Doe`
- Organization: `Company & <script>alert('XSS')</script> Co.`

**Expected:** Should display as: `Company &amp; &lt;script&gt;alert('XSS')&lt;/script&gt; Co.`

**Test 4: XSS in Phone**
- Phone: `<img src=x onerror=alert(1)>`

**Expected:** Should display as literal text

**Test 5: XSS in Address**
- Address: `123 <script>alert('XSS')</script> St`

**Expected:** Should display as: `123 &lt;script&gt;alert('XSS')&lt;/script&gt; St`

### 3. Email QR Code Tests

**Test 1: Basic XSS**
```
user<script>alert('XSS')</script>@example.com
```
**Expected:** Should display as literal text, mailto link should be blocked or sanitized

**Test 2: XSS with Quotes**
```
user"onclick="alert(1)"@example.com
```
**Expected:** Should display as literal text, mailto validation should fail

### 4. WiFi QR Code Tests

**Test 1: XSS in SSID**
- SSID: `Network<script>alert('XSS')</script>`
- Password: `password123`
- Security: `WPA2`

**Expected:** Should display as: `Network&lt;script&gt;alert('XSS')&lt;/script&gt;`

**Test 2: XSS in Password**
- SSID: `MyNetwork`
- Password: `<script>alert('XSS')</script>`
- Security: `WPA2`

**Expected:** Should display as literal text

**Test 3: XSS in Security Type**
- SSID: `MyNetwork`
- Password: `password123`
- Security: `WPA2<script>alert('XSS')</script>`

**Expected:** Should display as literal text

### 5. Text QR Code Tests

**Test 1: Basic XSS**
```
<script>alert('XSS')</script>
```
**Expected:** Should display as: `&lt;script&gt;alert('XSS')&lt;/script&gt;`

**Test 2: Image XSS**
```
<img src=x onerror=alert(1)>
```
**Expected:** Should display as: `&lt;img src=x onerror=alert(1)&gt;`

**Test 3: Event Handler XSS**
```
"onclick="alert(1)"
```
**Expected:** Should display as: `&quot;onclick=&quot;alert(1)&quot;`

**Test 4: Multi-line XSS**
```
<script>
alert('XSS')
</script>
```
**Expected:** Should display as escaped text with newlines preserved

## How to Test

### Step 1: Create Test QR Codes
1. Go to your QR code generator
2. Create QR codes with each test payload above
3. Note the shortCode for each

### Step 2: Access the QR Codes
1. Visit: `https://theqrcode.io/r/[shortCode]` or `https://theqrcode.io/api/track/[shortCode]`
2. Check the page source (View Source or Inspect Element)
3. Verify that:
   - XSS payloads are escaped in HTML
   - No `<script>` tags execute
   - No `alert()` dialogs appear
   - Content displays as literal text

### Step 3: Verify Functionality
1. **URL QR Codes:** Click redirect link - should redirect correctly
2. **Contact QR Codes:** Download vCard - should work correctly
3. **Email QR Codes:** Click mailto link - should open email client
4. **WiFi QR Codes:** Copy SSID/password - should copy correctly
5. **Text QR Codes:** Copy text - should copy correctly

## Expected Results

### ✅ Success Indicators
- XSS payloads appear as literal text (not executed)
- No JavaScript alerts pop up
- No script tags in rendered HTML
- All functionality still works (redirects, copies, downloads)

### ❌ Failure Indicators
- JavaScript alerts appear
- Script tags execute
- Page redirects unexpectedly
- Functionality breaks

## Browser Console Test

Open browser console and check for:
1. **No errors** related to malformed HTML
2. **No unexpected redirects**
3. **No script execution** (check Network tab for unexpected requests)

## Quick Test Script

You can also test programmatically:

```javascript
// Test HTML escaping
const testPayloads = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert(1)>',
  '"onclick="alert(1)',
  'javascript:alert("XSS")',
  '<svg onload=alert(1)>',
]

// Check if payload appears escaped in HTML
// Should see: &lt;script&gt; not <script>
```

## Common XSS Payloads to Test

1. `<script>alert('XSS')</script>` - Basic script tag
2. `<img src=x onerror=alert(1)>` - Image error handler
3. `<svg onload=alert(1)>` - SVG onload handler
4. `javascript:alert('XSS')` - JavaScript protocol
5. `"onclick="alert(1)` - Event handler injection
6. `<iframe src=javascript:alert(1)>` - Iframe injection
7. `<body onload=alert(1)>` - Body onload handler
8. `<input onfocus=alert(1) autofocus>` - Input focus handler

## Notes

- All these payloads should be **displayed as text**, not executed
- The escaping should happen **server-side** before HTML is sent
- Check the **page source** (not just rendered view) to verify escaping
- Test in **multiple browsers** (Chrome, Firefox, Safari)

