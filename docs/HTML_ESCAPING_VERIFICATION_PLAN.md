# HTML Escaping Implementation - Verification Plan

## Current Usage Analysis

### 1. URL Redirects (`redirectUrl`)
**Current Usage:**
- **Line 354:** Display text: `<p class="redirect-url">${redirectUrl}</p>`
- **Line 355:** href attribute: `<a href="${redirectUrl}">`
- **Line 361:** JavaScript redirect: `window.location.href = '${redirectUrl}'`

**What Needs Escaping:**
- ✅ Display text (line 354) - HTML escape
- ⚠️ href attribute (line 355) - URL validation + encoding (not HTML escape)
- ⚠️ JavaScript (line 361) - JavaScript string escaping + URL validation

**Potential Breakage:**
- URLs with special characters (`&`, `#`, `?`) should still work
- International domain names should still work
- Query parameters should be preserved

**Verification Test Cases:**
1. `https://example.com/page?param=value&other=123`
2. `https://example.com/page#section`
3. `https://example.com/path with spaces`
4. `https://example.com/path&query=value`
5. `https://中文.example.com`
6. `https://example.com/path<script>alert('xss')</script>`

### 2. Contact Data
**Current Usage:**
- **Lines 481-522:** Display in HTML: names, emails, phones, addresses
- **Line 531:** vCard generation: `const vCardData = \`${vCard}\`;`
- **Line 543:** File download: `link.download = '${contactData.firstName || 'contact'}.vcf'`

**What Needs Escaping:**
- ✅ Display text (lines 481-522) - HTML escape
- ❌ vCard generation (line 531) - Keep raw (vCard format needs literal values)
- ⚠️ File download (line 543) - JavaScript string escaping

**Potential Breakage:**
- Special characters in names (`O'Brien`, `José`, `李`)
- Email addresses with special chars (`user+tag@example.com`)
- Phone numbers with formatting (`+1 (555) 123-4567`)
- Addresses with HTML-like content (`123 <Main> St`)

**Verification Test Cases:**
1. Name: `John O'Brien`
2. Name: `José García`
3. Name: `李小明`
4. Email: `user+tag@example.com`
5. Email: `user<script>alert('xss')</script>@example.com`
6. Phone: `+1 (555) 123-4567`
7. Address: `123 <Main> St, Apt #5`
8. Organization: `Company & Co.`

### 3. WiFi Data
**Current Usage:**
- **Lines 908, 921:** Display SSID: `<p>${wifiData.ssid}</p>`, `<div>${wifiData.ssid}</div>`
- **Line 923:** JavaScript copy: `onclick="copyToClipboard('${wifiData.ssid}')"`
- **Line 939:** Display password: `<div>${wifiData.password}</div>`
- **Line 941:** JavaScript copy: `onclick="copyToClipboard('${wifiData.password}')"`
- **Line 981:** Display in instructions: `Look for "${wifiData.ssid}"`

**What Needs Escaping:**
- ✅ Display text - HTML escape
- ⚠️ JavaScript copy functions - JavaScript string escaping
- ✅ Instructions text - HTML escape

**Potential Breakage:**
- SSIDs with quotes (`"My Network"`)
- SSIDs with backslashes (`My\Network`)
- Passwords with special characters (`P@ssw0rd!`)
- Passwords with quotes (`"password"`)

**Verification Test Cases:**
1. SSID: `"My Network"`
2. SSID: `My\Network`
3. SSID: `Network<script>alert('xss')</script>`
4. Password: `P@ssw0rd!`
5. Password: `"password"`
6. Password: `pass'word`

### 4. Email Content
**Current Usage:**
- **Line 697:** Display: `<p class="email-address">${qrCode.content}</p>`
- **Line 701:** JavaScript copy: `onclick="copyToClipboard('${qrCode.content.replace(/'/g, "\\'")}')"`
- **Line 704:** mailto link: `onclick="window.location.href='mailto:${qrCode.content}'"`

**What Needs Escaping:**
- ✅ Display text - HTML escape
- ⚠️ JavaScript copy - JavaScript string escaping (already partially done)
- ⚠️ mailto link - URL encoding

**Potential Breakage:**
- Email addresses with special chars (`user+tag@example.com`)
- Email addresses with quotes (`"user"@example.com`)

**Verification Test Cases:**
1. `user+tag@example.com`
2. `"user"@example.com`
3. `user<script>alert('xss')</script>@example.com`

