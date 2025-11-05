/**
 * Data Access Layer
 * 
 * This module provides secure data access functions that enforce
 * access control at the application level. Since we're using Clerk
 * for authentication and Supabase for data storage, we implement
 * access control in the application layer rather than relying solely
 * on RLS policies.
 * 
 * All functions in this module ensure that users can only access
 * their own data by verifying the Clerk user ID matches the data
 * being accessed.
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
    console.log('getTradingViewUsername: Fetching username for clerk_id:', clerkUserId);
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('tradingview_username, clerk_id')
      .eq('clerk_id', clerkUserId)
      .maybeSingle();

    console.log('getTradingViewUsername: Query result:', { 
      hasData: !!data, 
      hasError: !!error, 
      errorCode: error?.code,
      errorMessage: error?.message,
      username: data?.tradingview_username,
      clerkId: data?.clerk_id
    });

    if (error) {
      // PGRST116 is "no rows returned" - user doesn't exist yet
      if (error.code === 'PGRST116') {
        console.log('getTradingViewUsername: User does not exist yet (PGRST116)');
        return {
          data: null,
          error: null,
          authorized: true, // User doesn't exist, but request is authorized
        };
      }
      console.error('getTradingViewUsername: Database error:', error);
      return {
        data: null,
        error: new Error(error.message),
        authorized: false,
      };
    }

    // If no data returned, user doesn't exist
    if (!data) {
      console.log('getTradingViewUsername: No data returned (user does not exist)');
      return {
        data: null,
        error: null,
        authorized: true, // User doesn't exist, but request is authorized
      };
    }

    // Verify the user ID matches
    if (data.clerk_id !== clerkUserId) {
      console.error('getTradingViewUsername: User ID mismatch!', {
        expected: clerkUserId,
        found: data.clerk_id
      });
      return {
        data: null,
        error: new Error('Unauthorized: User ID mismatch'),
        authorized: false,
      };
    }

    console.log('getTradingViewUsername: Successfully retrieved username:', data.tradingview_username);
    return {
      data: data.tradingview_username || null,
      error: null,
      authorized: true,
    };
  } catch (error) {
    console.error('getTradingViewUsername: Unexpected error:', error);
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
    // First, get the user's Supabase ID
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, clerk_id')
      .eq('clerk_id', clerkUserId)
      .single();

    if (userError || !user) {
      return {
        data: { plan_type: 'free', status: 'active' },
        error: null,
        authorized: true, // Return default subscription
      };
    }

    // Verify the user ID matches
    if (user.clerk_id !== clerkUserId) {
      return {
        data: null,
        error: new Error('Unauthorized: User ID mismatch'),
        authorized: false,
      };
    }

    // Get subscription for this user
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('plan_type, status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError) {
      return {
        data: { plan_type: 'free', status: 'active' },
        error: null,
        authorized: true, // Return default subscription
      };
    }

    return {
      data: {
        plan_type: subscription?.plan_type || 'free',
        status: subscription?.status || 'active',
      },
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
 * Verify that a Clerk user ID matches the data being accessed
 * This is a helper function for additional security checks
 */
export function verifyUserAccess(clerkUserId: string, dataClerkId: string | null | undefined): boolean {
  if (!dataClerkId) {
    return false;
  }
  return clerkUserId === dataClerkId;
}

