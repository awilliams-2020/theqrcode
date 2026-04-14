# No-code platform integrations

TheQRCode.io can integrate with no-code platforms via **OAuth** (user connects account) or **API key** (user enters key in platform).

**Current status:** Zapier and REST API v1 with API key are implemented. OAuth for no-code platforms (Bubble, Glide, etc.) is not yet implemented.

## Priority platforms

| Platform   | Type    | Priority | Notes                          |
|-----------|---------|----------|--------------------------------|
| Zapier    | API key | Done     | Triggers + Create QR action    |
| Make.com  | API key | High     | Similar to Zapier              |
| Bubble.io | OAuth   | High     | OAuth app + REST API           |
| Glide     | OAuth   | High     | OAuth + API connector          |
| Airtable  | API key | High     | Extension                      |
| Webflow   | API key | High     | REST API + docs                |
| n8n       | API key | Medium   | Use existing API               |

## Implementation

- **API key–first:** Use existing REST API v1; add platform-specific app/extension (e.g. Make app, Airtable extension). ~15–25 hours per platform.
- **OAuth-first:** Build OAuth server for “Connect TheQRCode.io”; then add app to Bubble, Glide, Adalo, etc. ~60–80 hours for OAuth + ~20 per platform.

Recommendation: support API key platforms first (Make, Airtable, Webflow); add OAuth when targeting user-facing app builders (Bubble, Glide).
