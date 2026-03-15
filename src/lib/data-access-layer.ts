/**
 * Data Access Layer with Row Level Security (RLS)
 * 
 * This module provides secure data access functions that work with
 * Supabase Row Level Security (RLS) policies for defense-in-depth security.
 * 
 * Security Architecture:
 * 1. RLS policies at database level (automatic data isolation)
 * 2. Application-level access control (Clerk user verification) 
 * 3. Service role for API operations (bypasses RLS when needed)
 * 
 * All functions ensure users can only access their own data through
 * both RLS policies and application-level verification.
 */

import { supabaseAdmin } from '@/lib/supabase-server';

export interface DataAccessResult<T> {
  data: T | null;
  error: Error | null;
  authorized: boolean;
}

/**
 * Get user data for a specific Clerk user ID
 * Only returns data if the userId matches the clerk_id in the database
 */
export async function getUserData(clerkUserId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', clerkUserId)
      .single();

    if (error) {
      return {
        data: null,
        error: new Error(error.message),
        authorized: false,
      };
    }

    // Verify the user ID matches (defense in depth)
    if (data && data.clerk_id !== clerkUserId) {
      return {
        data: null,
        error: new Error('Unauthorized: User ID mismatch'),
        authorized: false,
      };
    }

    return {
      data,
      error: null,
      authorized: true,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
      authorized: false,
    };
  }
}

/**
 * Get TradingView username for a specific Clerk user ID
 * Only returns username if the userId matches the clerk_id
 */
export async function getTradingViewUsername(clerkUserId: string) {
  try {
    // Always log in production for debugging
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Always log for debugging (both dev and prod)
    console.log('getTradingViewUsername: Fetching username for clerk_id:', clerkUserId);
    console.log('getTradingViewUsername: Environment:', {
      nodeEnv: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...' || 'Missing'
    });
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('tradingview_username, clerk_id')
      .eq('clerk_id', clerkUserId)
      .maybeSingle();

    // Always log query result
    console.log('getTradingViewUsername: Query result:', { 
      hasData: !!data, 
      hasError: !!error, 
      errorCode: error?.code,
      errorMessage: error?.message,
      username: data?.tradingview_username,
      clerkId: data?.clerk_id,
      queryClerkId: clerkUserId,
      dataMatch: data?.clerk_id === clerkUserId
    });

    // If no data found, check if user exists with different clerk_id or needs to be created
    if (!data && !error) {
      console.log('getTradingViewUsername: No user found with clerk_id:', clerkUserId);
      console.log('getTradingViewUsername: Checking all users in database...');
      
      // Debug: Check what users exist
      const { data: allUsers, error: allUsersError } = await supabaseAdmin
        .from('users')
        .select('clerk_id, email, tradingview_username')
        .limit(10);
      
      console.log('getTradingViewUsername: All users in database:', {
        hasAllUsers: !!allUsers,
        allUsersError: allUsersError?.message,
        usersCount: allUsers?.length || 0,
        clerkIds: allUsers?.map(u => u.clerk_id) || [],
        searchingFor: clerkUserId
      });
    }

    if (error) {
      // PGRST116 is "no rows returned" - user doesn't exist yet
      if (error.code === 'PGRST116') {
        if (isProduction) {
          console.log('getTradingViewUsername: User does not exist yet (PGRST116)');
        }
        return {
          data: null,
          error: null,
          authorized: true, // User doesn't exist, but request is authorized
        };
      }
      if (isProduction) {
        console.error('getTradingViewUsername: Database error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      }
      return {
        data: null,
        error: new Error(error.message),
        authorized: false,
      };
    }

    // If no data returned, user doesn't exist
    if (!data) {
      if (isProduction) {
        console.log('getTradingViewUsername: No data returned (user does not exist)');
      }
      return {
        data: null,
        error: null,
        authorized: true, // User doesn't exist, but request is authorized
      };
    }

    // Verify the user ID matches
    if (data.clerk_id !== clerkUserId) {
      if (isProduction) {
        console.error('getTradingViewUsername: User ID mismatch!', {
          expected: clerkUserId,
          found: data.clerk_id
        });
      }
      return {
        data: null,
        error: new Error('Unauthorized: User ID mismatch'),
        authorized: false,
      };
    }

    if (isProduction) {
      console.log('getTradingViewUsername: Successfully retrieved username:', data.tradingview_username);
    }
    return {
      data: data.tradingview_username || null,
      error: null,
      authorized: true,
    };
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      console.error('getTradingViewUsername: Unexpected error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        errorType: error instanceof Error ? error.constructor.name : typeof error
      });
    }
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
      authorized: false,
    };
  }
}

/**
 * Update TradingView username for a specific Clerk user ID
 * Only updates if the userId matches the clerk_id
 */
