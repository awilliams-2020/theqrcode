# theqrcode.io — Developer & AI Agent Pivot

## Situation

theqrcode.io is a technically solid micro-SaaS QR code generator with a REST API, analytics, dynamic codes, and an existing `/for-ai-assistants` page complete with an OpenAI plugin manifest. Despite the technical foundation, the product is positioned wrong — currently competing as a generic consumer QR generator against heavily entrenched incumbents (QR Code Generator, QRcode Monkey, etc.) with massive SEO moats and brand recognition.

The core problem: fighting for the same consumer keywords everyone else is fighting for, while sitting on infrastructure that developers and AI agent builders actually want.

## The Insight

MCP (Model Context Protocol) is emerging as the distribution channel for AI tools in 2025 the same way app stores were for mobile in 2010. Claude, Cursor, and other AI agents can discover and call tools directly — and the tool registry is still sparse. Bitly just launched an MCP server for QR codes and short links, which validates the market without locking it up.

We have:
- A working REST API with no auth required
- OpenAPI spec already published
- An AI plugin manifest already built
- Dynamic QR codes with analytics

We don't have:
- An MCP server
- Developer-first positioning
- Landing pages targeting the right keywords

That gap is the opportunity.

## Pivot Plan

### 1. Build the MCP Server

Wrap the existing REST API in an MCP-compliant server using the official Anthropic TypeScript MCP SDK. This is the highest-leverage action — it creates a new distribution channel and anchors the repositioning story.

**Implementation details:**

- Single tool to start: `generate_qr_code`
  - Parameters mirror the existing REST API: `type` (url/wifi/contact/text/email), `data`, and optional `settings` (size, foreground color, background color, error correction level, format)
  - Return value: URL to the generated QR code image + metadata (dimensions, format, expiry if dynamic)
- Transport: remote HTTP/SSE (not stdio) so users point their AI client at a URL — no local install required
- Tool description: written for LLMs, not humans — clear about when to use it, what inputs are valid, what the output looks like
- Deployed as a standalone service, documented at `/mcp` on the main domain

**Why remote transport matters:** stdio MCP servers require the user to install and run a process locally. Remote HTTP/SSE means the connection string is just a URL — far lower friction for onboarding.

**Tech stack:** TypeScript, `@modelcontextprotocol/sdk`, deployed independently (Fly.io or Railway), callable from Claude Desktop, Cursor, and any MCP-compatible client.

---

### 2. Reposition the Homepage

The current hero leads with "Generate QR Codes" — a phrase every competitor uses. The pivot repositions above the fold around the API and AI agent story. The consumer generator stays, but moves below the fold as a free acquisition funnel, not the primary pitch.

**New positioning statement:**
> "The QR code API built for developers and AI agents. No auth required. MCP ready. Integrate in 60 seconds."

**Above-the-fold rewrite goals:**
- Lead with the API, not the generator UI
- Surface the MCP server as a first-class feature
- Show a code snippet or tool call example immediately — developers decide in 10 seconds
- Social proof anchored to developer outcomes (API calls made, integrations live)

**Below the fold:**
- Consumer generator (free tool, SEO and acquisition value stays intact)
- Feature breakdown: dynamic codes, analytics, bulk generation
- Pricing section (see item 4)

---

### 3. New SEO Landing Pages

Three dedicated pages targeting developer and AI-specific keywords that incumbents aren't competing on yet:

**`/mcp` — QR Code MCP Server**
- Headline: "QR Code MCP Server for Claude, Cursor, and AI Agents"
- Full setup instructions: how to add the server URL to Claude Desktop config, Cursor settings, etc.
- Tool schema documentation (parameters, types, example calls)
- Example prompts that trigger the tool naturally in conversation
- "Try it" section with a live demo or copy-paste config snippet

**`/qr-code-api` — REST API for Developers**
- Headline: "QR Code API — No Auth, No Keys, No Signup"
- Quick start code examples in JavaScript, Python, curl
- Full endpoint documentation (mirrors OpenAPI spec in readable format)
- Rate limits clearly stated (100 req/hour unauthenticated, higher with API key on paid plans)
- Link to OpenAPI spec and Postman collection

**`/ai-agents` — Expand the existing `/for-ai-assistants` page**
- Integrate MCP documentation alongside the existing OpenAI plugin manifest
- Use cases: AI assistants generating QR codes on demand, agents building marketing materials, automated QR code creation in workflows
- Code examples: function calling, MCP tool calls, direct REST calls
- Links to the OpenAPI spec and AI plugin manifest

---

### 4. Developer Pricing

The current pricing hides API access as a footnote on the Pro plan. Developers can't quickly answer "what do I get and what does it cost?" — which kills conversion.

**Reframe the pricing section to answer three questions immediately:**

1. What can I do for free?
   - Unauthenticated REST API: 100 req/hour per IP
   - MCP server: available to all, rate-limited
   - Static QR codes: unlimited via the UI

2. What do I unlock with a paid plan?
   - Higher rate limits (authenticated endpoints)
   - Dynamic QR codes (redirect URL editable after creation)
   - Analytics (scan counts, device breakdown, geo)
   - Bulk generation endpoint
   - SLA and support

3. How does billing work?
   - Per-seat for teams, or usage-based for high-volume API consumers (TBD — validate with first developer customers)

**Pricing tier structure (proposed):**
| Tier | Price | API Rate Limit | Dynamic Codes | Analytics |
|------|-------|---------------|---------------|-----------|
| Free | $0 | 100 req/hr (IP) | No | No |
| Developer | $12/mo | 5,000 req/hr | Yes | Yes |
| Pro | $49/mo | Unlimited | Yes | Yes + exports |

---

## Tech Stack Context

| Layer | Detail |
|-------|--------|
| Frontend | Angular 19, TypeScript, SSR |
| Existing API | `POST /api/public/qr-codes` — no auth, 100 req/hr per IP |
| OpenAPI spec | `/api/public/qr-codes/openapi.json` |
| AI plugin manifest | `/api/public/qr-codes/.well-known/ai-plugin.json` |
| MCP SDK | `@modelcontextprotocol/sdk` (TypeScript) |

---

## Execution Order

**Phase 1 — Build the MCP server** (highest leverage, unlocks the repositioning story)
1. Scaffold the MCP server project with TypeScript and the Anthropic MCP SDK
2. Implement the `generate_qr_code` tool wrapping the existing REST API
3. Deploy with remote HTTP/SSE transport
4. Write the `/mcp` landing page with setup instructions

**Phase 2 — Reposition the homepage**
1. Rewrite hero copy around the API/MCP story
2. Move consumer generator below the fold
3. Add a code snippet or live tool call demo above the fold

**Phase 3 — SEO landing pages**
1. Build `/qr-code-api` with full REST API docs
2. Expand `/for-ai-assistants` → `/ai-agents` with MCP docs

**Phase 4 — Pricing reframe**
1. Add a developer-specific pricing section
2. Make rate limits and unlocks explicit at each tier

---

## Success Metrics

- MCP server live and callable from Claude Desktop / Cursor
- `/mcp` page indexed and ranking for "qr code mcp server"
- First 10 developer signups from API/MCP traffic
- API key signups as a share of total signups (currently ~0%)
