# How Stripe IDs Are Used For Users

## Overview

Your system uses **two types of Stripe IDs** to link users between your database and Stripe:
1. **Stripe Customer ID** (`stripe_customer_id`) - Links user to Stripe customer
2. **Stripe Subscription ID** (`stripe_subscription_id`) - Links user to specific subscription

---

## The Three ID Systems

Your system uses **three different ID systems** that need to be connected:

```
┌─────────────────────────────────────────────────────────────┐
│                    ID SYSTEMS                                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Clerk User ID (user_abc123)                              │
│     - Used in your app for authentication                     │
│     - Stored in: users.clerk_id                              │
│                                                               │
│  2. Stripe Customer ID (cus_xyz789)                           │
│     - Created by Stripe when user first pays                  │
│     - Stored in: user_subscriptions.stripe_customer_id        │
│     - Links user to Stripe customer record                    │
│                                                               │
│  3. Stripe Subscription ID (sub_def456)                       │
│     - Created by Stripe for each subscription                 │
│     - Stored in: user_subscriptions.stripe_subscription_id    │
│     - Links user to specific subscription                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Table: `user_subscriptions`

```sql
user_subscriptions
├── id (UUID) - Your internal ID
├── user_id (string) - Clerk User ID (e.g., 'user_abc123')
├── plan_id (string) - 'free', 'premium', 'ultimate'
├── status (string) - 'active', 'canceled', 'past_due', etc.
├── stripe_customer_id (string) - Stripe Customer ID (e.g., 'cus_xyz789')
├── stripe_subscription_id (string) - Stripe Subscription ID (e.g., 'sub_def456')
├── created_at (timestamp)
└── updated_at (timestamp)
```

**Example Record:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user_abc123",              // Clerk ID
  "plan_id": "premium",
  "status": "active",
  "stripe_customer_id": "cus_xyz789",   // Stripe Customer ID
  "stripe_subscription_id": "sub_def456", // Stripe Subscription ID
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

## How Stripe IDs Are Created

### Step 1: User Subscribes

```
User clicks "Subscribe Premium"
  ↓
Your app calls: /api/create-checkout-session
  ↓
Stripe creates:
  - Customer ID (cus_xyz789) - NEW customer
  - Subscription ID (sub_def456) - NEW subscription
  ↓
User completes payment
  ↓
Stripe sends webhook: checkout.session.completed
```

### Step 2: Webhook Saves IDs

**Webhook receives:**
```json
{
  "customer": "cus_xyz789",        // Stripe Customer ID
  "subscription": "sub_def456",    // Stripe Subscription ID
  "client_reference_id": "user_abc123"  // Clerk User ID
}
```

**Webhook saves to database:**
```sql
INSERT INTO user_subscriptions (
  user_id,                    -- 'user_abc123' (from Clerk)
  stripe_customer_id,        -- 'cus_xyz789' (from Stripe)
  stripe_subscription_id,    -- 'sub_def456' (from Stripe)
  plan_id,                   -- 'premium'
  status                     -- 'active'
)
```

**Result:** All three IDs are now linked in your database!

---

## How Stripe IDs Are Used

### Use Case 1: Finding User by Stripe Customer ID

**When:** Webhook receives event but doesn't have Clerk user ID

**Example:** `invoice.payment_succeeded` webhook

```typescript
// Webhook receives invoice with customer ID
const customerId = invoice.customer; // 'cus_xyz789'

// Find user in database by Stripe customer ID
const { data } = await supabaseAdmin
  .from('user_subscriptions')
  .select('user_id')  // Get Clerk user ID
  .eq('stripe_customer_id', customerId)  // Find by Stripe ID
  .maybeSingle();

const clerkUserId = data.user_id; // 'user_abc123'
```

**Why This Is Needed:**
- Webhooks from Stripe only have Stripe IDs
- Your app needs Clerk user ID to update the right user
- Stripe customer ID is the **bridge** between systems

---

### Use Case 2: Opening Stripe Customer Portal

**When:** User clicks "Manage Subscription" in dashboard

**Code:** `src/app/api/create-portal-session/route.ts`

```typescript
// 1. Get Clerk user ID (from authentication)
const { userId } = await auth(); // 'user_abc123'

