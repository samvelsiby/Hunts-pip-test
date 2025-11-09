# Subscription Payment Flow Diagram

## Overview
This document explains how the subscription payment flow works in two scenarios:
1. **User with existing subscription trying to pay for the same plan**
2. **User trying to upgrade to a higher plan**

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER CLICKS "SUBSCRIBE"                       │
│                    (Pricing Card Button)                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              CHECK: Is User Logged In?                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
         [NO - Redirect]            [YES - Continue]
         to /sign-in                │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│         CALL: /api/create-checkout-session                      │
│         POST { planId, frequency }                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         CHECK: User Already Has Subscription?                    │
│         (Query Supabase user_subscriptions table)               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
         [NO SUBSCRIPTION]        [HAS SUBSCRIPTION]
                │                         │
                │                         ▼
                │         ┌───────────────────────────────────────┐
                │         │  CHECK: Current Plan vs Requested    │
                │         │  Plan Comparison                     │
                │         └───────────┬───────────────────────────┘
                │                     │
                │         ┌───────────┴───────────┐
                │         │                       │
                │         ▼                       ▼
                │  [SAME PLAN]            [DIFFERENT PLAN]
                │         │                       │
                │         ▼                       ▼
                │  ┌──────────────────────────────────────────┐
                │  │  CASE 1: Same Plan                       │
                │  │  - Current: premium                      │
                │  │  - Requested: premium                    │
                │  │  - Status: active                        │
                │  │                                          │
                │  │  ❌ RETURN ERROR:                        │
                │  │  "You already have an active             │
                │  │   subscription for this plan"            │
                │  │                                          │
                │  │  ✅ USER SEES:                           │
                │  │  Alert message explaining they           │
                │  │  already have this subscription          │
                │  └──────────────────────────────────────────┘
                │         │
                │         ▼
                │  [STOP - No Payment]
                │
                │         ▼
                │  ┌──────────────────────────────────────────┐
                │  │  CASE 2: Different Plan                 │
                │  │                                          │
                │  │  ┌────────────────────────────────────┐ │
                │  │  │  CHECK: Upgrade or Downgrade?      │ │
                │  │  └───────────┬────────────────────────┘ │
                │  │              │                           │
                │  │      ┌───────┴───────┐                  │
                │  │      │               │                  │
                │  │      ▼               ▼                  │
                │  │  [UPGRADE]      [DOWNGRADE]            │
                │  │  premium →      ultimate →             │
                │  │  ultimate      premium                 │
                │  │      │               │                  │
                │  │      ▼               ▼                  │
                │  │  ┌──────────────────────────────────┐ │
                │  │  │  UPGRADE: ✅ ALLOW                │ │
                │  │  │  - premium → ultimate            │ │
                │  │  │  - free → premium                 │ │
                │  │  │  - free → ultimate                │ │
                │  │  │                                   │ │
                │  │  │  Continue to Stripe Checkout    │ │
                │  │  └──────────────────────────────────┘ │
                │  │      │                                 │
                │  │      ▼                                 │
                │  │  ┌──────────────────────────────────┐ │
                │  │  │  DOWNGRADE: ❌ BLOCK             │ │
                │  │  │  - ultimate → premium            │ │
                │  │  │  - premium → free                 │ │
                │  │  │                                   │ │
                │  │  │  ❌ RETURN ERROR:                │ │
                │  │  │  "Cannot downgrade subscription. │ │
                │  │  │   Please cancel current first"   │ │
                │  │  │                                   │ │
                │  │  │  ✅ USER SEES:                   │ │
                │  │  │  Alert message explaining they    │ │
                │  │  │  need to cancel first             │ │
                │  │  └──────────────────────────────────┘ │
                │  │      │                                 │
                │  │      ▼                                 │
                │  │  [STOP - No Payment]                   │
                │  └──────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│         CREATE STRIPE CHECKOUT SESSION                          │
│         - Get Stripe Price ID                                   │
│         - Create session with subscription mode                 │
│         - Include user metadata (userId, planId, frequency)     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         RETURN: Checkout Session URL                            │
│         { url: "https://checkout.stripe.com/..." }              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         REDIRECT USER TO STRIPE CHECKOUT                        │
│         window.location.href = data.url                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         USER COMPLETES PAYMENT IN STRIPE                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         STRIPE WEBHOOK FIRES                                    │
│         checkout.session.completed                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         WEBHOOK HANDLER: /api/webhooks/stripe                   │
│         - Extract user ID from session metadata                  │
│         - Check for existing subscriptions                      │
│         - Update or create subscription in Supabase             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         REDIRECT TO DASHBOARD                                    │
│         /dashboard?success=true&session_id=...                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         DASHBOARD SHOWS UPDATED SUBSCRIPTION                    │
│         - Refresh subscription data                              │
│         - Display new plan                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Scenarios

### Scenario 1: User Already Has Same Plan (Active)

**User Action:**
- User has: `premium` (active)
- User clicks: `premium` plan button

