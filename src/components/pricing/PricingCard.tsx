'use client';

import { PricingTier } from "@/config/pricing";
import { cn } from "@/lib/utils";
import { useSupabaseUser } from "@/lib/useSupabaseUser";
import { useState } from "react";

export const PricingCard = ({
  tier,
  paymentFrequency,
}: {
  tier: PricingTier;
  paymentFrequency: string;
}) => {
  const { user, loading } = useSupabaseUser();
  const [isLoading, setIsLoading] = useState(false);
  
  const price = tier.price[paymentFrequency];
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;

  const handleSelectPlan = async () => {
    if (loading || !user) {
      window.location.href = `/login?redirect_url=${encodeURIComponent(`/payment?plan=${tier.id}&frequency=${paymentFrequency}`)}`;
      return;
    }

    setIsLoading(true);
    try {
      window.location.href = `/payment?plan=${tier.id}&frequency=${paymentFrequency}`;
    } catch (error) {
      console.error('Error selecting plan:', error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col gap-6 overflow-visible rounded-2xl border p-6 shadow transition-all duration-300 hover:shadow-lg",
        isHighlighted
          ? "border-blue-500/50 bg-gray-900 shadow-blue-500/10"
          : "border-gray-800 bg-gray-900/50",
        isPopular && "border-green-500/50 shadow-green-500/10",
        isPopular && "pt-10",
      )}
    >
      {/* Background Decoration - Needs overflow-hidden for rounded corners */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {isHighlighted && (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[45px_45px] opacity-100 mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        )}
        {isPopular && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.1),rgba(255,255,255,0))]" />
        )}
      </div>

      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-green-500 text-black px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      {/* Card Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{tier.name}</h2>
        <div className="mb-4">
          <span className="text-4xl font-bold text-white">
            ${typeof price === 'number' ? price : 0}
          </span>
          {price !== 0 && <span className="text-gray-400">/month</span>}
        </div>
        <p className="text-gray-400">{tier.description}</p>
      </div>

      {/* Features */}
      <div className="flex-1 space-y-4">
        <ul className="space-y-3">
          {tier.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center text-gray-300"
            >
              <svg className="w-5 h-5 text-green-400 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Call to Action Button */}
      <button
        onClick={handleSelectPlan}
        disabled={isLoading}
        className={cn(
          "w-full py-3 px-6 rounded-lg font-semibold transition-colors",
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
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          tier.cta
        )}
      </button>
    </div>
  );
};
