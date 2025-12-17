'use client';

import { PricingTier } from "@/config/pricing";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";
import { SubscriptionExistsModal } from "@/components/SubscriptionExistsModal";
import { DowngradeToFreeModal } from "@/components/DowngradeToFreeModal";

export const PricingCard = ({
  tier,
  paymentFrequency,
}: {
  tier: PricingTier;
  paymentFrequency: string;
}) => {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>('');
  
  const price = tier.price[paymentFrequency];
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;

  const numericPrice = typeof price === 'number' ? price : Number(price) || 0;
  const displayPrice = typeof price === 'number'
    ? price.toFixed(2)
    : price;

  const isFreeTier = tier.id === 'free';
  const isPremiumTier = tier.id === 'premium';
  const isUltimateTier = tier.id === 'ultimate';

  const cardBorderClass = isUltimateTier
    ? "border-[#00FF66]/25 lg:border-[#00FF66]"
    : isPremiumTier
      ? "border-[#FF3B3B]/25 lg:border-[#FF3B3B]/60"
      : "border-[#4B5563]/25 lg:border-[#6B7280]/70";

  const gradientClass = isUltimateTier
    ? "bg-[radial-gradient(circle_at_top_left,#17D960,transparent_65%)]"
    : isPremiumTier
      ? "bg-[radial-gradient(circle_at_top_left,#FF3B3B,transparent_65%)]"
      : "bg-[radial-gradient(circle_at_top_left,#6B7280,transparent_65%)]";

  const buttonBaseClass = isUltimateTier
    ? "bg-[linear-gradient(90deg,#3DFF7C,#00E152)] text-black hover:brightness-110"
    : isPremiumTier
      ? "bg-[#FF3B3B] text-white hover:bg-[#e73030] shadow-[0_0_25px_rgba(255,59,59,0.45)]"
      : "bg-[#E5E7EB] text-black hover:bg-[#d4d4d8]";

  const logoFilterClass = isUltimateTier
    ? ""
    : isPremiumTier
      ? ""
      : "grayscale opacity-80";

  const logoSrc = isPremiumTier
    ? "/piricing/redlogo.svg"
    : "/piricing/greenlogo.svg";

  const hoverShadowClass = isUltimateTier
    ? "hover:shadow-[0_0_35px_rgba(0,255,120,0.35)]"
    : isPremiumTier
      ? "hover:shadow-[0_0_35px_rgba(248,113,113,0.45)]"
      : "hover:shadow-[0_0_35px_rgba(148,163,184,0.45)]";

  const scaleClass = isPremiumTier ? "lg:scale-100" : "lg:scale-95";

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
          
          // If user has a paid subscription, guide them to manage it
          if ((error.requiresPortal || error.requiresContact) && error.currentPlan) {
            setCurrentPlan(error.currentPlan);
            setShowDowngradeModal(true);
            setIsLoading(false);
            return;
          }
          
          alert(error.error || error.message || 'Failed to activate free plan');
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
          
          // If user already has a subscription, guide them to manage it
          if ((error.requiresPortal || error.requiresContact) && error.currentPlan) {
            setCurrentPlan(error.currentPlan);
            setShowSubscriptionModal(true);
            setIsLoading(false);
            return;
          }
          
          // Show user-friendly error messages for other errors
          if (error.message) {
            alert(error.message);
          } else if (error.error) {
            alert(error.error);
          } else {
            alert('Failed to create checkout session. Please try again.');
          }
          
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
    <>
      {/* Subscription Exists Modal */}
      <SubscriptionExistsModal
        open={showSubscriptionModal}
        onOpenChangeAction={setShowSubscriptionModal}
        currentPlan={currentPlan}
      />

      {/* Downgrade to Free Modal */}
      <DowngradeToFreeModal
        open={showDowngradeModal}
        onOpenChangeAction={setShowDowngradeModal}
        currentPlan={currentPlan}
      />

      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-[24px] border bg-[#050505] px-6 py-6 sm:px-8 sm:py-8 transition-all duration-300 transform",
          cardBorderClass,
          scaleClass,
          hoverShadowClass,
        )}
      >
        {/* Background Decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]">
          <div className={cn("absolute -top-16 -left-16 w-[260px] h-[260px] rounded-full opacity-90", gradientClass)} />
          <Image
            src="/piricing/garyed logo.svg"
            alt="Pricing background logo"
            width={220}
            height={200}
            className="absolute right-[-40px] top-[-10px] w-[220px] h-[200px] opacity-[0.18] object-contain"
          />
        </div>

        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute top-4 right-5 z-10">
            <span className="bg-[#FA9B9B] text-black px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Most popular
            </span>
          </div>
        )}

        {/* Card Content */}
        <div className="relative z-10 flex h-full flex-col gap-6">
          {/* Card Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <Image
                src={logoSrc}
                alt={`${tier.name} plan logo`
                }
                width={64}
                height={64}
                className={cn("w-12 h-12 sm:w-14 sm:h-14 object-contain", logoFilterClass)}
                priority={isHighlighted}
              />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {tier.name}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base max-w-xs">
                {tier.description}
              </p>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-white">
                ${typeof displayPrice === 'string' ? displayPrice : numericPrice.toFixed(2)}
              </span>
              {numericPrice !== 0 && (
                <span className="text-gray-400 text-sm mb-0.5">/month</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleSelectPlan}
              disabled={isLoading}
              className={cn(
                "w-full rounded-full py-2.5 text-sm font-semibold transition-colors",
                buttonBaseClass,
                isLoading && "opacity-60 cursor-not-allowed",
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </div>
              ) : (
                tier.cta
              )}
            </button>
          </div>

          {/* Features */}
          <div className="mt-4 flex-1">
            <ul className="space-y-2">
              {tier.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center text-gray-300 text-sm"
                >
                  <span className="mr-3 flex h-5 w-5 items-center justify-center">
                    <Image
                      src="/piricing/tick.svg"
                      alt="Included feature"
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                  </span>
                  <span className="flex-1">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
