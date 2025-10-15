'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
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

const planDetails = {
  free: { name: 'Free', price: 0, features: ['Basic signals', 'Limited access'] },
  pro: { name: 'Pro', price: 30, features: ['Advanced signals', 'Unlimited access', 'Priority support'] },
  premium: { name: 'Premium', price: 50, features: ['All Pro features', 'AI insights', '24/7 support', 'Custom strategies'] }
};

function PaymentContent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') || 'free';
  
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handlePayment = async () => {
    if (!isLoaded || !user) {
      alert('Please sign in to continue');
      return;
    }

    setIsProcessing(true);

    try {
      if (planId === 'free') {
        // Handle free plan
        if (subscription) {
          // Update existing subscription
          const { error } = await supabase
            .from('user_subscriptions')
            .update({ plan_id: 'free', status: 'active' })
            .eq('id', subscription.id);

          if (error) throw error;
        } else {
          // Create new subscription
          const { error } = await supabase
            .from('user_subscriptions')
            .insert({
              user_id: user.id,
              plan_id: 'free',
              status: 'active'
            });

          if (error) throw error;
        }

        alert('Free plan activated successfully!');
        router.push('/dashboard');
      } else {
        // Handle paid plans - redirect to Stripe checkout
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId,
            userId: user.id,
            userEmail: user.emailAddresses[0]?.emailAddress,
          }),
        });

        const { url } = await response.json();
        if (url) {
          window.location.href = url;
        } else {
          alert('Payment processing failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
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

  const plan = planDetails[planId as keyof typeof planDetails];

  return (
    <div className="min-h-screen bg-black py-20 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Complete Your <span className="text-green-400">{plan.name}</span> Subscription
          </h1>
          <p className="text-gray-400 text-lg">
            You&apos;re almost ready to start trading with our premium signals
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Plan Summary */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Plan Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Plan</span>
                <span className="text-white font-semibold">{plan.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Price</span>
                <span className="text-white font-semibold">
                  {plan.price === 0 ? 'Free' : `$${plan.price}/month`}
                </span>
              </div>
              {subscription?.tradingview_username && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">TradingView Username</span>
                  <span className="text-blue-400 font-semibold">{subscription.tradingview_username}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">What&apos;s Included:</h3>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>
            
            {plan.price === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Free Plan</h3>
                <p className="text-gray-400 mb-6">No payment required for the free plan</p>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-3 px-6 bg-green-400 text-black font-semibold rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Activating...' : 'Activate Free Plan'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Dummy Payment Form</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    This is a demo payment form. In production, this would integrate with Stripe.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                        disabled
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-3 px-6 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay $${plan.price}/month`
                  )}
                </button>

                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Secure payment powered by Stripe
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white underline"
          >
            ← Back to Plans
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
      <PaymentContent />
    </Suspense>
  );
}
