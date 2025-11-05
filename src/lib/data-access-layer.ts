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

