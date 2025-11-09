import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Test Supabase connection
    const { data, error } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .limit(5);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }, { status: 500 });
    }

    // Test insert capability (dry run - don't actually insert)
    const testData = {
      user_id: 'test_user_id',
      plan_id: 'premium',
      status: 'active',
      stripe_customer_id: 'test_customer',
      stripe_subscription_id: 'test_subscription',
    };

    // Check environment variables
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...' || 'Missing',
      serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) + '...' || 'Missing',
    };

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      envCheck,
      tableAccess: {
        canRead: true,
        recordCount: data?.length || 0,
        sampleRecords: data?.slice(0, 2) || [],
      },
      testData,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

