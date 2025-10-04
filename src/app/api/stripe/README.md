# Stripe API Endpoints

This directory contains Stripe-related API endpoints for subscription management.

## Endpoints

### POST /api/stripe/checkout

Creates a Stripe checkout session for a subscription.

**Request Body:**
```json
{
  "plan": "starter" | "pro" | "business"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Authentication:** Required (NextAuth session)

**Usage:**
```typescript
const response = await fetch('/api/stripe/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ plan: 'pro' })
})

const { url } = await response.json()
window.location.href = url // Redirect to Stripe checkout
```

---

### POST /api/stripe/portal

Creates a Stripe customer portal session for managing existing subscriptions.

**Request Body:** None

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

**Authentication:** Required (NextAuth session)

**Usage:**
```typescript
const response = await fetch('/api/stripe/portal', {
  method: 'POST'
})

const { url } = await response.json()
window.location.href = url // Redirect to Stripe portal
```

---

### POST /api/stripe/webhook

Handles Stripe webhook events for subscription management.

**Headers:**
- `stripe-signature`: Webhook signature for verification

**Events Handled:**
- `checkout.session.completed` - User completes checkout
- `customer.subscription.created` - New subscription created
- `customer.subscription.updated` - Subscription updated (plan change, status)
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_succeeded` - Recurring payment successful
- `invoice.payment_failed` - Payment failed

**Response:**
```json
{
  "received": true
}
```

**Setup:**
1. Configure webhook endpoint in Stripe Dashboard
2. Add webhook URL: `https://theqrcode.io/api/stripe/webhook`
3. Select events to listen for
4. Copy signing secret to environment variables

---

## Environment Variables

Required environment variables:

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...
```

## Testing

Use Stripe test mode credentials:
- Test secret key: `sk_test_...`
- Test webhook secret: `whsec_test_...`
- Test card: `4242 4242 4242 4242`

## Security

- ✅ Webhook signature verification enabled
- ✅ Authentication required for checkout/portal
- ✅ Metadata validation
- ✅ Error handling and logging