**Flow:**
1. ✅ User is logged in
2. ✅ API call to `/api/create-checkout-session`
3. ✅ Check existing subscription → Found: `premium` (active)
4. ❌ **BLOCK**: Same plan + active status
5. ✅ Return error: "You already have an active subscription for this plan"
6. ✅ User sees alert message
7. ❌ **NO PAYMENT** - User stays on pricing page

**Result:**
- User is informed they already have this subscription
- No duplicate payment is created
- User can manage subscription from dashboard

---

### Scenario 2: User Upgrades Plan

**User Action:**
- User has: `premium` (active)
- User clicks: `ultimate` plan button

**Flow:**
1. ✅ User is logged in
2. ✅ API call to `/api/create-checkout-session`
3. ✅ Check existing subscription → Found: `premium` (active)
4. ✅ **ALLOW**: Upgrade (premium → ultimate)
5. ✅ Create Stripe Checkout Session
6. ✅ Redirect to Stripe Checkout
7. ✅ User completes payment
8. ✅ Webhook fires: `checkout.session.completed`
9. ✅ Webhook handler updates subscription in Supabase:
   - Updates existing subscription record
   - Changes `plan_id` from `premium` to `ultimate`
   - Updates `stripe_subscription_id` to new subscription
   - Sets `status` to `active`
10. ✅ Redirect to dashboard
11. ✅ Dashboard shows updated subscription: `ultimate`

**Result:**
- User successfully upgrades to ultimate plan
- Old subscription is updated (not duplicated)
- User sees new plan in dashboard

---

### Scenario 3: User Has No Subscription

**User Action:**
- User has: `free` (no active subscription)
- User clicks: `premium` plan button

**Flow:**
1. ✅ User is logged in
2. ✅ API call to `/api/create-checkout-session`
3. ✅ Check existing subscription → Found: `free` (or none)
4. ✅ **ALLOW**: New subscription (free → premium)
5. ✅ Create Stripe Checkout Session
6. ✅ Redirect to Stripe Checkout
7. ✅ User completes payment
8. ✅ Webhook fires: `checkout.session.completed`
9. ✅ Webhook handler creates subscription in Supabase:
   - Creates new subscription record
   - Sets `plan_id` to `premium`
   - Sets `stripe_subscription_id` to new subscription
   - Sets `status` to `active`
10. ✅ Redirect to dashboard
11. ✅ Dashboard shows new subscription: `premium`

**Result:**
- User successfully subscribes to premium plan
- New subscription is created in database
- User sees new plan in dashboard

---

### Scenario 4: User Tries to Downgrade

**User Action:**
- User has: `ultimate` (active)
- User clicks: `premium` plan button

**Flow:**
1. ✅ User is logged in
2. ✅ API call to `/api/create-checkout-session`
3. ✅ Check existing subscription → Found: `ultimate` (active)
4. ❌ **BLOCK**: Downgrade (ultimate → premium)
5. ✅ Return error: "Cannot downgrade subscription. Please cancel your current subscription first."
6. ✅ User sees alert message
7. ❌ **NO PAYMENT** - User stays on pricing page

**Result:**
- User is informed they cannot downgrade
- User must cancel current subscription first
- No payment is processed

---

## Plan Hierarchy

```
free (0) < premium (1) < ultimate (2)
```

**Upgrades Allowed:**
- ✅ free → premium
- ✅ free → ultimate
- ✅ premium → ultimate

**Downgrades Blocked:**
- ❌ ultimate → premium
- ❌ premium → free
- ❌ ultimate → free

**Same Plan Blocked:**
- ❌ premium → premium (if active)
- ❌ ultimate → ultimate (if active)

---

## Database Updates

### When Upgrade Happens:
```sql
UPDATE user_subscriptions
SET 
  plan_id = 'ultimate',
  status = 'active',
  stripe_subscription_id = 'sub_new_xxx',
  stripe_customer_id = 'cus_xxx',
  updated_at = NOW()
WHERE user_id = 'user_xxx'
```

### When New Subscription:
```sql
INSERT INTO user_subscriptions (
  user_id,
  plan_id,
  status,
  stripe_subscription_id,
  stripe_customer_id
)
VALUES (
  'user_xxx',
  'premium',
  'active',
  'sub_new_xxx',
  'cus_xxx'
)
```

---

## Error Messages

### Same Plan Error:
```json
{
  "error": "You already have an active subscription for this plan",
  "currentPlan": "premium",
  "status": "active",
  "message": "You are already subscribed to the premium plan. If you want to change your billing frequency, please cancel your current subscription first."
}
```

### Downgrade Error:
```json
{
  "error": "Cannot downgrade subscription",
  "currentPlan": "ultimate",
  "requestedPlan": "premium",
  "message": "You currently have an active ultimate subscription. To switch to premium, please cancel your current subscription first."
}
```

---

## Summary

✅ **Allowed:**
- New subscriptions (free → premium/ultimate)
- Upgrades (premium → ultimate)

❌ **Blocked:**
- Same plan subscriptions (if active)
- Downgrades (ultimate → premium, premium → free)

This ensures:
- No duplicate subscriptions
- No accidental downgrades
- Clear user feedback
- Proper subscription management

