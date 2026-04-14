# Zapier integration

## Overview

Zapier connects TheQRCode.io to 6,000+ apps (e.g. auto-generate QR codes from spreadsheets, send after form submissions, trigger on scan milestones).

## Status

- **API:** REST API v1 (`/api/v1/qr-codes`, `/api/v1/scans`), API key auth — ready.
- **Zapier app:** If `/theqrcode/zapier/` exists: triggers (New QR Code, New Scan), action (Create QR Code), auth via API key. If not, build via [Zapier Platform](https://platform.zapier.com) using these endpoints.
- **Public listing:** Zapier requires **3+ users with active Zaps** that have run at least once. Options: recruit real users (Pro/Business) or create test accounts with running Zaps; then submit in invite-only mode and request public listing once demand is shown.

## API used by Zapier

- **Auth:** `GET /api/v1/qr-codes?limit=1` with `Authorization: Bearer {API_KEY}`.
- **Triggers (polling):** `GET /api/v1/qr-codes` (e.g. every 15 min), `GET /api/v1/scans?since={timestamp}` (e.g. every 5 min).
- **Action:** `POST /api/v1/qr-codes` to create a QR code.

## Build (if building from scratch)

```bash
cd /home/awilliams/theqrcode/zapier   # or create from Zapier CLI
npm install && zapier login && zapier push
```

See in-repo `zapier/SETUP_INSTRUCTIONS.md` and `zapier/README.md` if present.

## Approval

- Prepare: auth (API key), ≥1 trigger or action, error handling, test credentials.
- Submit as invite-only; get 3+ active Zaps; then apply for public listing.
- Rate limits: Pro 1,000 req/h, Business 10,000 req/h; polling stays within limits.
