# Google Ads campaign from JSON

Create a Google Ads Search campaign (budget, campaign, ad groups, Responsive Search Ads, keywords) from a single JSON config file.

**Run from the app root** (theqrcode, where `package.json` and `.env` live). Load `.env` then run the script, e.g.:

```bash
cd /path/to/theqrcode
set -a && source .env && set +a && npx tsx scripts/google-ads/create-campaign.ts --validate
```

(Or use `dotenv` / your shell’s method to export vars from `.env`.)

## 1. Create and verify the JSON

1. Copy the example config:
   ```bash
   cp scripts/google-ads/campaign-config.example.json scripts/google-ads/campaign-config.json
   ```

2. Edit `campaign-config.json`:
   - **budget**: `name`, `dailyAmountUsd` (e.g. 17 for ~$500 over 30 days), optional `deliveryMethod` (`STANDARD` or `ACCELERATED`).
   - **campaign**: `name`, optional `status` (default `PAUSED`), optional `networkSettings`. Bidding is set to **Maximize conversions**.
   - **sitelinks** (optional): array of `{ "text": "Link label (max 25 chars)", "url": "https://...", "description1": "…", "description2": "…" }`. Both description1 and description2 must be set together (max 35 chars each), or omit both.
- **negativeKeywords** (optional): campaign-level negative keywords; ads won’t show when the search matches. Array of `{ "text": "phrase or word", "matchType": "EXACT" | "PHRASE" | "BROAD" }`. Example phrases: "free only", "no signup", "offline"; "barcode" (1D barcode, not QR); "canva" (QR inside Canva). Add/remove to match intent you want to avoid.
- **adGroups**: array of:
     - **name**: ad group name
     - **ads**: array of Responsive Search Ads. Each ad must have:
       - **headlines**: at least 3 (max 15), each ≤ 30 characters. For better Ad strength, use 10–15 unique headlines per ad.
       - **descriptions**: at least 2 (max 4), each ≤ 90 characters. Use 4 for stronger Ad strength.
       - **finalUrl**: landing page URL
       - **path1** / **path2**: optional display path (each ≤ 15 chars)
     - **keywords**: array of `{ "text": "...", "matchType": "EXACT" | "PHRASE" | "BROAD" }`

3. Validate the config (no API calls, no creation):
   ```bash
   set -a && source .env && set +a && npx tsx scripts/google-ads/create-campaign.ts --validate
   ```
   Or with a custom path:
   ```bash
   set -a && source .env && set +a && npx tsx scripts/google-ads/create-campaign.ts path/to/campaign-config.json --validate
   ```

4. Fix any validation errors (headline/description length, missing fields, etc.) and re-run `--validate` until it passes.

## 2. Run the script to create resources

**Required environment variables** (in `.env` at app root):

- `GOOGLE_ADS_CUSTOMER_ID` – the Google Ads account (client) ID that will own the campaign
- `GOOGLE_ADS_MANAGER_CUSTOMER_ID` – MCC account ID (used as `login-customer-id`)
- `GOOGLE_ADS_DEVELOPER_TOKEN` – from Google Ads API Center
- `GOOGLE_ADS_REFRESH_TOKEN` – OAuth refresh token for the account (e.g. from your admin app or DB)
- For token refresh, one of:
  - `ADMIN_GOOGLE_CLIENT_ID` + `ADMIN_GOOGLE_CLIENT_SECRET`, or
  - `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`

Create the campaign (order: budget → campaign → ad groups → ads → keywords):

```bash
set -a && source .env && set +a && npx tsx scripts/google-ads/create-campaign.ts
```

Or with a custom config path:

```bash
set -a && source .env && set +a && npx tsx scripts/google-ads/create-campaign.ts path/to/campaign-config.json
```

The campaign is created in **PAUSED** state. Enable it in the Google Ads UI when you’re ready to run the test.

## 3. Keyword strategy (so the $500 isn’t wasted)

The generic bucket (“qr code generator”, 823k/mo, HIGH) is saturated. Businesses that do well usually focus on **use-case** and **intent**, not raw volume:

- **Use-case:** “qr code for restaurant menu”, “qr code for events”, “qr code for business”, “create qr code for website” – someone with a concrete project, not just “free generator”.
- **Intent:** “with tracking”, “with analytics”, “dynamic”, “for business” – signals they care about features, not just “free”.
- **Competition:** Prefer **LOW** (and sometimes MEDIUM). Volume in the **1k–50k** range is enough to learn from in a $500 test.

**Workflow:** Run keyword ideas with **use-case seeds** (see `seed-keywords-use-cases.txt`), use `--exclude "free,barcode"` and `--min-volume 500`, then pick phrases that are LOW/MEDIUM and clearly use-case or “for business”. Put those in `campaign-config.json` instead of the generic high-volume ones.

## 4. Keyword ideas (optional)

Use the **Keyword Plan API** to get search volume and competition for seed keywords before you finalize `campaign-config.json`:

```bash
set -a && source .env && set +a && npx tsx scripts/google-ads/keyword-ideas.ts "qr code generator" "tracking"
```

**Seeds from a file:** use **`--seeds-file path/to/file`**. Supported formats:
- **.txt / .keywords:** one seed keyword per line; lines starting with `#` and blank lines are ignored.
- **.csv:** first column only; optional header row with column name `keyword`, `seed`, or `key` is skipped.

Example: `scripts/google-ads/seed-keywords.example.txt`. For **use-case / intent** ideas (restaurant, business, website, etc.), run:  
`npx tsx scripts/google-ads/keyword-ideas.ts --seeds-file scripts/google-ads/seed-keywords-use-cases.txt --exclude "free,barcode" --min-volume 500`  
Then pick LOW/MEDIUM competition phrases for `campaign-config.json`.

Other options: **`--url URL`** (URL seed), **`--min-volume N`** (filter by avg monthly searches), **`--top N`** (max ideas, default 50), **`--json`** (output array for campaign-config keywords). You can combine `--seeds-file` with extra keywords on the CLI. Targeting is US + English; edit `LANGUAGE_ID` / `GEO_TARGET_ID` in the script to change.

## Retrigger trial conversion for a user

If the app logged “Trial conversion upload succeeded” but the conversion doesn’t show in Google Ads (e.g. reporting delay or you want to re-send), you can re-run the upload for one user by ID.

**Recommended: run inside the app container** (so it can reach the DB at `postgres:5432`):

```bash
./scripts/run-retrigger-trial-in-container.sh <userId>
```

Example: `./scripts/run-retrigger-trial-in-container.sh cmlztm7g80007l54yehrpwrcm`

That script copies `scripts/` and `src/` into the running `theqrcode` container and runs the conversion script there (env is already set by compose).

**Alternative (host):** if the DB is reachable from the host (e.g. published port), run from app root with env loaded:  
`set -a && source .env && set +a && npx tsx scripts/google-ads/retrigger-trial-conversion.ts <userId>`

Requires the same Google Ads env as the app, plus `GOOGLE_ADS_TRIAL_CONVERSION_ACTION_ID` and `DATABASE_URL`. The user must have a `gclid` stored (set when they arrived via a Google Ad click).

## Reference

- Config shape: see `campaign-config.example.json` (aligned with the main repo’s GOOGLE_ADS_EXPERIMENT.md).
- Limits: [Responsive Search Ads](https://support.google.com/google-ads/answer/7684791) (headlines 30 chars, descriptions 90 chars, paths 15 chars).
- The script uses the same REST mutate pattern as the main app’s conversion upload (API version v20).
