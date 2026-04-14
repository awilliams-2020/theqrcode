# Google Ads

## Conversion tracking

**Env (see ENV_SETUP.md):** `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_*` (TRIAL, DEMO, PAYMENT, API, BUSINESS).

**Usage:** `import { trackConversion } from '@/lib/google-ads';` then call after signup/trial/payment/API key/business upgrade, e.g. `trackConversion('trial_signup', undefined, userId)`.

**Files:** `src/app/layout.tsx` (base script), `src/lib/google-ads.ts`, `src/types/gtag.d.ts`.

## Negative keywords (concise)

Use to avoid irrelevant searches and waste.

- **All campaigns:** “qr code scanner”, “qr code reader”, “scan qr code”, “decoder”, “history”, “inventor”, “meaning”, “what is qr code”, “tutorial”, “by hand”; competitor names if protecting brand.
- **High-intent generator:** Exclude scanner/reader/decoder/tutorial/inventor/meaning.
- **Feature-specific:** Exclude “no signup”, “offline”, “download”, “app”, “mobile” if targeting web/signup.
- **Business/enterprise:** Exclude “personal”, “for fun”, “for kids”, “for school”, “for students”.

**Negative keywords:** Add at account/campaign level in Google Ads. Core: scanner, reader, decoder, history, inventor, meaning, tutorial; competitor names; “no signup”, “offline”, “download”, “app”, “mobile” where not targeted. **Positive targets:** generator, maker, creator, “for business”, “with analytics”, “api”, “with tracking”. Use phrase/exact match per campaign.
