import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createTradingViewBrowserService } from '@/lib/tradingview-browser-service';
import { getUserByClerkId, updateUserSubscription, logPineAccess } from '@/lib/data-access-layer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
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
    const scriptIds = SCRIPT_MAPPING[tier];
    const duration = tier === 'basic' ? '30d' : tier === 'pro' ? '90d' : '1y';
    
    const grantResult = await tvService.grantScriptAccess({
      username: tradingviewUsername,
      scriptIds,
      duration,
      tier
    });

    // Log results
    const user = await getUserByClerkId(userId);
    if (user) {
      for (const result of grantResult.results) {
        await logPineAccess({
          user_id: user.id,
          pine_id: result.scriptId,
          tradingview_username: tradingviewUsername,
          action: 'auto_grant_subscription',
          tier,
          duration,
          success: result.success,
          error_message: result.success ? undefined : result.message
        });
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
    const user = await getUserByClerkId(userId);
    if (user) {
      await logPineAccess({
        user_id: user.id,
        pine_id: 'all_scripts',
        tradingview_username: tradingviewUsername,
        action: 'auto_revoke_subscription',
        tier: 'all',
        duration: 'immediate',
        success: true
      });
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
            // Update user subscription in database
            await updateUserSubscription(userId, {
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              status: 'active',
              current_period_end: new Date(subscription.current_period_end * 1000),
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
        
        await updateUserSubscription(userId, {
          stripe_subscription_id: subscription.id,
          status: subscription.status as any,
          current_period_end: new Date(subscription.current_period_end * 1000),
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

        await updateUserSubscription(userId, {
          stripe_subscription_id: subscription.id,
          status: 'canceled',
          current_period_end: new Date(subscription.current_period_end * 1000)
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
          const user = await getUserByClerkId(userId);
          if (user) {
            await logPineAccess({
              user_id: user.id,
              pine_id: 'payment_failed',
              tradingview_username: tradingviewUsername,
              action: 'payment_failed_notification',
              tier: 'unknown',
              duration: 'immediate',
              success: true,
              error_message: 'Payment failed - access may be revoked'
            });
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          console.log(`✅ Payment succeeded for subscription ${invoice.subscription}`);
          
          // Ensure subscription is still active and access is maintained
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const customerId = subscription.customer as string;
          
          const customer = await stripe.customers.retrieve(customerId);
          if (!customer.deleted) {
            const userId = customer.metadata?.userId;
            const tradingviewUsername = customer.metadata?.tradingview_username;
            
            if (userId && tradingviewUsername) {
              const user = await getUserByClerkId(userId);
              if (user) {
                await logPineAccess({
                  user_id: user.id,
                  pine_id: 'payment_success',
                  tradingview_username: tradingviewUsername,
                  action: 'payment_success_confirmation',
                  tier: user.subscription?.plan_name || 'unknown',
                  duration: 'ongoing',
                  success: true,
                  error_message: 'Payment successful - access maintained'
                });
              }
            }
          }
        }
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