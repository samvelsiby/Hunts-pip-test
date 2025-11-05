import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Get authenticated Supabase client for server-side use
 * This client uses the anon key and respects RLS policies
 * It sets the Clerk user ID in a header for RLS policies to use
 */
export async function getAuthenticatedSupabaseClient() {
  const { userId } = await auth();
  
  if (!userId) {
    // Return unauthenticated client if no user
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  // Create Supabase client with Clerk user ID in custom header
  // RLS policies will use this header to identify the user
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        'x-clerk-user-id': userId,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabase;
}

