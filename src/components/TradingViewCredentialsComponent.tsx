'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  keyword?: string;
  tradingview_username?: string;
  created_at: string;
}

export default function TradingViewCredentialsComponent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  
  const [tradingViewUsername, setTradingViewUsername] = useState('');
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUserSubscription = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      if (data) {
        setSubscription(data);
        setTradingViewUsername(data.tradingview_username || '');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserSubscription();
    }
  }, [isLoaded, user, fetchUserSubscription]);

  const handleSaveCredentials = async () => {
    if (!tradingViewUsername.trim()) {
      alert('Please enter your TradingView username');
      return;
    }

    if (!isLoaded || !user) {
      alert('Please sign in to continue');
      return;
    }

    setIsSaving(true);

    try {
      console.log('Saving credentials for user:', user.id);
      console.log('TradingView username:', tradingViewUsername.trim());
      console.log('Plan ID:', planId);

      if (subscription) {
        // Update existing subscription
        console.log('Updating existing subscription:', subscription.id);
        const { data, error } = await supabase
          .from('user_subscriptions')
          .update({ 
            tradingview_username: tradingViewUsername.trim(),
            plan_id: planId || subscription.plan_id
          })
          .eq('id', subscription.id)
          .select();

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Update successful:', data);
      } else {
        // Create new subscription
        console.log('Creating new subscription');
        const { data, error } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_id: planId || 'free',
            status: 'active',
            tradingview_username: tradingViewUsername.trim()
          })
          .select();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Insert successful:', data);
      }

      // Redirect to payment page
      router.push(`/payment?plan=${planId || 'free'}`);
    } catch (error) {
      console.error('Error saving credentials:', error);
      
      // More detailed error message
      let errorMessage = 'Failed to save TradingView credentials. ';
      if (error instanceof Error) {
        errorMessage += `Error: ${error.message}`;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage += `Error: ${JSON.stringify(error)}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkipToPayment = () => {
    // Use the existing username and proceed to payment
    router.push(`/payment?plan=${planId || 'free'}`);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Sign In</h2>
          <p className="text-gray-400">You need to be signed in to access this feature.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20 px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              TradingView <span className="text-green-400">Credentials</span>
            </h2>
            <p className="text-gray-400">
              {subscription?.tradingview_username 
                ? "Confirm your TradingView username to continue" 
                : "Enter your TradingView username to get personalized trading signals"
              }
            </p>
          </div>

          <div className="space-y-6">
            {/* Show existing username confirmation */}
            {subscription?.tradingview_username && (
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-blue-400">Existing TradingView Username Found</h3>
                </div>
                <p className="text-gray-300 mb-3">
                  You already have a TradingView username saved: <span className="text-blue-400 font-semibold">{subscription.tradingview_username}</span>
                </p>
                <p className="text-gray-400 text-sm">
                  Is this the username you want to use for your subscription?
                </p>
              </div>
            )}

            <div>
              <label htmlFor="tradingview-username" className="block text-sm font-medium text-gray-300 mb-2">
                TradingView Username
              </label>
              <input
                type="text"
                id="tradingview-username"
                value={tradingViewUsername}
                onChange={(e) => setTradingViewUsername(e.target.value)}
                placeholder={subscription?.tradingview_username ? "Update your TradingView username" : "Enter your TradingView username"}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                disabled={isSaving}
              />
              <p className="text-sm text-gray-500 mt-2">
                {subscription?.tradingview_username 
                  ? "You can update your username if needed, or keep the existing one."
                  : "This username will be used to grant you access to premium TradingView indicators."
                }
              </p>
            </div>

            {subscription && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Current Subscription</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-300">Plan: <span className="text-green-400 capitalize">{subscription.plan_id}</span></p>
                    <p className="text-gray-300">Status: <span className="text-green-400">{subscription.status}</span></p>
                    {subscription.tradingview_username && (
                      <p className="text-gray-300">TradingView: <span className="text-blue-400">{subscription.tradingview_username}</span></p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSaveCredentials}
                disabled={isSaving || !tradingViewUsername.trim()}
                className="flex-1 py-3 px-6 bg-green-400 text-black font-semibold rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : subscription?.tradingview_username ? (
                  'Confirm & Continue to Payment'
                ) : (
                  'Save & Continue to Payment'
                )}
              </button>

              {subscription?.tradingview_username && (
                <button
                  onClick={handleSkipToPayment}
                  className="flex-1 py-3 px-6 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Use Existing Username
                </button>
              )}
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Don&apos;t have a TradingView account?{' '}
                <a 
                  href="https://www.tradingview.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 underline"
                >
                  Create one here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
