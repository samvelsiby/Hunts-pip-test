import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';
import { getStripePriceId } from '@/config/stripe-prices';
import { getUserSubscription } from '@/lib/data-access-layer';

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

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId, frequency } = await request.json();

    if (!planId || !frequency) {
      return NextResponse.json({ error: 'Missing required fields: planId and frequency' }, { status: 400 });
    }

    if (planId === 'free') {
      return NextResponse.json({ error: 'Free plan does not require payment' }, { status: 400 });
    }

    // Validate frequency
    if (frequency !== 'monthly' && frequency !== 'yearly') {
      return NextResponse.json({ error: 'Invalid frequency. Must be "monthly" or "yearly"' }, { status: 400 });
    }

    // Check if user already has a subscription
    const subscriptionResult = await getUserSubscription(userId);
    const existingSubscription = subscriptionResult.data;
    const currentPlan = existingSubscription?.plan_type || 'free';
    const currentStatus = existingSubscription?.status || 'inactive';

    // If user already has an active subscription (premium or ultimate), block checkout.
    // Subscription management is handled in the dashboard billing portal.
    if (currentStatus === 'active' && (currentPlan === 'premium' || currentPlan === 'ultimate')) {
      return NextResponse.json({ 
        error: 'You already have an active subscription',
        currentPlan,
        status: currentStatus,
        message: `You are already subscribed to the ${currentPlan} plan. Manage your subscription from Dashboard → Billing.`,
        requiresContact: true,
        redirectTo: '/dashboard/billing',
      }, { status: 400 });
    }

    // Allow new subscriptions (free -> premium/ultimate)
    // This will proceed to create checkout session

    // Get Stripe Price ID
    const priceId = getStripePriceId(planId, frequency);
    if (!priceId) {
      return NextResponse.json({ 
        error: `Price ID not found for plan: ${planId}, frequency: ${frequency}. Please configure Stripe Price IDs.` 
      }, { status: 400 });
    }

    const stripe = getStripe();
    
    // Get base URL - prioritize production URL, then environment variable, then request origin
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    process.env.APP_BASE_URL || 
                    (request.headers.get('origin') && !request.headers.get('origin')?.includes('localhost') 
                      ? request.headers.get('origin') 
                      : null) ||
                    'https://huntspip.com';

    // Create checkout session with subscription mode
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Recurring subscription
      success_url: `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      client_reference_id: userId, // Track the Clerk user ID
      metadata: {
        userId, // Clerk user ID
        planId, // 'premium' or 'ultimate'
        frequency, // 'monthly' or 'yearly'
      },
      subscription_data: {
        metadata: {
          userId, // Store in subscription metadata too
          planId,
          frequency,
        },
      },
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      userId,
      planId,
      frequency,
      priceId,
    });

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Internal server error',
      message: errorMessage 
    }, { status: 500 });
  }
}