// 2. Find subscription to get Stripe customer ID
const { data: subscription } = await getUserSubscription(userId);

// 3. Extract Stripe customer ID
const customerId = subscription.stripe_customer_id; // 'cus_xyz789'

// 4. Create Stripe portal session using customer ID
const session = await stripe.billingPortal.sessions.create({
  customer: customerId,  // Stripe needs customer ID, not Clerk ID!
  return_url: 'https://huntspip.com/dashboard',
});

// 5. Redirect user to portal
return { url: session.url };
```

**Why This Is Needed:**
- Stripe Customer Portal requires Stripe customer ID
- Your app only has Clerk user ID
- Database lookup converts Clerk ID → Stripe customer ID

---

### Use Case 3: Updating Subscription Status

**When:** Recurring payment succeeds or fails

**Code:** `handlePaymentSucceeded()` and `handlePaymentFailed()`

```typescript
// Webhook receives invoice with customer ID
const customerId = invoice.customer; // 'cus_xyz789'

// Update subscription by Stripe customer ID
await supabaseAdmin
  .from('user_subscriptions')
  .update({
    status: 'active',  // or 'past_due' for failed payments
    updated_at: new Date().toISOString(),
  })
  .eq('stripe_customer_id', customerId);  // Find by Stripe ID
```

**Why This Is Needed:**
- Webhook only knows Stripe customer ID
- Need to find and update the right subscription record
- Stripe customer ID is the lookup key

---

### Use Case 4: Handling Subscription Updates

**When:** User upgrades/downgrades in Stripe Portal

**Code:** `handleSubscriptionUpdate()`

```typescript
// Webhook receives subscription with customer ID
const customerId = subscription.customer; // 'cus_xyz789'
const subscriptionId = subscription.id;    // 'sub_def456'

// Try to find user by customer ID
let clerkId = subscription.metadata?.userId; // May not exist

if (!clerkId) {
  // Look up user by Stripe customer ID
  const { data } = await supabaseAdmin
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)  // Find by Stripe ID
    .maybeSingle();
  
  clerkId = data.user_id; // 'user_abc123'
}

// Now update subscription using Clerk user ID
await supabaseAdmin
  .from('user_subscriptions')
  .update({
    status: 'active',
    stripe_subscription_id: subscriptionId,  // Update subscription ID
    plan_id: 'ultimate',  // If upgrade
  })
  .eq('user_id', clerkId);  // Update by Clerk ID
```

**Why This Is Needed:**
- Webhook may not have Clerk user ID in metadata
- Stripe customer ID is reliable lookup method
- Need to update subscription ID when subscription changes

---

## ID Lookup Flow

### Forward Lookup: Clerk ID → Stripe IDs

**When:** Your app needs Stripe IDs (e.g., open portal)

```
Clerk User ID (user_abc123)
  ↓
Query: SELECT * FROM user_subscriptions WHERE user_id = 'user_abc123'
  ↓
Get: stripe_customer_id = 'cus_xyz789'
     stripe_subscription_id = 'sub_def456'
  ↓
Use Stripe IDs for Stripe API calls
```

**Code Example:**
```typescript
// Start with Clerk ID
const clerkUserId = 'user_abc123';

// Look up subscription
const { data } = await getUserSubscription(clerkUserId);

// Get Stripe IDs
const customerId = data.stripe_customer_id;      // 'cus_xyz789'
const subscriptionId = data.stripe_subscription_id; // 'sub_def456'
```

---

### Reverse Lookup: Stripe ID → Clerk ID

**When:** Webhook needs to find user (e.g., payment event)

```
Stripe Customer ID (cus_xyz789)
  ↓
Query: SELECT user_id FROM user_subscriptions WHERE stripe_customer_id = 'cus_xyz789'
  ↓
Get: user_id = 'user_abc123'
  ↓
