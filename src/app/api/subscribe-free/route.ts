import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-server';

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
    const { data: existingSubscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingSubscription) {
      // Update existing subscription to free plan
      const { error: updateError } = await supabaseAdmin
        .from('user_subscriptions')
        .update({
          plan_id: 'free',
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSubscription.id);

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


