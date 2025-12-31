/**
 * HTML and JavaScript escaping utilities for safe content rendering
 * Prevents XSS attacks while preserving legitimate user content
 */

/**
 * Escape HTML special characters to prevent XSS attacks
 * Converts <, >, &, ", ' to their HTML entity equivalents
 * 
 * @param text - Text to escape
 * @returns HTML-safe string
 */
export function escapeHtml(text: string | null | undefined): string {
  if (text == null) return ''
  
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Escape a string for safe use in JavaScript string literals
 * Uses JSON.stringify which handles quotes, backslashes, newlines, etc.
 * 
 * @param text - Text to escape
 * @returns JavaScript-safe string (includes surrounding quotes)
 * @example
 * escapeJsString('Hello "world"') // Returns: '"Hello \\"world\\""'
 */
export function escapeJsString(text: string | null | undefined): string {
  if (text == null) return '""'
  return JSON.stringify(text)
}

/**
 * Validate and sanitize a URL for safe use in href attributes or redirects
 * Only allows http:// and https:// protocols
 * 
 * @param url - URL to validate
 * @returns Safe URL string, or '#' if invalid
 */
export function safeUrl(url: string | null | undefined): string {
  if (!url) return '#'
  
  try {
    // Ensure protocol
    const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') 
      ? url 
      : `https://${url}`
    
    const parsed = new URL(urlWithProtocol)
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '#'
    }
    
    return parsed.toString()
  } catch {
    // Invalid URL format
    return '#'
  }
}

/**
 * Validate and create a safe mailto: URL
 * Validates email format and properly encodes it
 * 
 * @param email - Email address
 * @returns Safe mailto: URL, or '#' if invalid
 */
export function safeMailtoUrl(email: string | null | undefined): string {
  if (!email) return '#'
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return '#'
  }
  
  // Encode email for mailto: URL
  return `mailto:${encodeURIComponent(email)}`
}

/**
 * Escape text for safe use in HTML attributes (like title, alt, etc.)
 * Same as escapeHtml but provided for semantic clarity
 * 
 * @param text - Text to escape
 * @returns HTML-safe string
 */
export function escapeAttribute(text: string | null | undefined): string {
  return escapeHtml(text)
}

/**
 * Escape a JavaScript string for safe use in HTML onclick attributes
 * Returns the string content (without outer quotes) properly escaped for use in double-quoted JS strings
 * within single-quoted HTML attributes. This handles quotes, backslashes, and special characters.
 * 
 * IMPORTANT: Single quotes are HTML-escaped (&#039;) to prevent breaking the HTML attribute,
 * while double quotes are JavaScript-escaped (\") for the JS string.
 * 
 * @param text - Text to escape
 * @returns JavaScript string content (without outer quotes), properly escaped
 * @example
 * escapeJsForAttribute('Hello "world"') // Returns: Hello \"world\"
 * escapeJsForAttribute("alert('xss')") // Returns: alert(&#039;xss&#039;)
 */
export function escapeJsForAttribute(text: string | null | undefined): string {
  if (text == null) return ''
  // Use JSON.stringify to get properly escaped JS string
  // JSON.stringify escapes double quotes, backslashes, and control chars, but NOT single quotes
  const jsString = JSON.stringify(text)
  // Remove outer quotes: "content" -> content
  let content = jsString.slice(1, -1)
  // Since we're using single quotes for the HTML attribute and double quotes for the JS string,
  // we need to HTML-escape single quotes to prevent breaking the HTML attribute
  // HTML-escape single quotes: ' -> &#039; (not JavaScript escape \')
  // This way the HTML parser doesn't see them as attribute terminators
  content = content.replace(/'/g, "&#039;")
  return content
}