Use Clerk ID to update user's subscription
```

**Code Example:**
```typescript
// Start with Stripe customer ID (from webhook)
const customerId = 'cus_xyz789';

// Look up user
const { data } = await supabaseAdmin
  .from('user_subscriptions')
  .select('user_id')
  .eq('stripe_customer_id', customerId)
  .maybeSingle();

// Get Clerk ID
const clerkUserId = data.user_id; // 'user_abc123'
```

---

## Complete User Journey with IDs

### Journey: User Subscribes for First Time

```
1. User signs up via Clerk
   Clerk ID: user_abc123
   ↓
2. User clicks "Subscribe Premium"
   Your app: Knows Clerk ID (user_abc123)
   ↓
3. Create Stripe Checkout Session
   Stripe creates: Customer ID (cus_xyz789)
   Your app: Passes Clerk ID in metadata
   ↓
4. User completes payment
   Stripe creates: Subscription ID (sub_def456)
   ↓
5. Webhook: checkout.session.completed
   Receives:
     - customer: 'cus_xyz789'
     - subscription: 'sub_def456'
     - client_reference_id: 'user_abc123'
   ↓
6. Webhook saves to database:
   INSERT INTO user_subscriptions (
     user_id: 'user_abc123',           // From Clerk
     stripe_customer_id: 'cus_xyz789', // From Stripe
     stripe_subscription_id: 'sub_def456', // From Stripe
     plan_id: 'premium',
     status: 'active'
   )
   ↓
7. All three IDs are now linked! ✅
```

---

### Journey: User Manages Subscription

```
1. User clicks "Manage Subscription"
   Your app: Knows Clerk ID (user_abc123)
   ↓
2. API call: /api/create-portal-session
   Query: Find subscription by Clerk ID
   SELECT stripe_customer_id 
   FROM user_subscriptions 
   WHERE user_id = 'user_abc123'
   ↓
3. Get Stripe customer ID: 'cus_xyz789'
   ↓
4. Create Stripe Portal Session
   stripe.billingPortal.sessions.create({
     customer: 'cus_xyz789'  // Stripe needs this!
   })
   ↓
5. User redirected to Stripe Portal
   User can: Upgrade, cancel, change billing
   ↓
6. User makes change (e.g., upgrades)
   Stripe updates subscription
   ↓
7. Webhook: customer.subscription.updated
   Receives:
     - customer: 'cus_xyz789'
     - subscription: 'sub_new_789'  // New subscription ID
   ↓
8. Webhook finds user:
   Query: SELECT user_id 
   FROM user_subscriptions 
   WHERE stripe_customer_id = 'cus_xyz789'
   ↓
9. Get Clerk ID: 'user_abc123'
   ↓
10. Update subscription:
    UPDATE user_subscriptions
    SET 
      plan_id = 'ultimate',
      stripe_subscription_id = 'sub_new_789'
    WHERE user_id = 'user_abc123'
    ↓
11. User's subscription updated! ✅
```

---

### Journey: Recurring Payment

```
1. Monthly billing date arrives
   Stripe charges customer's card
   ↓
2. Payment succeeds
   Stripe sends webhook: invoice.payment_succeeded
   Receives:
     - customer: 'cus_xyz789'
   ↓
3. Webhook finds user:
   Query: SELECT user_id 
   FROM user_subscriptions 
   WHERE stripe_customer_id = 'cus_xyz789'
   ↓
4. Get Clerk ID: 'user_abc123'
   ↓
5. Update subscription status:
   UPDATE user_subscriptions
   SET status = 'active'
   WHERE stripe_customer_id = 'cus_xyz789'
   ↓
