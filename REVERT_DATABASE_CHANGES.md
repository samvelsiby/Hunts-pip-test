# Database Changes Reverted

## Changes Removed (After Commit c6c738a)

### 1. Removed Function: `get_clerk_user_id()`
- **Purpose**: Extracted Clerk user ID from JWT claims
- **Status**: ✅ **DROPPED**

### 2. Removed RLS Policies on `users` table:
- **"Users can view their own data"** - ✅ **DROPPED**
- **"Users can update their own data"** - ✅ **DROPPED**

### 3. Removed RLS Policies on `subscriptions` table:
- **"Users can view their own subscriptions"** - ✅ **DROPPED**
- **"Users can update their own subscriptions"** - ✅ **DROPPED**
- **"Users can insert their own subscriptions"** - ✅ **DROPPED**
- **"Users can delete their own subscriptions"** - ✅ **DROPPED**

## What Was Kept

### `tradingview_username` Column
- **Status**: ✅ **KEPT** (in `users` table)
- **Reason**: This column may have existed before the JWT changes. If you need to remove it, run:
  ```sql
  ALTER TABLE users DROP COLUMN IF EXISTS tradingview_username;
  ```

## Current Database State

- ✅ `get_clerk_user_id()` function removed
- ✅ All RLS policies using `get_clerk_user_id()` removed
- ✅ RLS is still enabled on tables, but policies are removed
- ⚠️ **Note**: You may need to add new RLS policies or disable RLS if needed

## Next Steps

1. **If you need RLS policies** (without JWT):
   - Add new RLS policies that don't use `get_clerk_user_id()`
   - Or use service role key for admin operations

2. **If you need to remove `tradingview_username` column**:
   ```sql
   ALTER TABLE users DROP COLUMN IF EXISTS tradingview_username;
   ```

3. **Verify the changes**:
   - Check that `get_clerk_user_id()` function is gone
   - Check that RLS policies are removed
   - Test your application to ensure it works

---

## Migration Applied

```sql
-- Drop RLS policies on users table
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- Drop RLS policies on subscriptions table
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON subscriptions;

-- Drop the get_clerk_user_id function
DROP FUNCTION IF EXISTS get_clerk_user_id();
```

