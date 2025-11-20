# Stripe Live Mode Configuration

## ✅ Updated Files
- `/src/config/stripe-prices.ts` - Updated with live Price IDs

## 🔑 Environment Variables to Update

Add these to your deployment platform (Vercel, etc.):

```bash
# Stripe Live API Keys
# Get these from Stripe Dashboard → Developers → API keys (Live Mode)
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE

# Stripe Webhook Secret (get this after creating webhook endpoint)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Optional: Live Price IDs (already set as fallbacks in code)
STRIPE_PRICE_PREMIUM_MONTHLY=price_1SRHOxQKnoBObMWtOHxepKH5
STRIPE_PRICE_PREMIUM_YEARLY=price_1SRHOxQKnoBObMWtrCx6RP8D
STRIPE_PRICE_ULTIMATE_MONTHLY=price_1SRHQXQKnoBObMWthlvEkITP
STRIPE_PRICE_ULTIMATE_YEARLY=price_1SRHQXQKnoBObMWt2dPQfFsW
```

## 🪝 Webhook Setup (CRITICAL)

### Step 1: Create Webhook Endpoint in Stripe
1. Go to [Stripe Dashboard](https://dashboard.stripe.com) (LIVE MODE)
2. Navigate to **Developers → Webhooks**
3. Click **"Add endpoint"**
4. Enter URL: `https://huntspip.com/api/webhooks/stripe`
5. Select these events:
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.async_payment_succeeded`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
6. Click **"Add endpoint"**
7. Copy the **Signing secret** (starts with `whsec_`)
8. Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

### Step 2: Test Webhook
After deploying with live keys:
```bash
# Test webhook endpoint is accessible
curl https://huntspip.com/api/webhooks/stripe
# Should return: {"error":"Method Not Allowed","message":"This endpoint only accepts POST requests from Stripe webhooks"}
```

## 📋 Deployment Checklist

### If Using Vercel:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add/Update these variables:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET` (after creating webhook)
5. **Redeploy** your application

### If Using Other Platforms:
Update environment variables in your hosting platform's settings and redeploy.

## 🧪 Testing Live Mode

### Test Card Numbers (DO NOT USE IN PRODUCTION)
Stripe provides test cards even in live mode for testing:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future expiry date and any 3-digit CVC

### Testing Checklist:
1. ✅ Test Premium Monthly subscription
2. ✅ Test Premium Yearly subscription
3. ✅ Test Ultimate Monthly subscription
4. ✅ Test Ultimate Yearly subscription
5. ✅ Verify webhook receives events (check Stripe Dashboard → Webhooks)
6. ✅ Verify Supabase `user_subscriptions` table is updated
7. ✅ Verify user can access dashboard after payment
8. ✅ Test subscription cancellation
9. ✅ Test failed payment handling

## 🔍 Monitoring

### Check Webhook Events:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. View recent events and their status
4. Check for any failed events

### Check Application Logs:
Monitor your application logs for:
- `✅ Checkout session created`
- `✅ Webhook signature verified`
- `✅ Payment completed`
- `✅ Subscription updated successfully`

### Common Issues:
- **Webhook signature verification failed**: Check `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- **Price ID not found**: Verify Price IDs in Stripe Dashboard match your configuration
- **Subscription not created**: Check Supabase connection and table permissions

## 📊 Live Price Configuration

| Plan | Frequency | Price ID | Amount |
|------|-----------|----------|--------|
| Premium | Monthly | `price_1SRHOxQKnoBObMWtOHxepKH5` | $30/month |
| Premium | Yearly | `price_1SRHOxQKnoBObMWtrCx6RP8D` | $25/month (billed yearly) |
| Ultimate | Monthly | `price_1SRHQXQKnoBObMWthlvEkITP` | $50/month |
| Ultimate | Yearly | `price_1SRHQXQKnoBObMWt2dPQfFsW` | $42/month (billed yearly) |

## ⚠️ Important Security Notes

1. **Never commit API keys to Git**
   - Keys are in environment variables only
   - `.env.local` is gitignored
   
2. **Webhook Secret is Critical**
   - Prevents unauthorized webhook calls
   - Must match exactly between Stripe and your app
   
3. **Monitor First Transactions**
   - Watch the first few live transactions closely
   - Check logs for any errors
   - Verify customer data is stored correctly

4. **Stripe Account Verification**
   - Ensure your Stripe account is fully verified
   - Complete business verification if required
   - Set up bank account for payouts

## 🚀 Go Live Steps

1. ✅ Update Price IDs in code (DONE)
2. ⏳ Update environment variables in deployment platform
3. ⏳ Create webhook endpoint in Stripe Dashboard
4. ⏳ Add webhook secret to environment variables
5. ⏳ Redeploy application
6. ⏳ Test with Stripe test cards
7. ⏳ Monitor first real transactions
8. ✅ You're live!

## 📞 Support

If you encounter issues:
1. Check Stripe Dashboard → Developers → Logs
2. Check your application logs
3. Verify all environment variables are set correctly
4. Test webhook endpoint is accessible
5. Contact Stripe Support if needed

---

**Last Updated**: November 19, 2025
**Status**: Ready for deployment