6. User's subscription renewed! ✅
```

---

## Key Points

### 1. Stripe Customer ID is the Bridge
- **One customer ID per user** (created on first payment)
- **Persists across subscriptions** (same customer, different subscriptions)
- **Used to link** Clerk user ↔ Stripe customer

### 2. Stripe Subscription ID Changes
- **New subscription ID** when:
  - User upgrades/downgrades
  - User changes billing frequency
  - Subscription is canceled and recreated
- **Must be updated** in database when it changes

### 3. Clerk User ID is Primary Key
- **Your app uses Clerk ID** for authentication
- **Database uses Clerk ID** as `user_id` in `user_subscriptions`
- **Stripe IDs are foreign keys** that link to Stripe

### 4. Lookup Methods
- **Forward:** Clerk ID → Stripe IDs (for Stripe API calls)
- **Reverse:** Stripe ID → Clerk ID (for webhook processing)

### 5. Why Store Both IDs?
- **Customer ID:** Used for Stripe Customer Portal, customer-level operations
- **Subscription ID:** Used for subscription-specific operations, tracking current subscription

---

## Common Operations

### Operation 1: Get User's Stripe Customer ID

```typescript
// Start with Clerk user ID
const clerkUserId = 'user_abc123';

// Query database
const { data } = await getUserSubscription(clerkUserId);

// Get Stripe customer ID
const customerId = data.stripe_customer_id; // 'cus_xyz789'
```

### Operation 2: Find User by Stripe Customer ID

```typescript
// Start with Stripe customer ID (from webhook)
const customerId = 'cus_xyz789';

// Query database
const { data } = await supabaseAdmin
  .from('user_subscriptions')
  .select('user_id')
  .eq('stripe_customer_id', customerId)
  .maybeSingle();

// Get Clerk user ID
const clerkUserId = data.user_id; // 'user_abc123'
```

### Operation 3: Update Subscription by Stripe Customer ID

```typescript
// Webhook receives customer ID
const customerId = 'cus_xyz789';

// Update directly by Stripe customer ID
await supabaseAdmin
  .from('user_subscriptions')
  .update({
    status: 'active',
    updated_at: new Date().toISOString(),
  })
  .eq('stripe_customer_id', customerId);
```

### Operation 4: Update Subscription by Clerk User ID

```typescript
// Your app knows Clerk user ID
const clerkUserId = 'user_abc123';

// Update by Clerk user ID
await supabaseAdmin
  .from('user_subscriptions')
  .update({
    plan_id: 'ultimate',
    status: 'active',
  })
  .eq('user_id', clerkUserId);
```

---

## Error Handling

### Missing Stripe Customer ID

**When:** User tries to open portal but has no subscription

```typescript
const { data: subscription } = await getUserSubscription(userId);

if (!subscription?.stripe_customer_id) {
  return NextResponse.json(
    { error: 'No active subscription or customer record found' },
    { status: 404 }
  );
}
```

### Missing User for Stripe Customer ID

**When:** Webhook can't find user

```typescript
const { data } = await supabaseAdmin
  .from('user_subscriptions')
  .select('user_id')
  .eq('stripe_customer_id', customerId)
  .maybeSingle();

if (!data) {
  console.error('❌ Could not find user for subscription');
  return { error: 'User not found', subscriptionId };
}
```

---

## Summary

**Stripe IDs serve as the bridge between your app and Stripe:**

1. **Stripe Customer ID** (`cus_xxx`)
   - Created when user first pays
   - Links user to Stripe customer record
   - Used for: Customer Portal, customer operations
   - Stored in: `user_subscriptions.stripe_customer_id`

2. **Stripe Subscription ID** (`sub_xxx`)
   - Created for each subscription
   - Changes when subscription is modified
   - Used for: Subscription-specific operations
   - Stored in: `user_subscriptions.stripe_subscription_id`

3. **Clerk User ID** (`user_xxx`)
   - Your app's primary user identifier
   - Used for: Authentication, app operations
   - Stored in: `user_subscriptions.user_id`

**The database links all three IDs together, allowing:**
- ✅ Your app to find Stripe IDs (for Stripe API calls)
- ✅ Webhooks to find users (for database updates)
- ✅ Seamless integration between Clerk, Stripe, and your database

**Without Stripe IDs, you couldn't:**
- ❌ Open Stripe Customer Portal
- ❌ Process webhooks (wouldn't know which user)
- ❌ Update subscriptions from Stripe events
- ❌ Link payments to users

**Stripe IDs are essential for the payment system to work!** 🎯
