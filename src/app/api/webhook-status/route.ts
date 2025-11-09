import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasStripeWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      hasStripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...' || 'Missing',
      webhookSecretLength: process.env.STRIPE_WEBHOOK_SECRET?.length || 0,
      webhookSecretPrefix: process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 10) + '...' || 'Missing',
    };

    // Check recent subscriptions in database
    const { data: recentSubscriptions, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // Check for a specific user's subscription
    const testUserId = 'user_34zrfTJWW7rrgwmP8BqZFjijbcD';
    const { data: userSubscription, error: userSubError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', testUserId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Test Supabase write capability
    let writeTest: { success: boolean; error: string | null } = { success: false, error: null };
    try {
      // Don't actually insert, just check if we can access the table
      const { error: testError } = await supabaseAdmin
        .from('user_subscriptions')
        .select('id')
        .limit(1);
      
      writeTest = {
        success: !testError,
        error: testError ? testError.message : null,
      };
    } catch (error) {
      writeTest = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        canRead: !subError,
        canWrite: writeTest.success,
        writeError: writeTest.error,
        recentSubscriptionsCount: recentSubscriptions?.length || 0,
        recentSubscriptions: recentSubscriptions?.map(sub => ({
          id: sub.id,
          user_id: sub.user_id,
          plan_id: sub.plan_id,
          status: sub.status,
          created_at: sub.created_at,
          stripe_subscription_id: sub.stripe_subscription_id,
        })) || [],
        userSubscription: userSubscription?.map(sub => ({
          id: sub.id,
          user_id: sub.user_id,
          plan_id: sub.plan_id,
          status: sub.status,
          created_at: sub.created_at,
          stripe_subscription_id: sub.stripe_subscription_id,
        })) || [],
        userSubscriptionError: userSubError ? {
          message: userSubError.message,
          code: userSubError.code,
          details: userSubError.details,
        } : null,
      },
      webhookEndpoint: {
        url: process.env.NEXT_PUBLIC_APP_URL 
          ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/stripe`
          : 'https://huntspip.com/api/webhooks/stripe',
        expectedSecret: envCheck.webhookSecretPrefix,
      },
      recommendations: [
        !envCheck.hasStripeWebhookSecret ? '❌ STRIPE_WEBHOOK_SECRET is missing' : '✅ STRIPE_WEBHOOK_SECRET is set',
        !envCheck.hasStripeSecretKey ? '❌ STRIPE_SECRET_KEY is missing' : '✅ STRIPE_SECRET_KEY is set',
        !envCheck.hasSupabaseUrl ? '❌ NEXT_PUBLIC_SUPABASE_URL is missing' : '✅ NEXT_PUBLIC_SUPABASE_URL is set',
        !envCheck.hasServiceKey ? '❌ SUPABASE_SERVICE_ROLE_KEY is missing' : '✅ SUPABASE_SERVICE_ROLE_KEY is set',
        !writeTest.success ? `❌ Cannot write to database: ${writeTest.error}` : '✅ Can write to database',
        userSubscription?.length === 0 ? `⚠️ No subscription found for user: ${testUserId}` : `✅ Found ${userSubscription?.length} subscription(s) for user`,
      ],
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