### 5. Text Content
**Current Usage:**
- **Line 1143:** Display: `<p>${qrCode.content}</p>`
- **Line 1146:** JavaScript copy: `onclick="copyToClipboard('${qrCode.content.replace(/'/g, "\\'")}')"`

**What Needs Escaping:**
- ✅ Display text - HTML escape
- ⚠️ JavaScript copy - JavaScript string escaping (already partially done)

**Potential Breakage:**
- Multi-line text
- Text with HTML-like content (`<script>`, `<img>`)
- Text with quotes and special characters

**Verification Test Cases:**
1. Multi-line text
2. Text with HTML: `<script>alert('xss')</script>`
3. Text with quotes: `"Hello" world`
4. Text with backslashes: `C:\path\to\file`

### 6. ShortCode in JavaScript
**Current Usage:**
- **Line 18:** `const shortCode = '${shortCode}';`

**What Needs Escaping:**
- ⚠️ JavaScript string - JavaScript string escaping

**Potential Breakage:**
- ShortCode should be alphanumeric only (per URLShortener), but we should still escape defensively

## Escaping Strategy

### 1. HTML Escaping (for display text)
**Use:** `he.encode()` or custom function
**Applies to:**
- All text displayed in HTML (`<p>`, `<div>`, `<h1>`, etc.)
- Text in attributes that are not URLs (`title`, `alt`, etc.)

**Example:**
```typescript
import he from 'he'

function escapeHtml(text: string): string {
  return he.encode(text, { useNamedReferences: true })
}
```

### 2. JavaScript String Escaping (for inline JS)
**Use:** `JSON.stringify()` (handles quotes, backslashes, newlines)
**Applies to:**
- JavaScript string literals
- Function arguments in onclick handlers

**Example:**
```typescript
const safeJsString = JSON.stringify(shortCode)
// Result: "'value'" (includes quotes)
// Usage: const shortCode = ${safeJsString};
```

### 3. URL Encoding (for href attributes)
**Use:** Built-in `encodeURI()` or `encodeURIComponent()`
**Applies to:**
- href attributes
- mailto: links
- window.location.href assignments

**Example:**
```typescript
function safeUrl(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol')
    }
    return parsed.toString()
  } catch {
    return '#'
  }
}
```

### 4. Keep Raw (for functional uses)
**Applies to:**
- vCard generation (needs literal values)
- Clipboard operations (browser handles encoding)
- File downloads (browser handles encoding)

## Implementation Plan

### Phase 1: Create Escaping Utilities
1. Create `src/lib/escape-utils.ts` with:
   - `escapeHtml()` - HTML escaping
   - `escapeJsString()` - JavaScript string escaping
   - `safeUrl()` - URL validation + encoding
   - `safeAttribute()` - HTML attribute escaping

### Phase 2: Update Display Text (HTML Escaping)
- Update all `<p>`, `<div>`, `<h1>` etc. to use `escapeHtml()`
- Test with special characters, HTML, quotes

### Phase 3: Update JavaScript Strings
- Update all inline JavaScript to use `escapeJsString()` or `JSON.stringify()`
- Test with quotes, backslashes, newlines

### Phase 4: Update URLs
- Validate and encode URLs before using in href/window.location
- Test with special characters, query params, fragments

### Phase 5: Testing
- Create test QR codes with edge cases
- Verify all functionality still works
- Verify XSS attacks are blocked

## Test Cases to Create

1. **URL QR Code:**
   - `https://example.com/page?param=value&other=123#section`
   - `https://example.com/path<script>alert('xss')</script>`

2. **Contact QR Code:**
   - Name: `John O'Brien`
   - Email: `user+tag@example.com`
   - Phone: `+1 (555) 123-4567`
   - Address: `123 <Main> St`

3. **WiFi QR Code:**
   - SSID: `"My Network"`
   - Password: `P@ssw0rd!"'`

4. **Email QR Code:**
   - `user+tag@example.com`
   - `"user"@example.com`

5. **Text QR Code:**
   - Multi-line text
   - Text with HTML: `<script>alert('xss')</script>`
   - Text with quotes: `"Hello" world`

## Rollback Plan

If issues are found:
1. Keep escaping utilities in place
2. Add feature flag to toggle escaping
3. Gradually enable escaping per endpoint
4. Monitor error logs for broken workflows

