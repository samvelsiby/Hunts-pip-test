# Stripe Payment Links Implementation

## Overview
This implementation uses Stripe Payment Links to handle subscription payments. When a user clicks on a subscription plan, they are redirected to a Stripe-hosted payment page.

## Implementation Details

### 1. Payment Links Configuration
**File:** `src/config/payment-links.ts`

This file contains the mapping of plan IDs and frequencies to Stripe Payment Link URLs:

- **Pro (Premium) Plan:**
  - Monthly: `https://buy.stripe.com/eVq4gBcjv4cJaqfdhQ9EI03`
  - Yearly: `https://buy.stripe.com/dRm4gB2IV24B2XNb9I9EI02`

- **Premium (Ultimate) Plan:**
  - Monthly: `https://buy.stripe.com/9B6cN7abn8sZfKz5Po9EI00`
  - Yearly: `https://buy.stripe.com/bJe00labnbFbgODdhQ9EI01`

### 2. Pricing Card Component
**File:** `src/components/pricing/PricingCard.tsx`

The component now:
- Checks if the user is logged in before allowing payment
- Redirects to sign-in page if not logged in (with return URL to pricing page)
- For **free tier**: Calls `/api/subscribe-free` to activate the plan directly
- For **paid tiers**: Redirects to the appropriate Stripe Payment Link with:
  - User email prefilled (`prefilled_email` parameter)
  - User ID as client reference (`client_reference_id` parameter)

### 3. Free Plan Subscription API
**File:** `src/app/api/subscribe-free/route.ts`

This API endpoint:
- Authenticates the user using Clerk
- Creates or updates the user's subscription in the `user_subscriptions` table
- Sets the plan to 'free' and status to 'active'

## User Flow

### For Free Plan:
1. User clicks "Get Started Free"
2. If not logged in → Redirect to sign-in → Return to pricing
3. If logged in → API call to activate free plan → Redirect to dashboard

### For Paid Plans:
1. User clicks "Subscribe Now" on a paid plan
2. If not logged in → Redirect to sign-in → Return to pricing
3. If logged in → Redirect to Stripe Payment Link with:
   - Email prefilled
   - User ID as client reference
4. User completes payment on Stripe
5. Stripe redirects back (configured in Stripe Dashboard)

## Next Steps

### Webhook Setup (Recommended)
To automatically update subscriptions when payments are completed, set up a Stripe webhook:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Payment Link Configuration in Stripe
1. Go to Stripe Dashboard → Products → Payment Links
2. For each Payment Link, configure:
   - **Success URL**: `https://your-domain.com/dashboard?success=true`
   - **Cancel URL**: `https://your-domain.com/pricing?canceled=true`
   - Enable "Collect customer email" (optional, we prefill it)
   - Enable "Collect customer name" (optional)

### Testing
1. Test free plan subscription (no payment required)
2. Test paid plan subscription flow:
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

## Notes
- The `client_reference_id` parameter allows you to track which user made the payment
- The `prefilled_email` parameter pre-fills the email field in the Stripe checkout
- Payment Links handle the entire payment flow, so no additional checkout session creation is needed


