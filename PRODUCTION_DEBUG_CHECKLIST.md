# Production Debug Checklist

## Issue: TradingView Username Not Retrieving in Production

### What to Check

1. **Environment Variables in Vercel**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Verify these are set for **Production**:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `CLERK_SECRET_KEY`
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

2. **Check Vercel Logs**
   - Go to Vercel Dashboard → Your Project → Logs
   - Look for these log messages:
     - `GET /api/user/tradingview: userId from auth():`
     - `GET /api/user/tradingview: Environment check:`
     - `getTradingViewUsername: Query result:`
     - `GET /api/user/tradingview: Result from data access layer:`

3. **Common Issues**

   **Issue 1: Missing Environment Variables**
   - **Symptom**: Logs show `hasServiceKey: 'Missing'` or `hasSupabaseUrl: 'Missing'`
   - **Fix**: Add missing environment variables in Vercel
   - **Action**: Redeploy after adding variables

   **Issue 2: No userId from auth()**
   - **Symptom**: Logs show `userId: null` or `No userId from auth()`
   - **Possible Causes**:
     - Clerk secret key not set
     - Session cookies not being sent
     - Clerk middleware not working in production
   - **Fix**: 
     - Verify `CLERK_SECRET_KEY` is set in Vercel
     - Check Clerk domain settings
     - Verify cookies are being sent (check browser network tab)

   **Issue 3: Database Query Failing**
   - **Symptom**: Logs show `hasError: true` with error code
   - **Possible Causes**:
     - Supabase service role key incorrect
     - Network issues
     - RLS policies blocking access
   - **Fix**:
     - Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
     - Check Supabase logs for errors
     - Verify service role key has access

   **Issue 4: User Not Found**
   - **Symptom**: Logs show `hasData: false` or `User does not exist yet (PGRST116)`
   - **Possible Causes**:
     - User not synced from Clerk webhook
     - Different `clerk_id` in database
   - **Fix**:
     - Check if user exists in Supabase `users` table
     - Verify `clerk_id` matches the userId from Clerk
     - Check webhook logs to see if user was created

## Debugging Steps

### Step 1: Check Logs
After deployment, check Vercel logs for:
```
GET /api/user/tradingview: userId from auth(): [userId or null]
GET /api/user/tradingview: Environment check: { ... }
getTradingViewUsername: Query result: { ... }
```

### Step 2: Verify Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `CLERK_SECRET_KEY`
- ✅ `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

### Step 3: Test Database Connection
Check if Supabase is accessible:
- Verify Supabase dashboard shows the project is active
- Check Supabase logs for any errors
- Verify service role key is correct

### Step 4: Test Clerk Session
Check if Clerk authentication is working:
- Verify user is signed in
- Check browser console for Clerk errors
- Verify Clerk session cookie is being sent

## Next Steps

1. **Deploy the updated code** (already pushed)
2. **Check Vercel logs** after deployment
3. **Share the logs** with me so I can identify the exact issue
4. **Test the endpoint** in production

The logs will show exactly what's happening at each step!

