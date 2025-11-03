/**
 * Supabase MCP client for managing database operations
 * This file provides utility functions for interacting with the Supabase MCP server
 */

import { supabaseBrowser } from './supabase-browser';

/**
 * Clean up user data in the database
 * This function removes any orphaned user_subscriptions records
 */
export async function cleanupUserSubscriptions() {
  try {
    // Get all user subscriptions
    const { data: subscriptions, error: fetchError } = await supabaseBrowser
      .from('user_subscriptions')
      .select('id, user_id');
    
    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError);
      return { success: false, error: fetchError.message };
    }
    
    // Get all authenticated users
    const { data: authData, error: authError } = await supabaseBrowser.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return { success: false, error: authError.message };
    }
    
    // Find orphaned subscriptions (subscriptions without a corresponding user)
    const userIds = new Set(authData.users.map(user => user.id));
    const orphanedSubscriptions = subscriptions.filter(sub => !userIds.has(sub.user_id));
    
    if (orphanedSubscriptions.length === 0) {
      return { success: true, message: 'No orphaned subscriptions found' };
    }
    
    // Delete orphaned subscriptions
    const orphanedIds = orphanedSubscriptions.map(sub => sub.id);
    const { error: deleteError } = await supabaseBrowser
      .from('user_subscriptions')
      .delete()
      .in('id', orphanedIds);
    
    if (deleteError) {
      console.error('Error deleting orphaned subscriptions:', deleteError);
      return { success: false, error: deleteError.message };
    }
    
    return { 
      success: true, 
      message: `Deleted ${orphanedSubscriptions.length} orphaned subscriptions` 
    };
  } catch (error) {
    console.error('Error in cleanupUserSubscriptions:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Ensure all users have subscription records
 * This function creates subscription records for any users that don't have one
 */
export async function ensureAllUserSubscriptions() {
  try {
    // Get all authenticated users
    const { data: authData, error: authError } = await supabaseBrowser.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return { success: false, error: authError.message };
    }
    
    // Get all user subscriptions
    const { data: subscriptions, error: fetchError } = await supabaseBrowser
      .from('user_subscriptions')
      .select('user_id');
    
    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError);
      return { success: false, error: fetchError.message };
    }
    
    // Find users without subscriptions
    const subscriptionUserIds = new Set(subscriptions.map(sub => sub.user_id));
    const usersWithoutSubscriptions = authData.users.filter(user => !subscriptionUserIds.has(user.id));
    
    if (usersWithoutSubscriptions.length === 0) {
      return { success: true, message: 'All users have subscription records' };
    }
    
    // Create subscription records for users without them
    const newSubscriptions = usersWithoutSubscriptions.map(user => ({
      user_id: user.id,
      plan_id: 'free',
      status: 'active'
    }));
    
    const { error: insertError } = await supabaseBrowser
      .from('user_subscriptions')
      .insert(newSubscriptions);
    
    if (insertError) {
      console.error('Error creating subscription records:', insertError);
      return { success: false, error: insertError.message };
    }
    
    return { 
      success: true, 
      message: `Created ${usersWithoutSubscriptions.length} subscription records` 
    };
  } catch (error) {
    console.error('Error in ensureAllUserSubscriptions:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
