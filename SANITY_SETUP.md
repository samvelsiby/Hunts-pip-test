# Sanity CMS Setup Guide for MUNTS PIP

This guide will help you set up Sanity CMS for managing your trading indicators library.

## 🚀 Quick Start

### 1. Create a Sanity Account

1. Go to [sanity.io](https://www.sanity.io/)
2. Sign up for a free account
3. Create a new project

### 2. Get Your Project Credentials

After creating your project, you'll need:
- **Project ID**: Found in your project settings
- **Dataset**: Usually `production` (default)

### 3. Add Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

### 4. Initialize Sanity Studio

Run the following command to start Sanity Studio:

```bash
npm run sanity
```

This will start Sanity Studio at `http://localhost:3333`

### 5. Deploy Sanity Studio (Optional)

To deploy your Sanity Studio to the cloud:

```bash
npx sanity deploy
```

Choose a unique studio hostname (e.g., `munts-pip-studio`)

## 📝 Creating Indicators

### Indicator Schema Fields

When creating an indicator in Sanity Studio, you'll fill out:

1. **Title** (required): Name of the indicator
   - Example: "RSI Momentum Indicator"

2. **Slug** (required): URL-friendly identifier
   - Auto-generated from title
   - Example: "rsi-momentum-indicator"

3. **Description** (required): Brief description
   - Example: "Advanced RSI indicator with custom momentum signals"

4. **Category** (required): Choose from:
   - Trend
   - Momentum
   - Volatility
   - Volume
   - Custom

5. **Icon** (optional): Upload an image for the indicator

6. **Features** (optional): List of key features
   - Example: ["Real-time signals", "Custom alerts", "Multi-timeframe"]

7. **Plan Access** (required): Choose from:
   - Free
   - Pro
   - Premium

8. **TradingView Link** (optional): URL to the indicator on TradingView

9. **Documentation** (optional): Rich text documentation

10. **Is Active** (default: true): Show/hide indicator

11. **Display Order** (optional): Number to control display order

### Example Indicator

Here's an example indicator you can create:

**Title**: RSI Momentum Pro
**Category**: Momentum
**Description**: Advanced RSI indicator with momentum signals and custom alerts for professional traders
**Plan Access**: Pro
**Features**:
- Real-time momentum signals
- Custom alert system
- Multi-timeframe analysis
- Overbought/oversold zones
**Display Order**: 1

## 🎨 Customizing the Schema

The indicator schema is located at:
```
/sanity/schemas/indicator.ts
```

You can modify this file to add or remove fields as needed.

## 🔧 Sanity Configuration Files

### Main Configuration
- `sanity.config.ts` - Main Sanity configuration
- `sanity.cli.ts` - CLI configuration

### Schema Files
- `sanity/schemas/indicator.ts` - Indicator document schema
- `sanity/schemas/index.ts` - Schema exports

### Client Configuration
- `src/lib/sanity.ts` - Sanity client and queries

## 📊 Querying Indicators

The app uses these queries:

### Get All Active Indicators
```javascript
const indicators = await client.fetch(indicatorsQuery)
```

### Get Single Indicator by Slug
```javascript
const indicator = await client.fetch(indicatorBySlugQuery, { slug: 'your-slug' })
```

## 🌐 Accessing Your Data

### In Development
- Next.js App: `http://localhost:3000/library`
- Sanity Studio: `http://localhost:3333`

### In Production
- Deploy your Next.js app to Vercel
- Deploy Sanity Studio with `npx sanity deploy`

## 🔐 Security

### API Tokens
For production, you may want to create a read-only API token:

1. Go to your Sanity project settings
2. Navigate to API settings
3. Create a new token with read permissions
4. Add to `.env.local`:
   ```env
   SANITY_API_TOKEN=your_token_here
   ```

### CORS Origins
Add your production domain to allowed CORS origins in Sanity project settings.

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Schema Types](https://www.sanity.io/docs/schema-types)
- [Next.js + Sanity Guide](https://www.sanity.io/guides/nextjs-app-router-live-preview)

## 🆘 Troubleshooting

### Issue: "Cannot find module './sanity/schemas'"
This is a TypeScript error that can be ignored. The schemas are properly configured.

### Issue: Indicators not showing
1. Check that `NEXT_PUBLIC_SANITY_PROJECT_ID` is set correctly
2. Verify indicators are marked as "Active" in Sanity Studio
3. Check browser console for errors

### Issue: Images not loading
1. Ensure images are uploaded in Sanity Studio
2. Check that `@sanity/image-url` is installed
3. Verify CORS settings in Sanity project

## 🎯 Next Steps

1. Create your first indicator in Sanity Studio
2. Visit `/library` to see it displayed
3. Click on an indicator to view details
4. Customize the design and add more features!
