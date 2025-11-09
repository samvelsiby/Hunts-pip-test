'use client';

import { PricingTier } from "@/config/pricing";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export const PricingCard = ({
  tier,
  paymentFrequency,
}: {
  tier: PricingTier;
  paymentFrequency: string;
}) => {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  const price = tier.price[paymentFrequency];
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;

  const handleSelectPlan = async (e?: React.MouseEvent) => {
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log('Button clicked:', { tierId: tier.id, paymentFrequency, isLoaded, hasUser: !!user });

    // Check if user is logged in
    if (!isLoaded || !user) {
      console.log('User not logged in, redirecting to sign-in with plan info');
      // Redirect to sign-in with plan info, which will redirect to payment after login
      window.location.href = `/sign-in?tier=${encodeURIComponent(tier.id)}&frequency=${encodeURIComponent(paymentFrequency)}`;
      return;
    }

    setIsLoading(true);
    
    try {
      // Handle free tier - subscribe directly without payment
      if (tier.id === 'free') {
        console.log('Handling free tier subscription');
        const response = await fetch('/api/subscribe-free', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId: tier.id,
          }),
        });

        if (response.ok) {
          console.log('Free plan activated, redirecting to dashboard');
          window.location.href = '/dashboard?subscription=active';
        } else {
          const error = await response.json();
          console.error('Failed to activate free plan:', error);
          alert(error.error || 'Failed to activate free plan');
          setIsLoading(false);
        }
        return;
      }

      // Handle paid tiers - create Stripe Checkout Session
      console.log('Creating checkout session for:', tier.id, paymentFrequency);
      
      try {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId: tier.id,
            frequency: paymentFrequency,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Failed to create checkout session:', error);
          alert(error.error || 'Failed to create checkout session. Please try again.');
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        console.log('Checkout session created:', data);

        if (data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url;
        } else {
          console.error('No checkout URL returned');
          alert('Failed to create checkout session. Please try again.');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error creating checkout session:', error);
        alert('Something went wrong. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
      alert('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 overflow-visible rounded-xl border p-5 shadow transition-all duration-300 hover:shadow-lg",
        isHighlighted
          ? "border-blue-500/50 bg-gray-900 shadow-blue-500/10"
          : "border-gray-800 bg-gray-900/50",
        isPopular && "border-green-500/50 shadow-green-500/10",
        isPopular && "pt-8", // Add padding-top when popular to make room for badge
      )}
    >
      {/* Background Decoration - Needs overflow-hidden for rounded corners */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        {isHighlighted && (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[45px_45px] opacity-100 mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        )}
        {isPopular && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.1),rgba(255,255,255,0))]" />
        )}
      </div>

      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      {/* Card Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">{tier.name}</h2>
        <div className="mb-3">
          <span className="text-3xl font-bold text-white">
            ${typeof price === 'number' ? price : 0}
          </span>
          {price !== 0 && <span className="text-gray-400 text-sm">/month</span>}
        </div>
        <p className="text-gray-400 text-sm">{tier.description}</p>
      </div>

      {/* Features */}
      <div className="flex-1">
        <ul className="space-y-2">
          {tier.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start text-gray-300 text-sm"
            >
              <svg className="w-4 h-4 text-green-400 mr-2.5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="flex-1">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Call to Action Button */}
      <button
        type="button"
        onClick={handleSelectPlan}
        disabled={isLoading}
        className={cn(
          "w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors relative z-10 mt-2",
          isHighlighted
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : isPopular
              ? "bg-green-500 text-black hover:bg-green-600"
              : "bg-gray-800 text-white hover:bg-gray-700",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          tier.cta
        )}
      </button>
    </div>
  );
};
