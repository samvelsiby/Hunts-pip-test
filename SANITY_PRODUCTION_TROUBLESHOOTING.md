# Sanity Production Sync Troubleshooting Guide

## Issue: Sanity works locally but not in production

This guide helps diagnose and fix Sanity sync issues in production.

## Quick Diagnosis

### Step 1: Check the Diagnostic Endpoint

After deploying, visit:
```
https://your-domain.com/api/debug/sanity
```

This will show:
- ✅ If environment variables are set correctly
- ✅ If Sanity connection is working
- ✅ Sample data from your queries
- ❌ Detailed error messages if something is wrong

### Step 2: Check Vercel Logs

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Deployments** → Latest deployment
4. Click **Functions** tab
5. Look for errors when visiting `/library` page
6. Check for messages like:
   - `⚠️  Sanity: NEXT_PUBLIC_SANITY_PROJECT_ID is not set!`
   - `❌ Error fetching indicators from Sanity`

## Common Issues & Solutions

### Issue 1: Missing Environment Variables

**Symptoms:**
- Diagnostic endpoint shows `projectId: ❌ NOT SET`
- Logs show: `⚠️  Sanity: NEXT_PUBLIC_SANITY_PROJECT_ID is not set!`
- Empty array returned from queries

**Solution:**
1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Verify these are set for **Production** environment:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_token_here
   ```
3. **Important**: After adding/updating environment variables, you MUST redeploy:
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger redeploy

### Issue 2: Wrong Project ID or Dataset

**Symptoms:**
- Diagnostic endpoint shows project ID is set
- But queries return empty results
- Works locally with different values

**Solution:**
1. Check your local `.env.local` file:
   ```bash
   cat .env.local | grep SANITY
   ```
2. Compare with Vercel environment variables
3. Make sure production uses the same project ID and dataset
4. Verify in Sanity Dashboard:
   - Go to [sanity.io/manage](https://www.sanity.io/manage)
   - Check your project ID matches
   - Check your dataset name matches

### Issue 3: API Token Missing or Invalid

**Symptoms:**
- Queries fail with authentication errors
- Diagnostic endpoint shows `hasToken: false`

**Solution:**
1. Generate a new API token in Sanity:
   - Go to [sanity.io/manage](https://www.sanity.io/manage)
   - Select your project
   - Go to **API** → **Tokens**
   - Click **Add API token**
   - Name it: `Production Read Token`
   - Select **Read** permissions
   - Copy the token
2. Add to Vercel:
   - Go to Vercel → Settings → Environment Variables
   - Add `SANITY_API_TOKEN` with the token value
   - Make sure it's set for **Production**
3. Redeploy your application

### Issue 4: CORS or Network Issues

**Symptoms:**
- Network errors in logs
- Timeout errors
- Works locally but fails in production

**Solution:**
1. Check Vercel function logs for network errors
2. Verify Sanity project allows requests from your domain
3. Check if there are any firewall rules blocking Sanity API

### Issue 5: CDN Caching Issues

**Symptoms:**
- Old data appears even after updates
- Changes don't reflect immediately

**Solution:**
- The client is configured with `useCdn: true` which caches responses
- If you need fresh data immediately, you can:
  1. Temporarily disable CDN (change `useCdn: false` in `src/lib/sanity.ts`)
  2. Or wait for the cache to expire (usually a few minutes)

## Verification Checklist

After fixing the issue, verify:

- [ ] Diagnostic endpoint (`/api/debug/sanity`) returns success
- [ ] `/library` page shows indicators
- [ ] Individual indicator pages (`/library/[slug]`) work
- [ ] Vercel logs show no Sanity errors
- [ ] Environment variables are set for Production environment
- [ ] Application has been redeployed after env var changes

## Testing Locally vs Production

To test if your production config matches local:

1. **Check local environment:**
   ```bash
   # In your project root
   cat .env.local | grep SANITY
   ```

2. **Check production environment:**
   - Visit: `https://your-domain.com/api/debug/sanity`
   - Compare the config section with your local values

3. **If they differ:**
   - Update Vercel environment variables to match local
   - Redeploy the application

## Getting Help

If the issue persists:

1. Check the diagnostic endpoint output
2. Check Vercel function logs
3. Verify Sanity project is accessible:
   - Visit Sanity Studio: `https://your-project.sanity.studio`
   - Verify data exists in the dataset
4. Compare local vs production environment variables

## Recent Changes Made

The following improvements were added to help diagnose issues:

1. ✅ **Environment variable validation** - Warns if project ID is missing
2. ✅ **Enhanced error logging** - More detailed errors in production
3. ✅ **Diagnostic endpoint** - `/api/debug/sanity` to test connection
4. ✅ **Configuration logging** - Logs config status in production

These changes will help identify the exact issue preventing Sanity from syncing in production.

