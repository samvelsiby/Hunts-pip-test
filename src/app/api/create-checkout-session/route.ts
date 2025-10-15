import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const planPrices = {
  pro: 'price_pro_30', // You'll need to create these in Stripe
  premium: 'price_premium_50',
};

export async function POST(request: NextRequest) {
  try {
    const { planId, userId, userEmail } = await request.json();

    if (!planId || !userId || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (planId === 'free') {
      return NextResponse.json({ error: 'Free plan does not require payment' }, { status: 400 });
    }

    const priceId = planPrices[planId as keyof typeof planPrices];
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.APP_BASE_URL}/dashboard?success=true&plan=${planId}`,
      cancel_url: `${process.env.APP_BASE_URL}/pricing?canceled=true`,
      customer_email: userEmail,
      metadata: {
        userId,
        planId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
