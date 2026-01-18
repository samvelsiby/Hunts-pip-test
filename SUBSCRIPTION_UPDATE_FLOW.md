# What Happens When User Updates Subscription

## Overview

When a user updates their subscription (upgrade, downgrade, cancel, change billing), your system handles it through **Stripe Customer Portal** and **webhooks**. Here's the complete flow:

---

## How Users Update Their Subscription

### Method 1: Stripe Customer Portal (Primary Method)

**User Action:**
1. User goes to Dashboard
2. Clicks "Manage Subscription" button
3. Redirected to Stripe Customer Portal

**What Happens:**
```
User clicks "Manage Subscription"
  ↓
Frontend calls: /api/create-portal-session
  ↓
API finds user's Stripe customer ID from database
  ↓
Creates Stripe Billing Portal session
  ↓
Returns portal URL
  ↓
User redirected to Stripe Customer Portal
```

**In Stripe Portal, User Can:**
- ✅ **Upgrade** plan (premium → ultimate)
- ✅ **Change billing frequency** (monthly ↔ yearly)
- ✅ **Update payment method**
- ✅ **Cancel subscription**
- ✅ **View billing history**
- ✅ **Download invoices**

---

## What Your System Does When Subscription Updates

### Step 1: User Makes Changes in Stripe Portal

When user changes subscription in Stripe Portal:
- Stripe processes the change
- Stripe updates the subscription object
- Stripe sends webhook to your system

### Step 2: Webhook Receives Update

**Webhook Event**: `customer.subscription.updated`

**What Happens:**
```
Stripe sends webhook → /api/webhooks/stripe
  ↓
Event type: customer.subscription.updated
  ↓
Handler function: handleSubscriptionUpdate()
```

### Step 3: Webhook Handler Processes Update

**Code Location**: `src/app/api/webhooks/stripe/route.ts`

**What It Does:**

```typescript
1. Extracts data from webhook:
   - customerId (Stripe customer ID)
   - subscriptionId (Stripe subscription ID)
   - status (active/canceled/past_due/unpaid)
   - planId (from metadata, if provided)

2. Finds user in your database:
   - Looks up by Stripe customer ID
   - Or by subscription metadata (userId)
   - Or by querying existing subscriptions

3. Determines new status:
   - Maps Stripe status to your status
   - active → 'active'
   - canceled → 'canceled'
   - past_due → 'past_due'
   - unpaid → 'unpaid'
   - else → 'inactive'

4. Updates database:
   - Finds existing subscription record
   - Updates status
   - Updates plan_id (if provided in metadata)
   - Updates stripe_subscription_id
   - Updates updated_at timestamp
   - Deletes duplicate subscriptions
```

### Step 4: Database Update

**Table**: `user_subscriptions`

**SQL Equivalent:**
```sql
UPDATE user_subscriptions
SET 
  status = 'active',           -- or 'canceled', 'past_due', etc.
  plan_id = 'ultimate',        -- if upgrade (from metadata)
  stripe_subscription_id = 'sub_new_xxx',
  updated_at = NOW()
WHERE user_id = 'user_abc123'
```

---

## Specific Update Scenarios

### Scenario 1: User Upgrades (Premium → Ultimate)

**User Action:**
- In Stripe Portal, changes plan from Premium to Ultimate

**System Flow:**
```
1. User changes plan in Stripe Portal
   ↓
2. Stripe updates subscription
   ↓
3. Webhook fires: customer.subscription.updated
   ↓
4. Webhook handler:
   - Gets planId='ultimate' from subscription metadata
   - Finds user's subscription record
   - Updates plan_id: 'premium' → 'ultimate'
   - Updates status: 'active'
   - Updates stripe_subscription_id
   ↓
5. Database updated:
   user_subscriptions:
     plan_id: 'ultimate' ✅
     status: 'active' ✅
   ↓
6. User now has Ultimate access!
```

**Database Changes:**
- `plan_id`: `'premium'` → `'ultimate'` ✅
- `status`: `'active'` ✅
- `stripe_subscription_id`: Updated to new subscription ID
- `updated_at`: Current timestamp

**Impact:**
- ✅ User immediately gets Ultimate features
- ✅ Dashboard shows Ultimate plan
- ✅ Access granted automatically

---

### Scenario 2: User Changes Billing Frequency (Monthly → Yearly)

**User Action:**
- In Stripe Portal, changes from monthly to yearly billing

**System Flow:**
```
1. User changes billing in Stripe Portal
   ↓
2. Stripe creates new subscription (yearly)
   ↓
3. Webhook fires: customer.subscription.updated
   ↓
4. Webhook handler:
   - Updates stripe_subscription_id to new subscription
   - Keeps same plan_id (premium/ultimate)
   - Updates status: 'active'
   ↓
5. Database updated:
   user_subscriptions:
     plan_id: 'premium' (unchanged)
     status: 'active' ✅
     stripe_subscription_id: 'sub_new_yearly_xxx' ✅
```

**Database Changes:**
- `stripe_subscription_id`: Updated to new subscription ID
- `status`: `'active'` ✅
- `plan_id`: Unchanged (still premium/ultimate)
- `updated_at`: Current timestamp

**Impact:**
- ✅ User keeps same plan level
- ✅ Billing frequency changed in Stripe
- ✅ Next payment will be yearly

---

### Scenario 3: User Cancels Subscription

**User Action:**
- In Stripe Portal, cancels subscription

**System Flow:**
```
1. User cancels in Stripe Portal
   ↓
2. Stripe updates subscription status to 'canceled'
   ↓
3. Webhook fires: customer.subscription.deleted
   OR customer.subscription.updated (status='canceled')
   ↓
4. Webhook handler:
   - Updates status: 'active' → 'canceled'
   ↓
5. Database updated:
   user_subscriptions:
     status: 'canceled' ✅
```

