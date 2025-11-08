# Deployment Guide

This guide covers the complete deployment process for the Hunts Pip application to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Variables](#environment-variables)
3. [Clerk Webhook Configuration](#clerk-webhook-configuration)
4. [Supabase Configuration](#supabase-configuration)
5. [Vercel Deployment](#vercel-deployment)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Testing Procedures](#testing-procedures)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] All code changes committed to git
- [ ] Build passes locally (`npm run build`)
- [ ] All environment variables documented
- [ ] Clerk account with production application
- [ ] Supabase project configured
- [ ] Vercel account and project set up
- [ ] Database migrations applied to production
- [ ] Webhook endpoints configured

---

## Environment Variables

### Required Environment Variables

Set these in your Vercel project (**Settings → Environment Variables**):

#### Clerk Authentication
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_P61hc1f8ySUC2orTdTUkr/y0pB+adhue
```

#### Supabase
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Stripe (if using payments)
```env
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
```

#### Sanity CMS (if using)
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skxxxxxxxxxxxxx
SANITY_WEBHOOK_SECRET=your_webhook_secret_here
```

#### Application Configuration
```env
APP_BASE_URL=https://hunts-pip-test.vercel.app
NODE_ENV=production
```

### How to Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `hunts-pip-test`
3. Navigate to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add each variable:
   - **Key**: Environment variable name
   - **Value**: Your secret value
   - **Environment**: Select `Production`, `Preview`, and/or `Development` as needed
6. Click **Save**
7. **Important**: Redeploy your application after adding new environment variables

---

## Clerk Webhook Configuration

### Production Webhook Endpoint

**Production URL:** `https://hunts-pip-test.vercel.app/api/custom-webhook`

### Setup Steps

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your **production application**
3. Navigate to **Webhooks** in the left sidebar
4. Click on your existing webhook endpoint (or **+ Add Endpoint** to create new)
5. Configure the webhook:
   - **Endpoint URL**: `https://hunts-pip-test.vercel.app/api/custom-webhook`
   - **Events to listen to**:
     - ✅ `user.created` - When a new user signs up
     - ✅ `user.updated` - When user data is updated
     - ✅ `user.deleted` - When a user is deleted
6. **Important**: Verify the **Signing Secret** matches `CLERK_WEBHOOK_SECRET` in Vercel
7. Click **Save**

### Testing the Webhook

1. Create a test user in Clerk (production)
2. Check Vercel logs:
   - Go to **Deployments** → Latest deployment → **Functions** tab
   - Look for `/api/custom-webhook` requests
   - Verify status is `200 OK`
3. Check Supabase:
   - Verify user was created in `users` table
   - Verify subscription was created in `subscriptions` table

---

## Sanity CMS Webhook Configuration

### Production Webhook Endpoint

**Production URL:** `https://hunts-pip-test.vercel.app/api/revalidate/sanity`

### Setup Steps

1. Go to [Sanity Dashboard](https://www.sanity.io/manage)
2. Select your project
3. Navigate to **API** → **Webhooks** (or **Settings** → **Webhooks**)
4. Click **Create Webhook** (or **+ Add Webhook**)
5. Configure the webhook:
   - **Name**: `Next.js Revalidation`
   - **URL**: `https://hunts-pip-test.vercel.app/api/revalidate/sanity`
   - **Dataset**: `production` (or your production dataset)
   - **Trigger on**: Select `Create`, `Update`, and `Delete` events
   - **Filter**: `_type == "indicator"` (to only trigger on indicator changes)
   - **HTTP method**: `POST`
   - **API version**: `v2021-06-07` or later
6. **Optional**: Add a secret token for security:
   - Generate a secure random string (e.g., using `openssl rand -hex 32`)
   - Add it to the webhook configuration
   - Set the same value as `SANITY_WEBHOOK_SECRET` in Vercel environment variables
7. Click **Save**

### Testing the Webhook

1. Make a change to an indicator in Sanity Studio
2. Check Vercel logs:
   - Go to **Deployments** → Latest deployment → **Functions** tab
   - Look for `/api/revalidate/sanity` requests
   - Verify status is `200 OK`
3. Verify the change appears on your production site:
   - Visit `/library` page
   - Changes should appear within seconds (not waiting for the 5-minute revalidation)

### Troubleshooting Sanity Sync Issues

If Sanity content is not syncing properly in production:

1. **Check Environment Variables**:
   - Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is set correctly
   - Verify `NEXT_PUBLIC_SANITY_DATASET` matches your Sanity dataset
   - Verify `SANITY_API_TOKEN` has read permissions

2. **Check CDN Settings**:
   - The client is configured to disable CDN in production (`useCdn: false`)
   - This ensures fresh data is fetched directly from Sanity

3. **Check Revalidation**:
   - Pages revalidate every 5 minutes automatically
   - Webhook triggers immediate revalidation on content changes
   - Check webhook logs in Sanity dashboard

4. **Manual Revalidation**:
   - You can manually trigger revalidation by calling:
     ```bash
     curl -X POST https://hunts-pip-test.vercel.app/api/revalidate/sanity
     ```

---

## Supabase Configuration

### Database Migrations

Ensure all migrations are applied to production:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Run any pending migrations
5. Verify tables exist:
   - `users`
   - `subscriptions`
   - `tradingview_credentials`
   - `user_subscriptions` (if using)

### Verify Database Schema

Run these queries to verify your schema:

```sql
-- Check users table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users';

-- Check subscriptions table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'subscriptions';

-- Check tradingview_credentials table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'tradingview_credentials';
```

### Row Level Security (RLS)

Ensure RLS policies are configured:

1. Go to **Authentication** → **Policies**
2. Verify policies exist for:
   - `users` table
   - `subscriptions` table
   - `tradingview_credentials` table
3. Test that users can only access their own data

---

## Vercel Deployment

### First-Time Deployment

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New Project**
   - Import your GitHub repository
   - Configure project settings:
     - **Framework Preset**: Next.js
     - **Root Directory**: `./` (if not root)
     - **Build Command**: `npm run build` (default)
     - **Output Directory**: `.next` (default)

2. **Set Environment Variables** (see [Environment Variables](#environment-variables) section)

3. **Deploy**:
   - Click **Deploy**
   - Wait for build to complete
   - Verify deployment is successful

### Subsequent Deployments

Deployments happen automatically when you push to your main branch:

```bash
# Push to main branch triggers deployment
git push origin main
```

Or manually trigger deployment:

1. Go to **Deployments** tab in Vercel
2. Click **Redeploy** on latest deployment
3. Or use Vercel CLI:
   ```bash
   vercel --prod
   ```

### Build Configuration

Your `vercel.json` or `next.config.ts` should include:

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Custom Domain (Optional)

If you have a custom domain:

1. Go to **Settings** → **Domains**
2. Add your domain
3. Configure DNS records as instructed
4. Wait for SSL certificate to be issued

---

## Post-Deployment Verification

### 1. Check Deployment Status

- Go to **Deployments** tab
- Verify latest deployment shows ✅ **Ready**
- Check build logs for any errors

### 2. Verify Application is Live

- Visit: `https://hunts-pip-test.vercel.app`
- Verify homepage loads correctly
- Check all major pages:
  - `/` - Landing page
  - `/pricing` - Pricing page
  - `/library` - Library page
  - `/dashboard` - Dashboard (requires auth)
  - `/login` - Login page
  - `/signup` - Signup page

### 3. Test Authentication Flow

1. **Sign Up**:
   - Go to `/signup`
   - Create a new account
   - Verify redirect to dashboard

2. **Sign In**:
   - Go to `/login`
   - Sign in with test account
   - Verify redirect to dashboard

3. **Protected Routes**:
   - Verify `/dashboard` requires authentication
   - Verify redirect to `/login` if not authenticated

### 4. Verify Webhook Integration

1. **Create Test User**:
   - Create a new user in Clerk (production)
   - Check Vercel function logs for webhook request

2. **Check Supabase**:
   - Verify user appears in `users` table
   - Verify subscription created in `subscriptions` table

### 5. Check API Endpoints

Test your API routes:

```bash
# Test webhook endpoint (should return error without proper headers)
curl https://hunts-pip-test.vercel.app/api/custom-webhook

# Test health endpoint (if exists)
curl https://hunts-pip-test.vercel.app/api/health
```

---

## Testing Procedures

### Smoke Tests

Run these tests after deployment:

1. **Homepage Loads**
   - [ ] Visit `/`
   - [ ] Verify content loads
   - [ ] Check for console errors

2. **Authentication**
   - [ ] Sign up works
   - [ ] Sign in works
   - [ ] Sign out works
   - [ ] Protected routes redirect correctly

3. **Webhook Integration**
   - [ ] New user created in Clerk
   - [ ] User appears in Supabase
   - [ ] Subscription created automatically

4. **Database Operations**
   - [ ] Can read user data
   - [ ] Can update user data
   - [ ] Can create subscriptions
   - [ ] Can update TradingView username

### Load Testing (Optional)

For production applications:

1. Use tools like:
   - [k6](https://k6.io/)
   - [Artillery](https://www.artillery.io/)
   - [Locust](https://locust.io/)

2. Test critical endpoints:
   - `/api/custom-webhook`
   - `/api/user/tradingview`
   - `/dashboard`

---

## Troubleshooting

### Build Fails

**Issue**: Build fails in Vercel

**Solutions**:
1. Check build logs for specific errors
2. Verify all dependencies are in `package.json`
3. Check for TypeScript errors: `npm run build` locally
4. Verify environment variables are set
5. Check for missing files or imports

### Webhook Not Working

**Issue**: Webhook not receiving events

**Solutions**:
1. Verify webhook URL in Clerk Dashboard matches production URL
2. Check `CLERK_WEBHOOK_SECRET` matches Clerk's signing secret
3. Check Vercel function logs for errors
4. Verify Supabase service role key is correct
5. Test webhook manually with Clerk's test feature

### Database Connection Issues

**Issue**: Cannot connect to Supabase

**Solutions**:
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
3. Check Supabase project status
4. Verify IP allowlist (if configured)
5. Check RLS policies aren't blocking access

### Environment Variables Not Working

**Issue**: Environment variables not available

**Solutions**:
1. Verify variables are set in Vercel dashboard
2. Redeploy after adding new variables
3. Check variable names match exactly (case-sensitive)
4. Verify environment scope (Production/Preview/Development)
5. Restart Vercel functions if needed

### Slow Performance

**Issue**: Application is slow

**Solutions**:
1. Check Vercel analytics for slow endpoints
2. Optimize images and assets
3. Enable caching where appropriate
4. Check database query performance
5. Consider upgrading Vercel plan if needed

### Common Errors

#### "Error: Missing environment variable"
- **Solution**: Add missing variable to Vercel dashboard and redeploy

#### "Error: Webhook signature verification failed"
- **Solution**: Verify `CLERK_WEBHOOK_SECRET` matches Clerk Dashboard

#### "Error: Database connection failed"
- **Solution**: Verify Supabase credentials and check project status

#### "Error: 404 Not Found"
- **Solution**: Check route exists and build completed successfully

---

## Monitoring and Maintenance

### Set Up Monitoring

1. **Vercel Analytics**:
   - Enable in **Settings** → **Analytics**
   - Monitor performance and errors

2. **Log Monitoring**:
   - Check **Deployments** → **Functions** tab
   - Monitor webhook requests and errors

3. **Supabase Monitoring**:
   - Check **Logs** in Supabase Dashboard
   - Monitor database performance

### Regular Maintenance

- [ ] Monitor error logs weekly
- [ ] Check webhook delivery status
- [ ] Review database performance
- [ ] Update dependencies monthly
- [ ] Review and update environment variables
- [ ] Test authentication flow monthly
- [ ] Backup database regularly (Supabase handles this)

---

## Rollback Procedure

If deployment fails:

1. **Quick Rollback**:
   - Go to **Deployments** tab in Vercel
   - Find previous working deployment
   - Click **⋮** → **Promote to Production**

2. **Revert Code**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

3. **Check Previous Deployment**:
   - Compare with current deployment
   - Identify what changed
   - Fix issues before redeploying

---

## Security Checklist

Before going live:

- [ ] All secrets are in environment variables (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] RLS policies are configured in Supabase
- [ ] Webhook secrets are secure
- [ ] API keys are production keys (not test keys)
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled (if applicable)
- [ ] HTTPS is enforced (Vercel does this automatically)

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Clerk Docs**: https://clerk.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## Quick Reference

### Production URLs

- **Application**: `https://hunts-pip-test.vercel.app`
- **Webhook Endpoint**: `https://hunts-pip-test.vercel.app/api/custom-webhook`
- **Dashboard**: `https://hunts-pip-test.vercel.app/dashboard`

### Important Dashboards

- **Vercel**: https://vercel.com/dashboard
- **Clerk**: https://dashboard.clerk.com
- **Supabase**: https://supabase.com/dashboard

### Quick Commands

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Test build locally
npm run build
```

---

## Deployment Checklist Summary

Before deploying:

- [ ] Code committed and pushed
- [ ] Build passes locally
- [ ] Environment variables set in Vercel
- [ ] Clerk webhook configured
- [ ] Supabase migrations applied
- [ ] Database schema verified
- [ ] Security checklist completed

After deploying:

- [ ] Deployment successful
- [ ] Application loads correctly
- [ ] Authentication works
- [ ] Webhook receives events
- [ ] Database operations work
- [ ] No errors in logs

---

**Last Updated**: November 2025  
**Version**: 1.0

