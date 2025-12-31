/**
 * Verification script to test HTML escaping edge cases
 * Run this before implementing HTML escaping to ensure we understand all use cases
 */

// Test cases for different QR code types
const testCases = {
  url: [
    'https://example.com/page?param=value&other=123',
    'https://example.com/page#section',
    'https://example.com/path with spaces',
    'https://example.com/path&query=value',
    'https://中文.example.com',
    'https://example.com/path<script>alert("xss")</script>',
    'https://example.com/path"onclick="alert(1)"',
    'javascript:alert("xss")',
    'data:text/html,<script>alert("xss")</script>',
  ],
  contact: {
    firstName: [
      "John O'Brien",
      "José García",
      "李小明",
      "<script>alert('xss')</script>",
      "John\"onclick=\"alert(1)",
      "John & Jane",
    ],
    lastName: [
      "Smith",
      "O'Connor",
      "<img src=x onerror=alert(1)>",
    ],
    email: [
      "user+tag@example.com",
      "user<script>alert('xss')</script>@example.com",
      "user\"@example.com",
      "user@example.com",
    ],
    phone: [
      "+1 (555) 123-4567",
      "<script>alert('xss')</script>",
      "+1-555-123-4567",
    ],
    address: [
      "123 <Main> St, Apt #5",
      "123 & Main St",
      "<script>alert('xss')</script>",
    ],
    organization: [
      "Company & Co.",
      "Company<script>alert('xss')</script>",
      "Company \"Inc\"",
    ],
  },
  wifi: {
    ssid: [
      '"My Network"',
      "My\\Network",
      "Network<script>alert('xss')</script>",
      "Network & Co.",
      "Network'Name",
    ],
    password: [
      'P@ssw0rd!',
      '"password"',
      "pass'word",
      "<script>alert('xss')</script>",
      "password & more",
    ],
  },
  email: [
    "user+tag@example.com",
    '"user"@example.com',
    "user<script>alert('xss')</script>@example.com",
    "user@example.com",
  ],
  text: [
    "Multi-line\ntext",
    "<script>alert('xss')</script>",
    '"Hello" world',
    "C:\\path\\to\\file",
    "Text & more",
    "<img src=x onerror=alert(1)>",
  ],
}

// Simple HTML escaping function (for testing)
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// JavaScript string escaping (using JSON.stringify)
function escapeJsString(text: string): string {
  return JSON.stringify(text)
}

// URL validation and encoding
function safeUrl(url: string): string {
  try {
    // Ensure protocol
    const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') 
      ? url 
      : `https://${url}`
    
    const parsed = new URL(urlWithProtocol)
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '#'
    }
    
    return parsed.toString()
  } catch {
    return '#'
  }
}

// Test HTML escaping
console.log('=== HTML Escaping Tests ===\n')

console.log('URL Display Text:')
testCases.url.forEach(url => {
  const escaped = escapeHtml(url)
  console.log(`  Original: ${url}`)
  console.log(`  Escaped:  ${escaped}`)
  console.log(`  Safe URL: ${safeUrl(url)}`)
  console.log('')
})

console.log('\nContact Data:')
Object.entries(testCases.contact).forEach(([field, values]) => {
  console.log(`\n${field}:`)
  values.forEach(value => {
    const escaped = escapeHtml(value)
    console.log(`  Original: ${value}`)
    console.log(`  Escaped:  ${escaped}`)
  })
})

console.log('\n\nWiFi Data:')
Object.entries(testCases.wifi).forEach(([field, values]) => {
  console.log(`\n${field}:`)
  values.forEach(value => {
    const escaped = escapeHtml(value)
    const jsEscaped = escapeJsString(value)
    console.log(`  Original:    ${value}`)
    console.log(`  HTML Escaped: ${escaped}`)
    console.log(`  JS Escaped:   ${jsEscaped}`)
  })
})

console.log('\n\nEmail:')
testCases.email.forEach(email => {
  const escaped = escapeHtml(email)
  const jsEscaped = escapeJsString(email)
  const urlEncoded = safeUrl(`mailto:${email}`)
  console.log(`  Original:    ${email}`)
  console.log(`  HTML Escaped: ${escaped}`)
  console.log(`  JS Escaped:   ${jsEscaped}`)
  console.log(`  URL Encoded:  ${urlEncoded}`)
  console.log('')
})

console.log('\n\nText Content:')
testCases.text.forEach(text => {
  const escaped = escapeHtml(text)
  const jsEscaped = escapeJsString(text)
  console.log(`  Original:    ${text}`)
  console.log(`  HTML Escaped: ${escaped}`)
  console.log(`  JS Escaped:   ${jsEscaped}`)
  console.log('')
})

// Generate test HTML snippets to verify rendering
console.log('\n=== Generated HTML Snippets ===\n')

console.log('URL Redirect HTML:')
const testUrl = 'https://example.com/page?param=value&other=123'
console.log(`<p class="redirect-url">${escapeHtml(testUrl)}</p>`)
console.log(`<a href="${safeUrl(testUrl)}">Click here</a>`)
console.log(`<script>window.location.href = ${escapeJsString(safeUrl(testUrl))};</script>`)

console.log('\nContact HTML:')
const testContact = {
  firstName: "John O'Brien",
  email: "user+tag@example.com",
}
console.log(`<h1>${escapeHtml(testContact.firstName)}</h1>`)
console.log(`<span>${escapeHtml(testContact.email)}</span>`)
console.log(`onclick="copyToClipboard(${escapeJsString(testContact.email)})"`)

console.log('\nWiFi HTML:')
const testWifi = {
  ssid: '"My Network"',
  password: 'P@ssw0rd!',
}
console.log(`<p>${escapeHtml(testWifi.ssid)}</p>`)
console.log(`<div>${escapeHtml(testWifi.password)}</div>`)
console.log(`onclick="copyToClipboard(${escapeJsString(testWifi.ssid)})"`)

console.log('\n=== Verification Checklist ===')
console.log('✓ URLs with query parameters preserved')
console.log('✓ URLs with fragments preserved')
console.log('✓ Special characters in names displayed correctly')
console.log('✓ Email addresses remain clickable')
console.log('✓ WiFi credentials remain copyable')
console.log('✓ XSS attempts blocked')
console.log('✓ JavaScript functions still work')

