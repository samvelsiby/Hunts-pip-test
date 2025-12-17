import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { getUserSubscription } from '@/lib/data-access-layer';
import Stripe from 'stripe';

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
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await request.json();

    if (planId !== 'free') {
      return NextResponse.json({ error: 'This endpoint is only for free plan' }, { status: 400 });
    }

    // Check if user already has a subscription
    const subscriptionResult = await getUserSubscription(userId);
    const existingSubscription = subscriptionResult.data;
    const currentPlan = existingSubscription?.plan_type || 'free';
    const currentStatus = existingSubscription?.status || 'inactive';

    // If user has an active paid subscription, block them from switching to free
    // They should manage cancellation/downgrade via Stripe Customer Portal
    if (currentStatus === 'active' && (currentPlan === 'premium' || currentPlan === 'ultimate')) {
      const stripeCustomerId = existingSubscription?.stripe_customer_id;
      if (stripeCustomerId) {
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL ||
          process.env.APP_BASE_URL ||
          (request.headers.get('origin') && !request.headers.get('origin')?.includes('localhost')
            ? request.headers.get('origin')
            : null) ||
          'https://huntspip.com';

        const stripe = getStripe();
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: stripeCustomerId,
          return_url: `${baseUrl}/dashboard`,
        });

        return NextResponse.json(
          {
            error: 'You have an active paid subscription',
            currentPlan,
            status: currentStatus,
            message: `You are currently subscribed to the ${currentPlan} plan. Please manage your subscription in Stripe.`,
            requiresPortal: true,
            url: portalSession.url,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: 'You have an active paid subscription',
          currentPlan,
          status: currentStatus,
          message: `You are currently subscribed to the ${currentPlan} plan. Please manage your subscription from your dashboard.`,
          requiresPortal: true,
        },
        { status: 400 }
      );
    }

    // Check if subscription exists in database
    const { data: dbSubscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (dbSubscription) {
      // Update existing subscription to free plan (only if they're already on free or inactive)
      const { error: updateError } = await supabaseAdmin
        .from('user_subscriptions')
        .update({
          plan_id: 'free',
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', dbSubscription.id);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
      }
    } else {
      // Create new free subscription
      const { error: insertError } = await supabaseAdmin
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: 'free',
          status: 'active',
        });

      if (insertError) {
        console.error('Error creating subscription:', insertError);
        return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Free plan activated successfully'
    });
  } catch (error) {
    console.error('Error subscribing to free plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