**Database Changes:**
- `status`: `'active'` → `'canceled'` ❌
- `updated_at`: Current timestamp

**Impact:**
- ❌ User loses access to paid features
- ❌ Subscription shows as canceled
- ⚠️ User should be downgraded to free plan (may need manual process)

---

### Scenario 4: User Updates Payment Method

**User Action:**
- In Stripe Portal, updates credit card

**System Flow:**
```
1. User updates payment method in Stripe Portal
   ↓
2. Stripe updates customer payment method
   ↓
3. Webhook fires: customer.updated (if configured)
   ↓
4. Webhook handler:
   - Currently just logs the event
   - No database changes needed
   ↓
5. Payment method updated in Stripe only
```

**Database Changes:**
- None (payment method stored in Stripe, not your database)

**Impact:**
- ✅ Future payments use new card
- ✅ No access changes
- ✅ Subscription continues normally

---

## Complete Update Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              USER UPDATES SUBSCRIPTION                       │
│              (In Stripe Customer Portal)                     │
└────────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         STRIPE PROCESSES UPDATE                              │
│         - Changes subscription object                         │
│         - Updates billing cycle                              │
│         - Processes proration (if upgrade)                   │
└────────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         STRIPE SENDS WEBHOOK                                 │
│         Event: customer.subscription.updated                │
│         → /api/webhooks/stripe                               │
└────────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         WEBHOOK HANDLER                                      │
│         1. Verifies signature                                │
│         2. Extracts subscription data                       │
│         3. Finds user by customer ID                         │
│         4. Determines new status                              │
│         5. Gets plan_id from metadata                        │
└────────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         DATABASE UPDATE                                      │
│         UPDATE user_subscriptions                            │
│         SET                                                  │
│           status = 'active' (or new status)                  │
│           plan_id = 'ultimate' (if upgrade)                 │
│           stripe_subscription_id = 'sub_new_xxx'            │
│           updated_at = NOW()                                │
│         WHERE user_id = 'user_abc123'                        │
└────────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         USER ACCESS UPDATED                                  │
│         - Dashboard shows new plan                            │
│         - Features updated immediately                       │
│         - Billing reflects changes                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Code Functions

### 1. Create Portal Session
**File**: `src/app/api/create-portal-session/route.ts`

```typescript
// Gets user's Stripe customer ID from database
// Creates Stripe Billing Portal session
// Returns portal URL to redirect user
```

### 2. Handle Subscription Update
**File**: `src/app/api/webhooks/stripe/route.ts`
**Function**: `handleSubscriptionUpdate()`

```typescript
// Receives customer.subscription.updated event
// Finds user by customer ID
// Updates subscription record in database
// Handles upgrades, status changes, etc.
```

### 3. Handle Subscription Deletion
**File**: `src/app/api/webhooks/stripe/route.ts`
**Function**: `handleSubscriptionDeleted()`

```typescript
// Receives customer.subscription.deleted event
// Updates status to 'canceled'
// Revokes access
```

---

## Important Notes

### 1. Plan ID Updates
- Plan ID (`plan_id`) is updated **only if provided in subscription metadata**
- If metadata doesn't have `planId`, system keeps existing plan
- This is why it's important to include `planId` in subscription metadata when creating checkout sessions

### 2. Duplicate Prevention
- System checks for existing subscriptions before creating new ones
- If multiple subscriptions exist, keeps most recent and deletes others
- Prevents duplicate subscription records

### 3. Status Mapping
- Stripe status → Your database status:
  - `active` → `'active'`
  - `canceled` → `'canceled'`
  - `past_due` → `'past_due'`
  - `unpaid` → `'unpaid'`
  - Other → `'inactive'`

### 4. User Finding Logic
Webhook tries multiple methods to find user:
1. From subscription metadata (`userId`)
2. From existing subscription record (by customer ID)
3. From Stripe customer metadata
4. If not found, logs error and returns

### 5. Idempotency
- Webhook handlers are **idempotent** (safe to retry)
- If webhook is called multiple times, result is the same
- Prevents duplicate updates

---

## Testing Subscription Updates

### Test Upgrade:
1. User has Premium subscription
2. Go to Dashboard → "Manage Subscription"
3. In Stripe Portal, upgrade to Ultimate
4. Check database: `plan_id` should be `'ultimate'`
5. Check dashboard: Should show Ultimate plan

### Test Cancel:
1. User has active subscription
2. Go to Dashboard → "Manage Subscription"
3. In Stripe Portal, cancel subscription
4. Check database: `status` should be `'canceled'`
5. Check dashboard: Should show canceled status

### Test Billing Change:
1. User has monthly subscription
2. Go to Dashboard → "Manage Subscription"
3. In Stripe Portal, change to yearly
4. Check database: `stripe_subscription_id` should be updated
5. Check Stripe: New subscription with yearly billing

---

## Summary

**When User Updates Subscription:**

1. ✅ User uses Stripe Customer Portal (via "Manage Subscription" button)
2. ✅ Stripe processes the change
3. ✅ Stripe sends webhook: `customer.subscription.updated`
4. ✅ Your webhook handler receives event
5. ✅ System finds user by customer ID
6. ✅ Database updated with new status/plan
7. ✅ User access updated immediately
8. ✅ Dashboard reflects changes

**Key Points:**
- Updates happen **automatically** via webhooks
- No manual intervention needed
- Database stays in sync with Stripe
- User access changes immediately
- All changes are logged for debugging

**The system is fully automated - webhooks handle everything!** 🎯
