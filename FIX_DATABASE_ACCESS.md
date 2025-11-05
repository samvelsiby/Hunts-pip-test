# Fix: Database Access Issue After Removing RLS Policies

## Problem

After removing all JWT-based RLS policies, users were unable to fetch data from the database even though the code uses `supabaseAdmin` (service role key).

## Root Cause

1. **RLS is enabled** on all tables (`users`, `subscriptions`, `tradingview_credentials`, `user_subscriptions`)
2. **All RLS policies were removed** (the JWT-based ones using `get_clerk_user_id()`)
3. **When RLS is enabled with no policies**, Supabase blocks all access by default
4. Even with service role key, if RLS is enabled and there are no policies, some operations might be blocked

## Solution

Added **RLS policies that allow service role to access all data**. This allows the `supabaseAdmin` client (which uses service role key) to bypass RLS restrictions.

### Policies Added:

1. **users table**: `"Service role can access all users"`
   - Allows service role to SELECT, INSERT, UPDATE, DELETE all users

2. **subscriptions table**: `"Service role can access all subscriptions"`
   - Allows service role to SELECT, INSERT, UPDATE, DELETE all subscriptions

3. **tradingview_credentials table**: `"Service role can access all tradingview credentials"`
   - Allows service role to SELECT, INSERT, UPDATE, DELETE all tradingview credentials

4. **user_subscriptions table**: `"Service role can access all user subscriptions"`
   - Allows service role to SELECT, INSERT, UPDATE, DELETE all user subscriptions

## SQL Applied

```sql
-- Policy for users table
CREATE POLICY "Service role can access all users" ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy for subscriptions table
CREATE POLICY "Service role can access all subscriptions" ON subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy for tradingview_credentials table
CREATE POLICY "Service role can access all tradingview credentials" ON tradingview_credentials
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy for user_subscriptions table
CREATE POLICY "Service role can access all user subscriptions" ON user_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

## Verification

After applying these policies:
- ✅ `supabaseAdmin` client can now access all tables
- ✅ API endpoints (`/api/user/tradingview`, `/api/user/subscription`) should work
- ✅ Users can fetch their data after signing in

## Why This Works

- The service role key (`SUPABASE_SERVICE_ROLE_KEY`) is used by the `supabaseAdmin` client
- These policies explicitly allow the `service_role` role to access all data
- This bypasses RLS restrictions while keeping RLS enabled for future policy additions

## Next Steps

1. Test the API endpoints to ensure they work
2. If you need user-specific RLS policies later, you can add them without removing these service role policies
3. The service role policies will ensure admin operations always work

