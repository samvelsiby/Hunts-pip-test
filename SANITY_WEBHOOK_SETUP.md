# Sanity Webhook Setup for Automatic Revalidation

This guide will help you set up a Sanity webhook so that your production site automatically updates when you make changes in Sanity Studio, without needing to redeploy.

## How It Works

1. You make changes in Sanity Studio
2. Sanity sends a webhook to your Next.js app
3. Your app automatically revalidates the cached pages
4. Changes appear on your site within seconds

## Setup Steps

### Step 1: Get Your Production URL

Your webhook endpoint will be:
```
https://your-domain.com/api/revalidate/sanity
```

Replace `your-domain.com` with your actual production domain (e.g., `hunts-pip-test.vercel.app`)

### Step 2: Configure Webhook in Sanity

1. Go to [Sanity Dashboard](https://www.sanity.io/manage)
2. Select your project
3. Navigate to **API** → **Webhooks** (or **Settings** → **Webhooks**)
4. Click **Create Webhook** (or **+ Add Webhook**)
5. Configure the webhook:
   - **Name**: `Next.js Revalidation`
   - **URL**: `https://your-domain.com/api/revalidate/sanity`
   - **Dataset**: `production` (or your production dataset name)
   - **Trigger on**: 
     - ✅ `Create` - When new documents are created
     - ✅ `Update` - When documents are updated
     - ✅ `Delete` - When documents are deleted
   - **Filter**: `_type == "indicator"` (to only trigger on indicator changes)
   - **HTTP method**: `POST`
   - **API version**: `v2021-06-07` or later
6. Click **Save**

### Step 3: (Optional) Add Webhook Secret for Security

For added security, you can add a secret token:

1. Generate a secure random string:
   ```bash
   openssl rand -hex 32
   ```
   Or use any secure random string generator

2. Add it to your Vercel environment variables:
   - Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
   - Add: `SANITY_WEBHOOK_SECRET` = `your_generated_secret`
   - Make sure it's set for **Production**
   - **Important**: Redeploy after adding the variable

3. Add the same secret to your Sanity webhook:
   - Go back to Sanity Dashboard → Webhooks
   - Edit your webhook
   - Add the secret in the **Secret** field
   - The webhook will send it as: `Authorization: Bearer your_secret`

### Step 4: Test the Webhook

1. Make a small change to an indicator in Sanity Studio
2. Check Vercel logs:
   - Go to **Deployments** → Latest → **Functions** tab
   - Look for `/api/revalidate/sanity` requests
   - Should see: `✅ Revalidated library listing and indicator`
3. Visit your production site:
   - Go to `/library` page
   - Changes should appear within seconds

## Testing the Endpoint

You can test the endpoint manually:

```bash
# Test GET (should return status info)
curl https://your-domain.com/api/revalidate/sanity

# Test POST (simulate webhook)
curl -X POST https://your-domain.com/api/revalidate/sanity \
  -H "Content-Type: application/json" \
  -d '{"_type": "indicator", "_id": "test-id", "slug": {"current": "test-slug"}}'
```

## Troubleshooting

### Webhook Not Triggering

1. **Check Sanity Webhook Logs**:
   - Go to Sanity Dashboard → Webhooks
   - Click on your webhook
   - Check the **Delivery** tab for failed requests

2. **Check Vercel Logs**:
   - Look for errors in the Functions tab
   - Check if the endpoint is receiving requests

3. **Verify URL**:
   - Make sure the webhook URL is correct
   - Should be: `https://your-domain.com/api/revalidate/sanity`
   - Must use HTTPS

### Changes Not Appearing

1. **Check Cache Tags**:
   - The queries use cache tags: `indicators`, `sanity-content`, `indicator-{slug}`
   - Make sure the webhook is revalidating these tags

2. **Check Revalidation**:
   - Look for logs: `✅ Revalidated library listing and indicator`
   - If you don't see this, the webhook might not be working

3. **Manual Revalidation**:
   - You can manually trigger revalidation:
   ```bash
   curl -X POST https://your-domain.com/api/revalidate/sanity
   ```

### 401 Unauthorized Error

If you see `401 Unauthorized`:
- Make sure `SANITY_WEBHOOK_SECRET` is set in Vercel
- Make sure the same secret is configured in Sanity webhook
- The webhook sends: `Authorization: Bearer your_secret`

## What Gets Revalidated

When an indicator is created, updated, or deleted:

1. ✅ `/library` page (listing page)
2. ✅ `/library/{slug}` page (specific indicator page, if slug exists)
3. ✅ All cache tags: `indicators`, `sanity-content`, `indicator-{slug}`

## Benefits

- ✅ **No redeployment needed** - Changes appear automatically
- ✅ **Fast updates** - Changes appear within seconds
- ✅ **Selective revalidation** - Only affected pages are revalidated
- ✅ **Fallback caching** - Pages still cache for 1 hour if webhook fails

## Next Steps

After setting up the webhook:

1. Make a test change in Sanity Studio
2. Verify it appears on your production site
3. Check Vercel logs to confirm webhook is working
4. You're all set! 🎉

