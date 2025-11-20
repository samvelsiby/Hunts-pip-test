# 🚀 Quick Deployment Steps for Stripe Live Mode

## ⚡ Fast Track (5 Minutes)

### 1️⃣ Update Environment Variables in Vercel

Go to: [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Add/Update these 3 critical variables:

```
STRIPE_SECRET_KEY = sk_live_YOUR_SECRET_KEY_HERE

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_YOUR_PUBLISHABLE_KEY_HERE

STRIPE_WEBHOOK_SECRET = whsec_YOUR_WEBHOOK_SECRET_HERE
```

**Note:** Get your actual keys from Stripe Dashboard → Developers → API keys (Live Mode)

### 2️⃣ Commit & Push Code Changes

```bash
git add .
git commit -m "Switch Stripe to live mode with production keys"
git push origin main
```

This will auto-deploy to Vercel.

### 3️⃣ Create Stripe Webhook (CRITICAL!)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks) (Live Mode)
2. Click **"Add endpoint"**
3. Enter: `https://huntspip.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. **Copy the Signing Secret** (starts with `whsec_`)
7. Go back to Vercel → Environment Variables
8. Add: `STRIPE_WEBHOOK_SECRET = whsec_YOUR_SECRET_HERE`
9. **Redeploy** in Vercel

### 4️⃣ Test Everything

```bash
# Test a Premium Monthly subscription
# Use test card: 4242 4242 4242 4242

# Check webhook is working:
# Stripe Dashboard → Webhooks → Your endpoint → Check for successful events
```

## ✅ Verification Checklist

- [ ] Environment variables updated in Vercel
- [ ] Code pushed to main branch
- [ ] Vercel deployment successful
- [ ] Webhook endpoint created in Stripe
- [ ] Webhook secret added to Vercel
- [ ] Redeployed after adding webhook secret
- [ ] Test subscription completed successfully
- [ ] Webhook received events (check Stripe Dashboard)
- [ ] User subscription created in Supabase
- [ ] User can access dashboard after payment

## 🆘 Troubleshooting

### Webhook signature verification failed
- Check `STRIPE_WEBHOOK_SECRET` in Vercel matches Stripe Dashboard
- Make sure you redeployed after adding the webhook secret

### Payment succeeds but subscription not created
- Check Supabase connection
- Check webhook events in Stripe Dashboard
- Look for errors in Vercel logs

### Can't find webhook secret
- Stripe Dashboard → Developers → Webhooks
- Click on your endpoint
- Click "Reveal" next to Signing secret

## 📞 Need Help?

Check detailed guide: `STRIPE_LIVE_MODE_SETUP.md`

---

**You're ready to accept real payments! 💰**
