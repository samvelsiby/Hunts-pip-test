# Data Access Layer Implementation

## Overview

This document describes the data access layer implementation that protects user data using Row Level Security (RLS) policies in Supabase.

## Architecture

### 1. Authentication Flow

1. **User signs in** with Clerk authentication
2. **API routes** get the Clerk `userId` from `auth()` 
3. **Authenticated Supabase client** is created with Clerk user ID in custom header
4. **RLS policies** use the header to identify the authenticated user
5. **Database queries** are automatically filtered by RLS policies

### 2. Components

#### Supabase Client (`src/lib/supabase-authenticated.ts`)

- **Purpose**: Creates authenticated Supabase client with RLS support
- **Key Feature**: Sets Clerk user ID in `x-clerk-user-id` header
- **Usage**: Used in API routes for user-facing queries

#### Database Function (`get_clerk_user_id_from_header()`)

- **Purpose**: Extracts Clerk user ID from request headers for RLS policies
- **Location**: Supabase database (PostgreSQL function)
- **Usage**: Used by all RLS policies to identify the authenticated user

#### RLS Policies

Policies are created for each table to ensure users can only access their own data:

1. **users table**: Users can view/update their own data
2. **subscriptions table**: Users can only access subscriptions linked to their user_id
3. **tradingview_credentials table**: Users can only access their own credentials
4. **user_subscriptions table**: Users can only access their own subscriptions

## Security Model

### Service Role vs. Authenticated Client

1. **Service Role (`supabaseAdmin`)**: 
   - Bypasses RLS completely
   - Used for: Webhooks, admin operations, user creation
   - **Security**: Protected by service role key (server-side only)

2. **Authenticated Client (`getAuthenticatedSupabaseClient()`)**:
   - Respects RLS policies
   - Used for: User-facing API operations
   - **Security**: Protected by RLS policies

### RLS Policies

All RLS policies use the `get_clerk_user_id_from_header()` function to:
1. Extract Clerk user ID from request headers
2. Compare it with the `clerk_id` column in the database
3. Allow access only if they match

## Implementation Details

### Database Function

```sql
CREATE OR REPLACE FUNCTION get_clerk_user_id_from_header()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN current_setting('request.headers', true)::json->>'x-clerk-user-id';
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;
```

### RLS Policy Example (users table)

```sql
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT
  TO authenticated, anon
  USING (clerk_id = get_clerk_user_id_from_header());
```

### API Route Example

```typescript
// Get authenticated client with RLS protection
const supabase = await getAuthenticatedSupabaseClient();

// Query will automatically be filtered by RLS policy
const { data: user } = await supabase
  .from('users')
  .select('tradingview_username')
  .eq('clerk_id', userId)
  .single();
```

## Tables and Policies

### 1. users table
- **SELECT**: Users can view their own data (`clerk_id` match)
- **UPDATE**: Users can update their own data (`clerk_id` match)
- **Service Role**: Can access all users (for webhooks/admin)

### 2. subscriptions table
- **SELECT**: Users can view subscriptions for their own `user_id`
- **INSERT**: Users can create subscriptions for their own `user_id`
- **UPDATE**: Users can update subscriptions for their own `user_id`
- **DELETE**: Users can delete subscriptions for their own `user_id`
- **Service Role**: Can access all subscriptions

### 3. tradingview_credentials table
- **SELECT**: Users can view credentials for their own `user_id`
- **INSERT**: Users can create credentials for their own `user_id`
- **UPDATE**: Users can update credentials for their own `user_id`
- **DELETE**: Users can delete credentials for their own `user_id`
- **Service Role**: Can access all credentials

### 4. user_subscriptions table
- **SELECT**: Users can view their own subscriptions (`user_id` = Clerk ID)
- **INSERT**: Users can create their own subscriptions
- **UPDATE**: Users can update their own subscriptions
- **DELETE**: Users can delete their own subscriptions
- **Service Role**: Can access all user subscriptions

## Security Benefits

1. **Automatic Access Control**: RLS policies automatically filter queries
2. **Defense in Depth**: Multiple layers of security (Clerk auth + RLS)
3. **No Direct DB Access**: Users cannot access database directly
4. **Service Role Protection**: Admin operations use service role key (server-side only)

## Testing

### Test RLS Policies

1. **Sign in** as a user
2. **Access API endpoints** (`/api/user/tradingview`, `/api/user/subscription`)
3. **Verify** that:
   - User can access their own data ✅
   - User cannot access other users' data ✅
   - Service role can access all data (for webhooks) ✅

### Test Scenarios

1. **Normal User Access**:
   - User A can view their own data ✅
   - User A cannot view User B's data ✅

2. **Admin Operations**:
   - Webhook can create users (service role) ✅
   - Admin can access all data (service role) ✅

3. **Unauthenticated Access**:
   - Unauthenticated requests are blocked ✅
   - API returns 401 Unauthorized ✅

## Migration Notes

### Before This Implementation

- All queries used `supabaseAdmin` (service role)
- No RLS protection for user data
- Application-level access control only

### After This Implementation

- User-facing queries use authenticated client with RLS
- Database-level access control enforced
- Service role still used for admin operations (webhooks)

## Maintenance

### Adding New Tables

1. Create RLS policies for the new table
2. Use `get_clerk_user_id_from_header()` function
3. Add service role policy for admin access
4. Update API routes to use authenticated client

### Modifying Policies

1. Policies are in Supabase database
2. Use Supabase SQL Editor to modify
3. Test thoroughly before deploying

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Clerk Authentication](https://clerk.com/docs)
- Database policies: See `get_clerk_user_id_from_header()` function

