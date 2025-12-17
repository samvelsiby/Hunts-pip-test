import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@clerk/nextjs/server'
import { getUserSubscription } from '@/lib/data-access-layer'

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-10-29.clover',
  })
}

function getBaseUrl(request: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_BASE_URL ||
    (request.headers.get('origin') && !request.headers.get('origin')?.includes('localhost')
      ? request.headers.get('origin')
      : null) ||
    'https://huntspip.com'
  )
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const returnPath = typeof body?.returnPath === 'string' ? body.returnPath : '/dashboard'

    const subscriptionResult = await getUserSubscription(userId)
    const sub = subscriptionResult.data

    const stripeCustomerId = sub?.stripe_customer_id
    if (!stripeCustomerId) {
      return NextResponse.json(
        {
          error: 'No Stripe customer found for this user',
          message: 'Please purchase a plan first, then manage it from your dashboard.',
        },
        { status: 400 }
      )
    }

    const stripe = getStripe()
    const baseUrl = getBaseUrl(request)

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${baseUrl}${returnPath}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('❌ Error creating Stripe billing portal session:', error)
    return NextResponse.json({ error: 'Failed to create billing portal session' }, { status: 500 })
  }
}


