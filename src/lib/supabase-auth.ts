"use client";

import { supabaseBrowser } from './supabase-browser';
import { User } from '@supabase/supabase-js';

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  tradingview_username?: string | null;
  created_at: string;
  updated_at: string;
  expires_at?: string | null;
}

/**
 * Get the current user's subscription data
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const { data, error } = await supabaseBrowser
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserSubscription:', error);
    return null;
  }
}

/**
 * Create a subscription for a new user
 */
export async function createUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const { data, error } = await supabaseBrowser
      .from('user_subscriptions')
      .insert({ 
        user_id: userId, 
        plan_id: 'free', 
        status: 'active' 
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user subscription:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createUserSubscription:', error);
    return null;
  }
}

/**
 * Update a user's TradingView username
 */
export async function updateTradingViewUsername(
  subscriptionId: string, 
  tradingViewUsername: string
): Promise<boolean> {
  try {
    const { error } = await supabaseBrowser
      .from('user_subscriptions')
      .update({ tradingview_username: tradingViewUsername.trim() })
      .eq('id', subscriptionId);
    
    if (error) {
      console.error('Error updating TradingView username:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateTradingViewUsername:', error);
    return false;
  }
}

/**
 * Update a user's subscription plan
 */
export async function updateSubscriptionPlan(
  userId: string,
  planId: string,
  status: string = 'active'
): Promise<UserSubscription | null> {
  try {
    // Check if subscription exists
    const { data: existingSubscription } = await supabaseBrowser
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (existingSubscription) {
      // Update existing subscription
      const { data, error } = await supabaseBrowser
        .from('user_subscriptions')
        .update({ 
          plan_id: planId, 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubscription.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating subscription plan:', error);
        return null;
      }
      
      return data;
    } else {
      // Create new subscription
      return await createUserSubscription(userId);
    }
  } catch (error) {
    console.error('Error in updateSubscriptionPlan:', error);
    return null;
  }
}

/**
 * Ensure user has a subscription record
 * This should be called after authentication to make sure the user has a subscription record
 */
export async function ensureUserSubscription(user: User): Promise<UserSubscription | null> {
  try {
    const subscription = await getUserSubscription(user.id);
    
    if (subscription) {
      return subscription;
    }
    
    // Create a new subscription if one doesn't exist
    return await createUserSubscription(user.id);
  } catch (error) {
    console.error('Error in ensureUserSubscription:', error);
    return null;
  }
}
