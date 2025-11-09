import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';
import { getStripePriceId } from '@/config/stripe-prices';

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

    // Get Stripe Price ID
    const priceId = getStripePriceId(planId, frequency);
    if (!priceId) {
      return NextResponse.json({ 
        error: `Price ID not found for plan: ${planId}, frequency: ${frequency}. Please configure Stripe Price IDs.` 
      }, { status: 400 });
    }

    const stripe = getStripe();
    
    // Get base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    process.env.APP_BASE_URL || 
                    request.headers.get('origin') || 
                    'http://localhost:3000';

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
