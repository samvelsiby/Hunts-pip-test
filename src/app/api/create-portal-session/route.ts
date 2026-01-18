import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { getUserSubscription } from '@/lib/data-access-layer';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the user's subscription to find the Stripe Customer ID
        const { data: subscription, error: subError } = await getUserSubscription(userId);

        if (subError || !subscription?.stripe_customer_id) {
            console.error('Error fetching subscription or no customer ID:', subError);
            return NextResponse.json(
                { error: 'No active subscription or customer record found' },
                { status: 404 }
            );
        }

        const customerId = subscription.stripe_customer_id;

        // Initialize Stripe
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            console.error('STRIPE_SECRET_KEY is not configured');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const stripe = new Stripe(secretKey, {
            apiVersion: '2025-10-29.clover', // Matching version from existing webhook handler
        });

        console.log('Creating portal session for customer:', customerId); // Debug log

        // Create the portal session
        // Return URL defaults to the Referer or origin if not specified
        const returnUrl = req.headers.get('referer') || req.headers.get('origin') || 'https://huntspip.com';

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error('Error creating portal session:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
