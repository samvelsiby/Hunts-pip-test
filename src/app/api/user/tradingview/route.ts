import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getTradingViewUsername } from '@/lib/data-access-layer';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to access your TradingView username.' },
        { status: 401 }
      );
    }

    // Use data access layer to get username (enforces access control)
    const result = await getTradingViewUsername(userId);
    
    if (!result.authorized) {
      return NextResponse.json(
        { error: result.error?.message || 'Unauthorized access' },
        { status: 403 }
      );
    }

    if (result.error) {
      return NextResponse.json(
        { error: 'Failed to get TradingView username' },
        { status: 500 }
      );
    }

    // Return the username (can be null if not set)
    return NextResponse.json({ 
      username: result.data 
    });
  } catch (error) {
    console.error('Error getting TradingView username:', error);
    return NextResponse.json(
      { error: 'Failed to get TradingView username' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    console.log('PATCH /api/user/tradingview - User ID:', userId);
    
    if (!userId) {
      console.error('Unauthorized: No userId found');
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to update your TradingView username.', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username } = body;

    console.log('PATCH request body:', { username, userId });

    // Validate username
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return NextResponse.json(
        { error: 'TradingView username is required and cannot be empty', success: false },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();

    // First, check if user exists in Supabase
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id, tradingview_username, clerk_id')
      .eq('clerk_id', userId)
      .maybeSingle();

    console.log('User check result:', { existingUser, checkError });

    // If user doesn't exist, create them first
    if (checkError || !existingUser) {
      console.log('User does not exist, creating new user...');
      
      // Get user email from Clerk
      const user = await currentUser();
      if (!user) {
        console.error('Cannot get user from Clerk');
        return NextResponse.json(
          { error: 'Unable to retrieve user information. Please try again.', success: false },
          { status: 500 }
        );
      }

      const primaryEmail = user.emailAddresses?.[0]?.emailAddress;
      if (!primaryEmail) {
        console.error('No email found in Clerk user');
        return NextResponse.json(
          { error: 'User email not found. Please ensure your account has an email address.', success: false },
          { status: 400 }
        );
      }

      // User doesn't exist in Supabase yet - create them
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          clerk_id: userId,
          email: primaryEmail,
          first_name: user.firstName || null,
          last_name: user.lastName || null,
          tradingview_username: trimmedUsername,
          tradingview_verified: false,
        })
        .select('tradingview_username')
        .single();

      if (createError) {
        console.error('Error creating user in Supabase:', createError);
        console.error('Create error details:', JSON.stringify(createError, null, 2));
        return NextResponse.json(
          { error: `Failed to create user account: ${createError.message}`, success: false },
          { status: 500 }
        );
      }

      console.log('User created successfully:', newUser);
      return NextResponse.json({ 
        success: true, 
        username: newUser.tradingview_username 
      });
    }

    // Verify user has access (defense in depth)
    if (existingUser.clerk_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: User ID mismatch', success: false },
        { status: 403 }
      );
    }

    // User exists - update their TradingView username
    console.log(`Updating TradingView username for user ${userId} from "${existingUser.tradingview_username}" to "${trimmedUsername}"`);
    
    const { data: updatedUsers, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        tradingview_username: trimmedUsername,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_id', userId)
      .eq('id', existingUser.id)
      .select('tradingview_username');

    console.log('Update result:', { updatedUsers, updateError });

    if (updateError) {
      console.error('Error updating TradingView username:', updateError);
      console.error('Update error details:', JSON.stringify(updateError, null, 2));
      return NextResponse.json(
        { error: `Failed to update TradingView username: ${updateError.message}`, success: false },
        { status: 500 }
      );
    }

    // Check if any rows were updated
    if (!updatedUsers || updatedUsers.length === 0) {
      console.error(`No rows updated for user ${userId} (Supabase ID: ${existingUser.id})`);
      return NextResponse.json(
        { error: 'User not found or no changes made. Please try again.', success: false },
        { status: 404 }
      );
    }

    const updatedUser = updatedUsers[0];
    console.log(`Successfully updated TradingView username to: ${updatedUser.tradingview_username}`);

    return NextResponse.json({ 
      success: true, 
      username: updatedUser.tradingview_username 
    });
  } catch (error) {
    console.error('Error updating TradingView username:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return NextResponse.json(
      { error: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`, success: false },
      { status: 500 }
    );
  }
}
