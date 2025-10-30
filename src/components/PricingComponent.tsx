'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Get started with basic features',
    features: [
      'Basic trading signals',
      'Limited keyword access',
      'Community support',
      'Basic analytics'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 30,
    description: 'Advanced features for serious traders',
    features: [
      'Advanced trading signals',
      'Unlimited keyword access',
      'Priority support',
      'Advanced analytics',
      'Custom alerts',
      'Mobile app access'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 50,
    description: 'Complete trading solution',
    features: [
      'All Pro features',
      'AI-powered insights',
      '24/7 premium support',
      'Custom strategies',
      'API access',
      'White-label options',
      'Personal account manager'
    ]
  }
];

export default function PricingComponent() {
  const { user, isLoaded } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    if (!isLoaded || !user) {
      // Redirect to sign-in page instead of showing alert
      window.location.href = `/sign-in?redirect_url=${encodeURIComponent(`/dashboard?plan=${planId}`)}`;
      return;
    }

    setSelectedPlan(planId);
    setIsLoading(true);

    try {
      // Redirect directly to dashboard after selecting a plan
      console.log('User selected plan:', planId, 'redirecting to dashboard');
      window.location.href = `/dashboard?plan=${planId}`;
    } catch (error) {
      console.error('Error selecting plan:', error);
      // Show a more user-friendly error without browser alert
      setIsLoading(false);
      setSelectedPlan(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-20 px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your <span className="text-green-400">Trading</span> Plan
          </h2>
          <p className="text-gray-400 text-lg">
            Select the perfect plan to boost your trading success
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-gray-900 rounded-xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? 'border-green-400 shadow-lg shadow-green-400/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  {plan.price > 0 && <span className="text-gray-400">/month</span>}
                </div>
                <p className="text-gray-400">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isLoading && selectedPlan === plan.id}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-green-400 text-black hover:bg-green-500'
                    : plan.id === 'free'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                } ${
                  isLoading && selectedPlan === plan.id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading && selectedPlan === plan.id ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  plan.id === 'free' ? 'Get Started Free' : `Subscribe for $${plan.price}`
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400">
            All plans include our core trading signals and keyword access
          </p>
        </div>
      </div>
    </div>
  );
}