export async function updateTradingViewUsername(
  clerkUserId: string,
  username: string
) {
  try {
    // First, verify the user exists and the ID matches
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id, clerk_id')
      .eq('clerk_id', clerkUserId)
      .single();

    if (checkError || !existingUser) {
      return {
        data: null,
        error: new Error('User not found'),
        authorized: false,
      };
    }

    // Verify the user ID matches
    if (existingUser.clerk_id !== clerkUserId) {
      return {
        data: null,
        error: new Error('Unauthorized: User ID mismatch'),
        authorized: false,
      };
    }

    // Update the username
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        tradingview_username: username,
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_id', clerkUserId)
      .eq('id', existingUser.id)
      .select('tradingview_username')
      .single();

    if (error) {
      return {
        data: null,
        error: new Error(error.message),
        authorized: false,
      };
    }

    return {
      data: data?.tradingview_username || null,
      error: null,
      authorized: true,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
      authorized: false,
    };
  }
}

/**
 * Get subscription data for a specific Clerk user ID
 * Only returns subscription if it belongs to the user
 */
export async function getUserSubscription(clerkUserId: string) {
  try {
    console.log('🔍 getUserSubscription: Fetching subscription for clerkUserId:', clerkUserId);
    
    // Debug: Check all subscriptions in the table to see what exists
    const { data: allSubscriptions } = await supabaseAdmin
      .from('user_subscriptions')
      .select('user_id, plan_id, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    console.log('🔍 getUserSubscription: All subscriptions in table (first 10):', {
      count: allSubscriptions?.length || 0,
      subscriptions: allSubscriptions?.map(sub => ({
        user_id: sub.user_id,
        plan_id: sub.plan_id,
        status: sub.status,
        created_at: sub.created_at,
      })),
      lookingFor: clerkUserId,
    });
    
    // Get subscription directly from user_subscriptions table using Clerk user ID
    // This table is updated by Stripe webhooks when payments are completed
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('plan_id, status, stripe_customer_id, stripe_subscription_id, created_at, updated_at, user_id')
      .eq('user_id', clerkUserId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log('🔍 getUserSubscription: Query result:', {
      hasSubscription: !!subscription,
      hasError: !!subError,
      errorMessage: subError?.message,
      subscriptionData: subscription ? {
        plan_id: subscription.plan_id,
        status: subscription.status,
        user_id: subscription.user_id,
        created_at: subscription.created_at,
      } : null,
    });

    if (subError) {
      console.error('❌ Error fetching subscription:', subError);
      // Return default subscription if error
      return {
        data: { plan_type: 'free', status: 'active' },
        error: null,
        authorized: true,
      };
    }

    // If no subscription found, return default free plan
    if (!subscription) {
      console.log('⚠️ No subscription found for user:', clerkUserId);
      return {
        data: { plan_type: 'free', status: 'active' },
        error: null,
        authorized: true,
      };
    }

    // Map plan_id to plan_type for dashboard compatibility
    // Handle legacy 'pro' -> 'premium' migration
    let planType = subscription.plan_id || 'free';
    if (planType === 'pro') {
      planType = 'premium'; // Migrate old 'pro' to 'premium'
    }
    
    console.log('✅ getUserSubscription: Returning subscription:', {
      plan_id: subscription.plan_id,
      plan_type: planType,
      status: subscription.status,
    });
    
    // plan_id: 'free', 'premium', 'ultimate' -> plan_type: 'free', 'premium', 'ultimate'
    return {
      data: {
        plan_type: planType, // Map plan_id to plan_type
        status: subscription.status || 'active',
        stripe_customer_id: subscription.stripe_customer_id,
        stripe_subscription_id: subscription.stripe_subscription_id,
        created_at: subscription.created_at,
        updated_at: subscription.updated_at,
      },
      error: null,
      authorized: true,
    };
  } catch (error) {
    console.error('❌ Error in getUserSubscription:', error);
    return {
      data: { plan_type: 'free', status: 'active' },
      error: error instanceof Error ? error : new Error('Unknown error'),
      authorized: true, // Return default subscription on error
    };
  }
}

/**
 * Verify that a Clerk user ID matches the data being accessed
 * This is a helper function for additional security checks
 */
export function verifyUserAccess(clerkUserId: string, dataClerkId: string | null | undefined): boolean {
  if (!dataClerkId) {
    return false;
  }
  return clerkUserId === dataClerkId;
}

/**
 * Pine Script Access Management Functions
 */

export interface PineScriptAccess {
  id: string;
  pine_id: string;
  script_name: string;
  tradingview_username: string;
  granted_at: string;
  expires_at?: string;
  status: 'active' | 'expired' | 'revoked';
  duration_type?: string;
  duration_number?: number;
}

/**
 * Get all Pine script access for a user
 */
