import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendSubscriptionNotification } from '@/lib/telegram';

// Lazy initialization to avoid build-time errors
function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-10-29.clover',
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  console.log('📥 Webhook received:', {
    hasSignature: !!signature,
    bodyLength: body.length,
    timestamp: new Date().toISOString(),
  });

  if (!signature) {
    console.error('❌ No signature in webhook request');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature (prevents fake requests)
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    console.log('✅ Webhook signature verified:', {
      eventType: event.type,
      eventId: event.id,
      created: new Date(event.created * 1000).toISOString(),
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ Webhook signature verification failed:', errorMessage);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // Handle different payment events
  try {
    let result: Record<string, unknown> = { received: true, eventType: event.type, eventId: event.id };
    
    switch (event.type) {
      case 'checkout.session.completed':
        result = await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        result = await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        result = await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        result = await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        result = await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
        result.unhandled = true;
    }

    console.log('✅ Webhook processed successfully:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: errorMessage,
      eventType: event.type,
      eventId: event.id,
    }, { status: 500 });
  }
}

// Handle successful checkout session (Payment completed)
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // Extract Clerk user ID from client_reference_id or metadata
  const clerkUserId = session.client_reference_id || session.metadata?.userId;
  
  console.log('📦 Checkout session data:', {
    sessionId: session.id,
    clientReferenceId: clerkUserId,
    customerId: session.customer,
    subscriptionId: session.subscription,
    amountTotal: session.amount_total,
    currency: session.currency,
    paymentStatus: session.payment_status,
    metadata: session.metadata,
  });
  
  if (!clerkUserId) {
    console.error('❌ No client_reference_id or userId in session metadata');
    return { error: 'No user ID found', sessionId: session.id };
  }

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const planId = session.metadata?.planId || 'premium'; // Default to 'premium' if not specified
  const frequency = session.metadata?.frequency || 'monthly'; // Default to 'monthly'

  console.log('✅ Payment completed!', {
    clerkUserId,
    planId,
    frequency,
    customerId,
    subscriptionId,
    sessionId: session.id,
  });

  // Check for existing subscriptions (handle duplicates)
  const { data: existingSubscriptions } = await supabaseAdmin
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', clerkUserId)
    .order('created_at', { ascending: false });

  if (existingSubscriptions && existingSubscriptions.length > 0) {
    // If there are multiple subscriptions, keep only the most recent one
    const mostRecent = existingSubscriptions[0];
    
    // Update the most recent subscription
    const { error: updateError } = await supabaseAdmin
      .from('user_subscriptions')
      .update({
        plan_id: planId,
        status: 'active',
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', mostRecent.id);
    
    if (updateError) {
      console.error('❌ Error updating subscription:', updateError);
      throw updateError;
    }
    
    // Delete duplicate subscriptions (keep only the most recent one)
    if (existingSubscriptions.length > 1) {
      const duplicateIds = existingSubscriptions.slice(1).map(sub => sub.id);
      const { error: deleteError } = await supabaseAdmin
        .from('user_subscriptions')
        .delete()
        .in('id', duplicateIds);
      
      if (deleteError) {
        console.error('❌ Error deleting duplicate subscriptions:', deleteError);
        // Don't throw - log the error but continue
      } else {
        console.log(`✅ Deleted ${existingSubscriptions.length - 1} duplicate subscription(s) for user:`, clerkUserId);
      }
    }
    
    console.log('✅ Updated subscription for user:', clerkUserId);
    
    // Send Telegram notification for subscription update (if it's a new subscription)
    // Check if this is a new subscription by comparing subscription IDs
    const isNewSubscription = !mostRecent.stripe_subscription_id || mostRecent.stripe_subscription_id !== subscriptionId;
    
    if (isNewSubscription) {
      // Get user name and email from Supabase
      let userName: string | undefined;
      let userEmail: string | undefined;
      
      try {
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('email, first_name, last_name')
          .eq('clerk_id', clerkUserId)
          .maybeSingle();
        
        if (userData) {
          userEmail = userData.email || undefined;
          if (userData.first_name || userData.last_name) {
            userName = [userData.first_name, userData.last_name].filter(Boolean).join(' ') || undefined;
          }
        }
      } catch (error) {
        console.error('❌ Error fetching user data:', error);
      }
      
      // Fallback to Stripe customer email if not found in Supabase
      if (!userEmail) {
        userEmail = session.customer_email || undefined;
      }
      
      // Send Telegram notification
      const planNames: Record<string, string> = {
        free: 'Free',
        premium: 'Premium',
        ultimate: 'Ultimate',
      };
      
      try {
        await sendSubscriptionNotification({
          clerkUserId,
          planId,
          planName: planNames[planId] || planId,
          frequency,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          customerId,
          subscriptionId,
          userEmail,
          userName,
        });
        console.log('✅ Telegram notification sent successfully');
      } catch (telegramError) {
        console.error('❌ Error sending Telegram notification:', telegramError);
      }
    }
  } else {
    // Create new subscription
    const { error } = await supabaseAdmin
      .from('user_subscriptions')
      .insert({
        user_id: clerkUserId,
        plan_id: planId,
        status: 'active',
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
      });

    if (error) {
      console.error('❌ Error creating subscription:', error);
      throw error;
    }
    
    console.log('✅ Created new subscription for user:', clerkUserId);
    
    // Get user name and email from Supabase
    let userName: string | undefined;
    let userEmail: string | undefined;
    
    try {
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('email, first_name, last_name')
        .eq('clerk_id', clerkUserId)
        .maybeSingle();
      
      if (userData) {
        userEmail = userData.email || undefined;
        if (userData.first_name || userData.last_name) {
          userName = [userData.first_name, userData.last_name].filter(Boolean).join(' ') || undefined;
        }
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      // Continue without user data
    }
    
    // Fallback to Stripe customer email if not found in Supabase
    if (!userEmail) {
      userEmail = session.customer_email || undefined;
    }
    
    // Send Telegram notification for new subscription
    const planNames: Record<string, string> = {
      free: 'Free',
      premium: 'Premium',
      ultimate: 'Ultimate',
    };
    
    try {
      await sendSubscriptionNotification({
        clerkUserId,
        planId,
        planName: planNames[planId] || planId,
        frequency,
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        customerId,
        subscriptionId,
        userEmail,
        userName,
      });
      console.log('✅ Telegram notification sent successfully');
    } catch (telegramError) {
      // Don't fail the webhook if Telegram notification fails
      console.error('❌ Error sending Telegram notification:', telegramError);
    }
  }

  return {
    success: true,
    clerkUserId,
    planId,
    frequency,
    customerId,
    subscriptionId,
  };
}

// Handle subscription updates
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const clerkUserId = subscription.metadata?.userId;

  console.log('📦 Subscription update:', {
    subscriptionId,
    customerId,
    clerkUserId,
    status: subscription.status,
  });

  // Find user by Stripe customer ID or subscription metadata
  let clerkId = clerkUserId;
  
  if (!clerkId) {
    // Try to find by customer ID
    const { data: subscriptionData } = await supabaseAdmin
      .from('user_subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();
    
    if (subscriptionData) {
      clerkId = subscriptionData.user_id;
    }
  }

  if (!clerkId) {
    console.error('❌ Could not find user for subscription:', subscriptionId);
    return { error: 'User not found', subscriptionId };
  }

  // Determine status
  const status = subscription.status === 'active' ? 'active' : 
                 subscription.status === 'canceled' ? 'canceled' : 
                 subscription.status === 'past_due' ? 'past_due' : 
                 subscription.status === 'unpaid' ? 'unpaid' : 'inactive';

  // Get plan from subscription metadata or existing record
  const planId = subscription.metadata?.planId;

  // Check for existing subscriptions (handle duplicates)
  const { data: existingSubscriptions } = await supabaseAdmin
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', clerkId)
    .order('created_at', { ascending: false });

  if (existingSubscriptions && existingSubscriptions.length > 0) {
    // If there are multiple subscriptions, keep only the most recent one
    const mostRecent = existingSubscriptions[0];
    
    // Update the most recent subscription
    const updateData: {
      status: string;
      stripe_subscription_id: string;
      updated_at: string;
      plan_id?: string;
    } = {
      status,
      stripe_subscription_id: subscription.id,
      updated_at: new Date().toISOString(),
    };

    if (planId) {
      updateData.plan_id = planId;
    }

    const { error } = await supabaseAdmin
      .from('user_subscriptions')
      .update(updateData)
      .eq('id', mostRecent.id);

    if (error) {
      console.error('❌ Error updating subscription:', error);
      throw error;
    }

    // Delete duplicate subscriptions (keep only the most recent one)
    if (existingSubscriptions.length > 1) {
      const duplicateIds = existingSubscriptions.slice(1).map(sub => sub.id);
      const { error: deleteError } = await supabaseAdmin
        .from('user_subscriptions')
        .delete()
        .in('id', duplicateIds);
      
      if (deleteError) {
        console.error('❌ Error deleting duplicate subscriptions:', deleteError);
        // Don't throw - log the error but continue
      } else {
        console.log(`✅ Deleted ${existingSubscriptions.length - 1} duplicate subscription(s) for user:`, clerkId);
      }
    }

    console.log('✅ Updated subscription status:', { clerkId, status });
  } else {
    // Create new subscription if it doesn't exist
    const { error } = await supabaseAdmin
      .from('user_subscriptions')
      .insert({
        user_id: clerkId,
        plan_id: planId || 'premium',
        status,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
      });

    if (error) {
      console.error('❌ Error creating subscription:', error);
      throw error;
    }

    console.log('✅ Created subscription from update event:', { clerkId, status });
  }

  return {
    success: true,
    clerkUserId: clerkId,
    status,
    subscriptionId,
  };
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('❌ Error canceling subscription:', error);
    throw error;
  }

  console.log('✅ Subscription canceled for customer:', customerId);

  return {
    success: true,
    status: 'canceled',
    customerId,
  };
}

// Handle successful recurring payment
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Find user by Stripe customer ID
  const { data: subscriptionData } = await supabaseAdmin
    .from('user_subscriptions')
    .select('user_id, plan_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();

  if (!subscriptionData) {
    console.error('❌ Subscription not found for customer:', customerId);
    return { error: 'Subscription not found', customerId };
  }

  // Update subscription status
  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('❌ Error updating subscription:', error);
  }

  console.log('✅ Recurring payment succeeded for user:', subscriptionData.user_id);

  return {
    success: true,
    clerkUserId: subscriptionData.user_id,
    planId: subscriptionData.plan_id,
    isRecurring: true,
  };
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('❌ Error updating subscription:', error);
  }

  console.error('❌ Payment failed for customer:', customerId);

  return {
    success: false,
    error: 'Payment failed',
    customerId,
  };
}

