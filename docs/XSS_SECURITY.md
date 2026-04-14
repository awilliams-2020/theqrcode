# XSS / HTML escaping

Redirect and display endpoints use `src/lib/escape-utils.ts`: `escapeHtml()`, `escapeJsString()`, `safeUrl()`, `safeMailtoUrl()`, `escapeAttribute()`. All user-supplied content in `/api/track/[shortCode]` (URL, contact, email, WiFi, text) is escaped before output. See **XSS_TEST_GUIDE.md** for verification steps.
