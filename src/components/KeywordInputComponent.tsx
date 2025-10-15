'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  keyword?: string;
  created_at: string;
}

export default function KeywordInputComponent() {
  const { user, isLoaded } = useUser();
  const [keyword, setKeyword] = useState('');
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUserSubscription = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      if (data) {
        setSubscription(data);
        setKeyword(data.keyword || '');
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

  const handleSaveKeyword = async () => {
    if (!keyword.trim()) {
      alert('Please enter a keyword');
      return;
    }

    if (!isLoaded || !user) {
      alert('Please sign in to continue');
      return;
    }

    setIsSaving(true);

    try {
      if (subscription) {
        // Update existing subscription
        const { error } = await supabase
          .from('user_subscriptions')
          .update({ keyword: keyword.trim() })
          .eq('id', subscription.id);

        if (error) throw error;
      } else {
        // Create new subscription (free plan by default)
        const { error } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_id: 'free',
            status: 'active',
            keyword: keyword.trim()
          });

        if (error) throw error;
      }

      alert('Keyword saved successfully!');
      fetchUserSubscription(); // Refresh data
    } catch (error) {
      console.error('Error saving keyword:', error);
      alert('Failed to save keyword. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
              Welcome, <span className="text-green-400">{user.firstName || 'Trader'}</span>!
            </h2>
            <p className="text-gray-400">
              Enter your trading keyword to get started with personalized signals
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-300 mb-2">
                Trading Keyword
              </label>
              <input
                type="text"
                id="keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter your trading keyword (e.g., BTC, ETH, AAPL)"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                disabled={isSaving}
              />
              <p className="text-sm text-gray-500 mt-2">
                This keyword will be used to generate personalized trading signals for you.
              </p>
            </div>

            {subscription && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Current Subscription</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-300">Plan: <span className="text-green-400 capitalize">{subscription.plan_id}</span></p>
                    <p className="text-gray-300">Status: <span className="text-green-400">{subscription.status}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">
                      Joined: {new Date(subscription.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSaveKeyword}
              disabled={isSaving || !keyword.trim()}
              className="w-full py-3 px-6 bg-green-400 text-black font-semibold rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                subscription ? 'Update Keyword' : 'Save Keyword & Start Free Plan'
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Want more features?{' '}
                <a href="/pricing" className="text-green-400 hover:text-green-300 underline">
                  Upgrade your plan
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
