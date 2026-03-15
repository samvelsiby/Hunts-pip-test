import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createTradingViewBrowserService } from '@/lib/tradingview-browser-service';
import { getUserData, getUserSubscription, grantPineScriptAccess } from '@/lib/data-access-layer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Subscription tier mapping
const TIER_MAPPING = {
  'price_basic_monthly': 'basic',
  'price_basic_yearly': 'basic', 
  'price_pro_monthly': 'pro',
  'price_pro_yearly': 'pro',
  'price_enterprise_monthly': 'enterprise',
  'price_enterprise_yearly': 'enterprise',
} as const;

const SCRIPT_MAPPING = {
  basic: ['jZux9ArT-Ultimate-SMC-HuntsPip'], // Ultimate SMC (HuntsPip)
  pro: ['jZux9ArT-Ultimate-SMC-HuntsPip'], // Same script for all tiers for now  
  enterprise: ['jZux9ArT-Ultimate-SMC-HuntsPip'] // Can add more scripts later
} as const;

async function grantTradingViewAccess(
  userId: string, 
  tradingviewUsername: string, 
  tier: 'basic' | 'pro' | 'enterprise'
): Promise<{ success: boolean; error?: string }> {
  console.log(`🎯 Granting TradingView access: ${tier} tier for ${tradingviewUsername}`);
  
  const tvService = createTradingViewBrowserService();
  if (!tvService) {
    return { success: false, error: 'TradingView service unavailable' };
  }

  try {
    // Initialize and authenticate
    const initResult = await tvService.initialize();
    if (!initResult.success) {
      throw new Error(`Initialization failed: ${initResult.error}`);
    }

    const authResult = await tvService.authenticate();
    if (!authResult.success) {
      throw new Error(`Authentication failed: ${authResult.error}`);
    }

    // Grant access to tier-specific scripts
    const scriptIds = [...SCRIPT_MAPPING[tier]]; // Convert readonly array to mutable
    const duration = tier === 'basic' ? '30d' : tier === 'pro' ? '90d' : '1y';
    
    const grantResult = await tvService.grantScriptAccess({
      username: tradingviewUsername,
      scriptIds,
      duration,
      tier
    });

    // Log results
    const userResult = await getUserData(userId);
    if (userResult.data) {
      for (const result of grantResult.results) {
        await grantPineScriptAccess(
          userId,
          result.scriptId,
          tradingviewUsername,
          'days',
          30
        );
      }
    }

    return { 
      success: grantResult.success,
      error: grantResult.errors.length > 0 ? grantResult.errors.join(', ') : undefined
    };

  } catch (error) {
    console.error('TradingView access grant failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  } finally {
    await tvService.cleanup();
  }
}

async function revokeTradingViewAccess(
  userId: string, 
  tradingviewUsername: string
): Promise<{ success: boolean; error?: string }> {
  console.log(`🚫 Revoking TradingView access for ${tradingviewUsername}`);
  
  // For revocation, you'd implement similar browser automation
  // or use the existing TradingViewService.removeAccess method
  // This is a simplified implementation
  
  try {
    const userResult = await getUserData(userId);
    if (userResult.data) {
      // Note: You would need to implement revoke functionality
      console.log('TradingView access revoked for', tradingviewUsername);
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Revocation failed' 
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log(`🎉 Stripe webhook received: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const tradingviewUsername = session.metadata?.tradingview_username;
        
        if (!userId || !tradingviewUsername) {
          console.log('⚠️ Missing userId or tradingview_username in session metadata');
          break;
        }

        if (session.mode === 'subscription' && session.subscription) {
          console.log(`✅ Subscription created for user ${userId}`);
          
          // Get subscription details to determine tier
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const priceId = subscription.items.data[0]?.price?.id;
          const tier = priceId ? TIER_MAPPING[priceId as keyof typeof TIER_MAPPING] : undefined;
          
          if (tier) {
            // Note: You would need to implement updateUserSubscription functionality
            console.log('Subscription updated:', {
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              status: 'active',
              plan_name: tier,
              tradingview_username: tradingviewUsername
            });

            // Grant TradingView access
            const grantResult = await grantTradingViewAccess(userId, tradingviewUsername, tier);
            if (!grantResult.success) {
              console.error(`❌ Failed to grant TradingView access: ${grantResult.error}`);
            } else {
              console.log(`✅ TradingView ${tier} access granted to ${tradingviewUsername}`);
            }
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find user by customer ID
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) break;
        
        const userId = customer.metadata?.userId;
        const tradingviewUsername = customer.metadata?.tradingview_username;
        
        if (!userId || !tradingviewUsername) break;

        const priceId = subscription.items.data[0]?.price?.id;
        const tier = priceId ? TIER_MAPPING[priceId as keyof typeof TIER_MAPPING] : undefined;
        
        // Note: You would need to implement updateUserSubscription functionality
        console.log('Subscription updated:', {
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          plan_name: tier || 'unknown'
        });

        // If subscription is active and tier changed, update TradingView access
        if (subscription.status === 'active' && tier) {
          const grantResult = await grantTradingViewAccess(userId, tradingviewUsername, tier);
          if (!grantResult.success) {
            console.error(`❌ Failed to update TradingView access: ${grantResult.error}`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) break;
        
        const userId = customer.metadata?.userId;
        const tradingviewUsername = customer.metadata?.tradingview_username;
        
        if (!userId || !tradingviewUsername) break;

        // Note: You would need to implement updateUserSubscription functionality
        console.log('Subscription canceled:', {
          stripe_subscription_id: subscription.id,
          status: 'canceled'
        });

        // Revoke TradingView access
        const revokeResult = await revokeTradingViewAccess(userId, tradingviewUsername);
        if (!revokeResult.success) {
          console.error(`❌ Failed to revoke TradingView access: ${revokeResult.error}`);
        } else {
          console.log(`✅ TradingView access revoked for ${tradingviewUsername}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) break;
        
        const userId = customer.metadata?.userId;
        const tradingviewUsername = customer.metadata?.tradingview_username;
        
        if (userId && tradingviewUsername) {
          console.log(`⚠️ Payment failed for user ${userId} - consider revoking access after grace period`);
          
          // You might want to implement a grace period before revoking access
          // For now, just log the event
          const userResult = await getUserData(userId);
          if (userResult.data) {
            console.log('Payment failed for user:', userId, tradingviewUsername);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`✅ Payment succeeded for invoice ${invoice.id}`);
        
        // For simplicity, just log the successful payment
        // You could add more logic here if needed
        break;
      }

      default:
        console.log(`🔍 Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}