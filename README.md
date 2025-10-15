# MUNTS PIP - TradingView Indicators SaaS

A complete TradingView Indicators SaaS application built with Next.js, featuring subscription management, user authentication, and TradingView integration.

## 🚀 Features

### ✨ Core Features
- **Dark Theme Landing Page** with MUNTS PIP branding
- **Three-Tier Subscription System** (Free, Pro $30/month, Premium $50/month)
- **User Authentication** with Clerk
- **TradingView Username Collection** workflow
- **Supabase Database** integration
- **Stripe Payment** integration (ready for production)
- **Responsive Design** with Tailwind CSS

### 🔄 User Workflow
1. **Landing Page** → User sees pricing and hero section
2. **Sign Up/Sign In** → Clerk authentication
3. **Select Plan** → Choose subscription tier
4. **TradingView Credentials** → Enter TradingView username
5. **Payment** → Complete subscription
6. **Dashboard** → Access trading indicators

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/create-checkout-session/    # Stripe checkout API
│   ├── dashboard/                       # User dashboard
│   ├── payment/                        # Payment page
│   ├── pricing/                        # Pricing page
│   ├── tradingview-credentials/        # TradingView username input
│   └── sign-in/sign-up/               # Clerk auth pages
├── components/
│   ├── PricingComponent.tsx           # Subscription plans
│   ├── TradingViewCredentialsComponent.tsx
│   └── KeywordInputComponent.tsx
├── lib/
│   └── supabase.ts                     # Supabase client
└── middleware.ts                       # Route protection
```

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/samvelsiby/Hunts-pip-test.git
cd Hunts-pip-test
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create `.env.local` file:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable

# App Configuration
APP_BASE_URL=http://localhost:3000
```

### 4. Database Setup
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Run the SQL from `supabase-setup.sql` in the SQL Editor
3. This creates the `user_subscriptions` table with proper policies

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application!

## 🗄️ Database Schema

### user_subscriptions Table
```sql
CREATE TABLE user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,                    -- Clerk user ID
  plan_id TEXT NOT NULL,                    -- 'free', 'pro', 'premium'
  status TEXT NOT NULL DEFAULT 'active',    -- 'active', 'canceled', etc.
  keyword TEXT,                             -- Trading keyword (BTC, ETH, etc.)
  tradingview_username TEXT,                -- TradingView username
  stripe_customer_id TEXT,                  -- Stripe customer ID
  stripe_subscription_id TEXT,              -- Stripe subscription ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Configuration

### Clerk Setup
1. Create account at [clerk.com](https://clerk.com)
2. Create new application
3. Copy publishable and secret keys to `.env.local`
4. Configure redirect URLs in Clerk dashboard

### Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase-setup.sql` in SQL Editor
3. Copy project URL and anon key to `.env.local`

### Stripe Setup
1. Create account at [stripe.com](https://stripe.com)
2. Create products and prices for Pro ($30) and Premium ($50) plans
3. Update price IDs in `src/app/api/create-checkout-session/route.ts`
4. Copy keys to `.env.local`

## 🎯 User Flow

### New User Journey
1. **Landing Page** → See pricing and features
2. **Sign Up** → Create account with Clerk
3. **Select Plan** → Choose Free, Pro, or Premium
4. **TradingView Username** → Enter TradingView credentials
5. **Payment** → Complete subscription (Free activates immediately)
6. **Dashboard** → Access trading indicators

### Returning User Journey
1. **Sign In** → Authenticate with Clerk
2. **Select Plan** → Choose new subscription
3. **Confirm Username** → Use existing TradingView username
4. **Payment** → Complete subscription

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 📊 Features Overview

### ✅ Implemented
- [x] Landing page with MUNTS PIP branding
- [x] Three-tier subscription system
- [x] Clerk authentication
- [x] Supabase database integration
- [x] TradingView username collection
- [x] Payment page (dummy + Stripe ready)
- [x] Responsive design
- [x] Route protection middleware

### 🔄 Ready for Production
- [ ] Stripe webhook handling
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] TradingView API integration
- [ ] Analytics tracking

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@munts-pip.com or create an issue in this repository.

---

**Built with ❤️ using Next.js, Clerk, Supabase, and Stripe**