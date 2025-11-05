# Data Access Layer Implementation

## Overview

A secure data access layer has been implemented to protect user data at the application level. This layer ensures that users can only access their own data by verifying Clerk user IDs match the data being accessed.

## Architecture

### 1. Data Access Layer Module (`src/lib/data-access-layer.ts`)

Provides secure functions that enforce access control:
- `getUserData()` - Get user data with access verification
- `getTradingViewUsername()` - Get TradingView username with access verification
- `updateTradingViewUsername()` - Update TradingView username with access verification
- `getUserSubscription()` - Get subscription data with access verification
- `verifyUserAccess()` - Helper function to verify user access

### 2. Access Control Strategy

**Application-Level Access Control:**
- All data access functions verify that the `clerkUserId` parameter matches the `clerk_id` in the database
- Queries use `.eq('clerk_id', clerkUserId)` to filter by user ID
- Additional verification checks ensure data belongs to the requesting user

**Defense in Depth:**
1. **API Route Level**: Clerk authentication ensures only signed-in users can access endpoints
2. **Data Access Layer**: Functions verify user ID matches before returning data
3. **Database Level**: Queries filter by `clerk_id` to ensure only matching records are returned
4. **Verification Checks**: Additional checks verify `clerk_id` matches before operations

## Security Features

### 1. User ID Verification

All functions verify that the `clerkUserId` matches the `clerk_id` in the database:

```typescript
// Example from getUserData()
if (data && data.clerk_id !== clerkUserId) {
  return {
    data: null,
    error: new Error('Unauthorized: User ID mismatch'),
    authorized: false,
  };
}
```

### 2. Filtered Queries

All database queries filter by `clerk_id`:

```typescript
const { data } = await supabaseAdmin
  .from('users')
  .select('*')
  .eq('clerk_id', clerkUserId)  // Only returns data for this user
  .single();
```

### 3. Error Handling

All functions return structured results with authorization status:

```typescript
interface DataAccessResult<T> {
  data: T | null;
  error: Error | null;
  authorized: boolean;
}
```

## API Route Integration

### Before (Direct Database Access)

```typescript
// ❌ Direct access without access control
const { data } = await supabaseAdmin
  .from('users')
  .select('tradingview_username')
  .eq('clerk_id', userId)
  .single();
```

### After (Data Access Layer)

```typescript
// ✅ Secure access with access control
const result = await getTradingViewUsername(userId);

if (!result.authorized) {
  return NextResponse.json(
    { error: 'Unauthorized access' },
    { status: 403 }
  );
}
```

## Tables and Access Control

### 1. users table
- **Access**: Users can only access their own data (`clerk_id` match required)
- **Verification**: Functions verify `clerk_id` matches before returning data
- **Operations**: Read, Update (with user ID verification)

### 2. subscriptions table
- **Access**: Users can only access subscriptions linked to their `user_id`
- **Verification**: Functions first get user's Supabase ID, then query subscriptions
- **Operations**: Read (with user ID verification)

### 3. tradingview_credentials table
- **Access**: Users can only access credentials linked to their `user_id`
- **Verification**: Functions verify user ID matches before returning data
- **Operations**: Read, Create, Update, Delete (with user ID verification)

### 4. user_subscriptions table
- **Access**: Users can only access subscriptions where `user_id` matches their Clerk ID
- **Verification**: Functions verify `user_id` matches before returning data
- **Operations**: Read, Create, Update, Delete (with user ID verification)

## Security Benefits

1. **Automatic Access Control**: Functions automatically verify user access
2. **Defense in Depth**: Multiple layers of security (Clerk auth + data access layer + filtered queries)
3. **Consistent Security**: All data access uses the same security pattern
4. **Easy to Audit**: All access control logic is in one place
5. **Type Safety**: TypeScript ensures proper usage

## Usage Examples

### Get TradingView Username

```typescript
const result = await getTradingViewUsername(userId);

if (!result.authorized) {
  // Handle unauthorized access
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}

if (result.error) {
  // Handle error
  return NextResponse.json({ error: 'Failed to get username' }, { status: 500 });
}

return NextResponse.json({ username: result.data });
```

### Update TradingView Username

```typescript
const result = await updateTradingViewUsername(userId, newUsername);

if (!result.authorized) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}

if (result.error) {
  return NextResponse.json({ error: result.error.message }, { status: 500 });
}

return NextResponse.json({ username: result.data });
```

### Get User Subscription

```typescript
const result = await getUserSubscription(userId);

if (!result.authorized) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}

return NextResponse.json(result.data || { plan_type: 'free', status: 'active' });
```

## Testing

### Test Access Control

1. **Valid Access**:
   - User A requests their own data ✅
   - Function verifies `clerk_id` matches ✅
   - Data is returned ✅

2. **Invalid Access**:
   - User A tries to access User B's data ❌
   - Query filters by `clerk_id` (User A) ❌
   - No data returned (or error if somehow accessed) ❌

3. **Unauthorized Access**:
   - Unauthenticated request ❌
   - Clerk auth blocks request ❌
   - API returns 401 Unauthorized ❌

## Migration Notes

### Changes Made

1. **Created Data Access Layer** (`src/lib/data-access-layer.ts`)
   - Centralized access control functions
   - Consistent security pattern

2. **Updated API Routes**:
   - `/api/user/tradingview` - Uses `getTradingViewUsername()` and `updateTradingViewUsername()`
   - `/api/user/subscription` - Uses `getUserSubscription()`

3. **Removed RLS Header Approach**:
   - Supabase RLS can't access custom headers
   - Using application-level access control instead

### Benefits

- ✅ More reliable than RLS header approach
- ✅ Works with Clerk authentication
- ✅ Easier to test and debug
- ✅ Consistent security pattern
- ✅ Type-safe implementation

## Maintenance

### Adding New Data Access Functions

1. Add function to `src/lib/data-access-layer.ts`
2. Follow the same pattern:
   - Verify `clerkUserId` matches
   - Filter queries by `clerk_id`
   - Return `DataAccessResult<T>`
3. Update API routes to use the new function

### Modifying Access Control

1. Update functions in `src/lib/data-access-layer.ts`
2. All API routes will automatically use the updated security
3. Test thoroughly before deploying

## References

- Data Access Layer: `src/lib/data-access-layer.ts`
- API Routes: `src/app/api/user/*`
- Clerk Authentication: `src/middleware.ts`

