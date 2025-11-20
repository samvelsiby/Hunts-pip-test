/**
 * Stripe Price IDs Configuration
 * Maps plan IDs and frequencies to Stripe Price IDs
 * 
 * To get your Price IDs:
 * 1. Go to Stripe Dashboard → Products
 * 2. Create products for "Premium" and "Ultimate" plans
 * 3. Create prices for each:
 *    - Premium Monthly: $30/month
 *    - Premium Yearly: $25/month (billed yearly)
 *    - Ultimate Monthly: $50/month
 *    - Ultimate Yearly: $42/month (billed yearly)
 * 4. Copy the Price IDs (start with price_) and update below
 */

export const STRIPE_PRICE_IDS: Record<string, Record<string, string>> = {
  premium: {
    monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || 'price_1SVQxvQKnoBObMWtVHOxXwGv', // Premium Monthly - LIVE
    yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY || 'price_1SVQxvQKnoBObMWtJ49xF5U6', // Premium Yearly - LIVE
  },
  ultimate: {
    monthly: process.env.STRIPE_PRICE_ULTIMATE_MONTHLY || 'price_1SVQycQKnoBObMWtdaYVb942', // Ultimate Monthly - LIVE
    yearly: process.env.STRIPE_PRICE_ULTIMATE_YEARLY || 'price_1SVQzNQKnoBObMWtoCYaPhiN', // Ultimate Yearly - LIVE
  },
};

/**
 * Get the Stripe Price ID for a given plan and frequency
 */
export function getStripePriceId(planId: string, frequency: string): string | null {
  const priceId = STRIPE_PRICE_IDS[planId]?.[frequency];
  
  if (!priceId || priceId.startsWith('price_') === false) {
    console.warn(`Invalid or missing Stripe Price ID for plan: ${planId}, frequency: ${frequency}`);
    return null;
  }
  
  return priceId;
}