export async function getUserPineScriptAccess(clerkUserId: string): Promise<DataAccessResult<PineScriptAccess[]>> {
  try {
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_id', clerkUserId)
      .single();

    if (userError || !user) {
      return {
        data: null,
        error: new Error('User not found'),
        authorized: false,
      };
    }

    const { data, error } = await supabaseAdmin
      .from('active_pine_access')
      .select(`
        id,
        pine_id,
        script_name,
        tradingview_username,
        granted_at,
        expires_at,
        status,
        duration_type,
        duration_number
      `)
      .eq('clerk_id', clerkUserId);

    if (error) {
      return {
        data: null,
        error: new Error(error.message),
        authorized: false,
      };
    }

    return {
      data: data || [],
      error: null,
      authorized: true,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
      authorized: false,
    };
  }
}

/**
 * Grant Pine script access to a user
 */
export async function grantPineScriptAccess(
  clerkUserId: string,
  pineId: string,
  tradingviewUsername: string,
  durationType?: string,
  durationNumber?: number
): Promise<DataAccessResult<string>> {
  try {
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_id', clerkUserId)
      .single();

    if (userError || !user) {
      return {
        data: null,
        error: new Error('User not found'),
        authorized: false,
      };
    }

    // Get or create Pine script
    let { data: script, error: scriptError } = await supabaseAdmin
      .from('pine_scripts')
      .select('id')
      .eq('pine_id', pineId)
      .single();

    if (scriptError || !script) {
      // Create the script if it doesn't exist
      const { data: newScript, error: createError } = await supabaseAdmin
        .from('pine_scripts')
        .insert({
          pine_id: pineId,
          name: `Script ${pineId}`,
          description: 'Auto-created Pine script',
        })
        .select('id')
        .single();

      if (createError || !newScript) {
        return {
          data: null,
          error: new Error(`Failed to create script: ${createError?.message}`),
          authorized: false,
        };
      }
      script = newScript;
    }

    // Calculate expiry date
    let expiresAt: string | null = null;
    if (durationType && durationType !== 'lifetime' && durationNumber) {
      const now = new Date();
      switch (durationType) {
        case 'd':
          now.setDate(now.getDate() + durationNumber);
          break;
        case 'w':
          now.setDate(now.getDate() + (durationNumber * 7));
          break;
        case 'm':
          now.setMonth(now.getMonth() + durationNumber);
          break;
      }
      expiresAt = now.toISOString();
    }

    // Insert or update access record
    const { data: accessData, error: accessError } = await supabaseAdmin
      .from('pine_script_access')
      .upsert({
        user_id: user.id,
        pine_script_id: script.id,
        tradingview_username: tradingviewUsername,
        expires_at: expiresAt,
        duration_type: durationType,
        duration_number: durationNumber,
        status: 'active',
      })
      .select('id')
      .single();

    if (accessError) {
      return {
        data: null,
        error: new Error(accessError.message),
        authorized: false,
      };
    }

    // Log the action
    await supabaseAdmin
      .from('pine_access_logs')
      .insert({
        user_id: user.id,
        pine_script_id: script.id,
        action: 'grant',
        tradingview_username: tradingviewUsername,
        pine_id: pineId,
        duration_type: durationType,
        duration_number: durationNumber,
        performed_by: clerkUserId,
      });

    return {
      data: accessData.id,
      error: null,
      authorized: true,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
      authorized: false,
    };
  }
}

/**
 * Revoke Pine script access for a user
 */
export async function revokePineScriptAccess(
  clerkUserId: string,
  pineId: string
): Promise<DataAccessResult<boolean>> {
  try {
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, tradingview_username')
      .eq('clerk_id', clerkUserId)
      .single();

    if (userError || !user) {
      return {
        data: null,
        error: new Error('User not found'),
        authorized: false,
      };
    }

    // Get the script
    const { data: script, error: scriptError } = await supabaseAdmin
      .from('pine_scripts')
      .select('id')
      .eq('pine_id', pineId)
      .single();

    if (scriptError || !script) {
      return {
        data: null,
        error: new Error('Script not found'),
        authorized: false,
      };
    }

    // Update access status to revoked
    const { error: updateError } = await supabaseAdmin
      .from('pine_script_access')
      .update({ status: 'revoked' })
      .eq('user_id', user.id)
      .eq('pine_script_id', script.id);

    if (updateError) {
      return {
        data: null,
        error: new Error(updateError.message),
        authorized: false,
      };
    }

    // Log the action
    await supabaseAdmin
      .from('pine_access_logs')
      .insert({
        user_id: user.id,
        pine_script_id: script.id,
        action: 'revoke',
        tradingview_username: user.tradingview_username || '',
        pine_id: pineId,
        performed_by: clerkUserId,
      });

    return {
      data: true,
      error: null,
      authorized: true,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
      authorized: false,
    };
  }
}

