/**
 * Stripe Payment Links Configuration
 * Maps plan IDs and frequencies to Stripe Payment Link URLs
 */

export const PAYMENT_LINKS: Record<string, Record<string, string>> = {
  premium: {
    monthly: 'https://buy.stripe.com/eVq4gBcjv4cJaqfdhQ9EI03',
    yearly: 'https://buy.stripe.com/dRm4gB2IV24B2XNb9I9EI02',
  },
  ultimate: {
    monthly: 'https://buy.stripe.com/9B6cN7abn8sZfKz5Po9EI00',
    yearly: 'https://buy.stripe.com/bJe00labnbFbgODdhQ9EI01',
  },
};

/**
 * Get the Payment Link URL for a given plan and frequency
 */
export function getPaymentLink(planId: string, frequency: string): string | null {
  const link = PAYMENT_LINKS[planId]?.[frequency];
  
  // Return null if link is empty or undefined
  if (!link || link.trim() === '') {
    console.warn(`Payment link not found for plan: ${planId}, frequency: ${frequency}`);
    return null;
  }
  
  return link;
}

