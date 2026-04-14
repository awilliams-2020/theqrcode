# Public API for AI Assistants

## Overview

TheQRCode.io provides a **public API endpoint** that allows AI assistants to generate QR codes instantly without requiring user authentication. This is perfect for AI assistants, chatbots, and automated integrations.

## Quick Start

**Endpoint:** `POST https://theqrcode.io/api/public/qr-codes`

**No Authentication Required** - Just send a POST request with the QR code details.

## Example Request

```bash
curl -X POST https://theqrcode.io/api/public/qr-codes \
  -H "Content-Type: application/json" \
  -d '{
    "type": "url",
    "content": "https://example.com"
  }'
```

## Example Response

```json
{
  "qrImage": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "imageUrl": "https://theqrcode.io/api/public/qr-codes/view/abc123xyz456",
  "type": "url",
  "content": "https://example.com",
  "_meta": {
    "apiVersion": "1.0.0",
    "generatedAt": "2024-01-15T10:30:45.123Z",
    "documentation": "https://theqrcode.io/api/public/qr-codes",
    "note": "Use imageUrl to share with users - AI assistants can provide this URL directly. URLs use short codes and expire after 24 hours."
  }
}
```

**Note:** The `imageUrl` uses a short 12-character code to avoid URL length limits. URLs expire after 24 hours for security and storage efficiency.

## Rate Limiting

- **Limit:** 100 requests per hour per IP address
- **Headers:** Check `X-RateLimit-Remaining` and `X-RateLimit-Reset` in responses
- **Exceeded:** Returns `429 Too Many Requests` with `Retry-After` header

## Supported QR Code Types

1. **URL** - `{ "type": "url", "content": "https://example.com" }`
2. **WiFi** - `{ "type": "wifi", "content": "{\"ssid\":\"Network\",\"password\":\"pass\",\"security\":\"WPA2\"}" }`
3. **Contact (vCard)** - `{ "type": "contact", "content": "{\"firstName\":\"John\",\"phone\":\"+1234567890\"}" }`
4. **Text** - `{ "type": "text", "content": "Hello, World!" }`
5. **Email** - `{ "type": "email", "content": "contact@example.com" }`

## Customization Options

```json
{
  "type": "url",
  "content": "https://example.com",
  "settings": {
    "size": 512,
    "color": {
      "dark": "#000000",
      "light": "#FFFFFF"
    },
    "frame": {
      "style": "rounded",
      "color": "#000000",
      "size": 30
    }
  }
}
```

## Discovery Endpoints

### API Documentation
**GET** `https://theqrcode.io/api/public/qr-codes`
- Returns complete API documentation with examples

### OpenAPI Specification
**GET** `https://theqrcode.io/api/public/qr-codes/openapi.json`
- Full OpenAPI 3.0 specification for API discovery

### AI Plugin Manifest
**GET** `https://theqrcode.io/api/public/qr-codes/.well-known/ai-plugin.json`
- OpenAI plugin format manifest

## Use Cases for AI Assistants

1. **User requests QR code** → Call API → Get `imageUrl` → Share URL with user → User clicks to view QR code
2. **Share WiFi password** → Generate WiFi QR code → Share `imageUrl` → User clicks to view and scan
3. **Create contact card** → Generate vCard QR code → Share `imageUrl` → User clicks to view and scan
4. **Quick link sharing** → Generate URL QR code → Share `imageUrl` → User clicks to view and print/share

**Key Point:** AI assistants should use the `imageUrl` field to share with users. This provides a short, clickable link that displays the QR code image directly - no file creation needed!

## Best Practices

1. **Always check rate limits** - Monitor `X-RateLimit-Remaining` header
2. **Handle errors gracefully** - Check for 400/429/500 status codes
3. **Use appropriate QR types** - Match user's intent (URL vs WiFi vs Contact)
4. **Share the imageUrl with users** - The `imageUrl` field provides a short, clickable link perfect for sharing
5. **Note expiration** - URLs expire after 24 hours, so generate fresh ones if needed
6. **Use qrImage for direct embedding** - The `qrImage` data URL can be used directly in HTML if needed
7. **Suggest customization** - Offer size/color options for better user experience

## Error Handling

- **400 Bad Request** - Missing or invalid parameters
- **429 Too Many Requests** - Rate limit exceeded (check `Retry-After` header)
- **500 Internal Server Error** - QR code generation failed

## Integration Examples

### Python
```python
import requests

response = requests.post(
    'https://theqrcode.io/api/public/qr-codes',
    json={
        'type': 'url',
        'content': 'https://example.com'
    }
)
qr_data = response.json()
qr_image = qr_data['qrImage']  # Data URL ready to use
image_url = qr_data['imageUrl']  # Shareable URL for users
# Share image_url with users - they can click it to view the QR code
```

### JavaScript/TypeScript
```typescript
const response = await fetch('https://theqrcode.io/api/public/qr-codes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'url',
    content: 'https://example.com'
  })
});
const data = await response.json();
const qrImage = data.qrImage; // Data URL for direct use
const imageUrl = data.imageUrl; // Shareable URL for users
// Share imageUrl with users - they can click it to view the QR code
```

## Structured Data

The API is discoverable via:
- **Schema.org WebAPI** structured data on homepage
- **OpenAPI 3.0** specification
- **AI Plugin Manifest** for OpenAI plugins
- **Sitemap** inclusion for search engine discovery

## Support

- **Documentation:** https://theqrcode.io/api/public/qr-codes
- **Contact:** https://theqrcode.io/contact
- **Terms:** https://theqrcode.io/terms
