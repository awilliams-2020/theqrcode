# Welcome Email & Signup Flows

## When is `setup-subscription` called?

**Only when the user lands on `/auth/setup`.** That page renders `SubscriptionSetup`, which calls `POST /api/auth/setup-subscription` with the plan from the URL (or cookie).

- **Stripe checkout return** → success URL is **`/dashboard?success=true&session_id=...`** (see `src/app/api/stripe/checkout/route.ts`). So returning from Stripe does **not** hit `/auth/setup` and **does not** call `setup-subscription`. Subscription updates from Stripe are handled by the Stripe webhook.
- **OAuth signup with trial plan** → NextAuth `callbackUrl` is **`/auth/setup?plan=pro`** (or `starter`) (see `src/app/auth/signup/page.tsx`). So after Google/GitHub, the user is redirected to `/auth/setup` and `setup-subscription` **is** called.
- **Password signup** → User must verify email before they can sign in. After verify, they go to the signin page and land on **dashboard**. They **never** visit `/auth/setup`; the plan is applied in the **verify-email** API.

So: **setup-subscription is used for OAuth trial signups (no Stripe), not for Stripe checkout return.**

---

## Welcome email by flow

| Signup type | Plan | Where plan is set | Where welcome email is sent |
|-------------|------|-------------------|-----------------------------|
| **1. Email + password** | Free | (already free at signup) | `verify-email` API after verification |
| **2. Email + password** | Trial (Starter/Pro) | `verify-email` API (plan in link) | `verify-email` API with overrides (correct plan/trial) |
| **3. OAuth (Google/GitHub)** | Free | Auth creates user with free sub | Dashboard: `POST /api/user/ensure-welcome-email` (called once on first load) |
| **4. OAuth (Google/GitHub)** | Trial | `setup-subscription` when user lands on `/auth/setup` | `setup-subscription` after updating subscription (with overrides) |
| Stripe checkout return | (existing user) | Stripe webhook | No welcome (user already had one) |

---

## Implementation notes

- **auth.ts**: For **new OAuth users** we do **not** send the welcome email (plan is applied later on `/auth/setup` for trial, or user is free and gets it from dashboard).
- **verify-email** API: Applies plan from link for password trial signups, then sends welcome email with overrides so content matches plan/trial.
- **setup-subscription** API: Updates subscription for users who land on `/auth/setup` (OAuth trial). After updating, if no welcome sent yet, sends welcome with overrides.
- **ensure-welcome-email** API: Called from Dashboard on load; sends welcome once for users who never got it (e.g. OAuth free signups).
