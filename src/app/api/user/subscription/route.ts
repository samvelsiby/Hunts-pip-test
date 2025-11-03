import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // First, get the user from Supabase using clerk_id
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (userError || !user) {
      console.error('Error fetching user from Supabase:', userError);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get subscription for this user
    const { data: subscription, error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .select('plan_type, status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError);
      // Return default subscription if not found
      return NextResponse.json({
        plan_type: 'free',
        status: 'active'
      });
    }

    return NextResponse.json({
      plan_type: subscription?.plan_type || 'free',
      status: subscription?.status || 'active'
    });
  } catch (error) {
    console.error('Error getting subscription:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    );
  }
}

