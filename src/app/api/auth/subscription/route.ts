import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the anon key for user operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * GET handler to retrieve user subscription
 */
export async function GET(req: NextRequest) {
  try {
    // Get the session from the request
    const sessionToken = req.headers.get('authorization')?.split('Bearer ')[1];
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify the session
    const { data: { user }, error: authError } = await supabase.auth.getUser(sessionToken);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user's subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (subError) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    if (!subscription) {
      // Create a new subscription if one doesn't exist
      const { data: newSubscription, error: createError } = await supabase
        .from('user_subscriptions')
        .insert({ user_id: user.id, plan_id: 'free', status: 'active' })
        .select()
        .single();
      
      if (createError) {
        return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
      }
      
      return NextResponse.json({ subscription: newSubscription });
    }
    
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error in subscription GET:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * PATCH handler to update user subscription
 */
export async function PATCH(req: NextRequest) {
  try {
    // Get the session from the request
    const sessionToken = req.headers.get('authorization')?.split('Bearer ')[1];
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify the session
    const { data: { user }, error: authError } = await supabase.auth.getUser(sessionToken);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body
    const body = await req.json();
    const { tradingview_username, plan_id } = body;
    
    // Get the user's subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (subError) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    // Update fields to change
    const updateFields: Record<string, string | undefined> = {};
    
    if (tradingview_username !== undefined) {
      updateFields.tradingview_username = tradingview_username;
    }
    
    if (plan_id !== undefined) {
      updateFields.plan_id = plan_id;
    }
    
    // Only update if there are fields to update
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    if (subscription) {
      // Update existing subscription
      const { data: updatedSubscription, error: updateError } = await supabase
        .from('user_subscriptions')
        .update(updateFields)
        .eq('id', subscription.id)
        .select()
        .single();
      
      if (updateError) {
        return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
      }
      
      return NextResponse.json({ subscription: updatedSubscription });
    } else {
      // Create a new subscription
      const newSubscription = {
        user_id: user.id,
        plan_id: plan_id || 'free',
        status: 'active',
        ...updateFields
      };
      
      const { data: createdSubscription, error: createError } = await supabase
        .from('user_subscriptions')
        .insert(newSubscription)
        .select()
        .single();
      
      if (createError) {
        return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
      }
      
      return NextResponse.json({ subscription: createdSubscription });
    }
  } catch (error) {
    console.error('Error in subscription PATCH:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
