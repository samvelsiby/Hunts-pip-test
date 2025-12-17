'use client';

import { useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function RedirectToPaymentContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const tier = searchParams.get('tier');
    const frequency = searchParams.get('frequency');

    // If no plan info, redirect to pricing
    if (!tier || !frequency) {
      router.push('/pricing');
      return;
    }

    // If user is not logged in, redirect to sign-in with plan info
    if (!user) {
      router.push(`/sign-in?tier=${encodeURIComponent(tier)}&frequency=${encodeURIComponent(frequency)}`);
      return;
    }

    // User is logged in, construct payment link and redirect
    if (!isRedirecting) {
      setIsRedirecting(true);
      
      // Handle free tier
      if (tier === 'free') {
        // Call subscribe-free API
        fetch('/api/subscribe-free', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId: tier,
          }),
        })
          .then((response) => {
            if (response.ok) {
              router.push('/dashboard?subscription=active');
            } else {
              response.json().then((error) => {
                console.error('Failed to activate free plan:', error);
                alert(error.error || 'Failed to activate free plan');
                router.push('/pricing');
              });
            }
          })
          .catch((error) => {
            console.error('Error activating free plan:', error);
            alert('Something went wrong. Please try again.');
            router.push('/pricing');
          });
        return;
      }

      // Handle paid tiers - create Stripe Checkout Session
      fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: tier,
          frequency: frequency,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const error = await response.json();
            console.error('Failed to create checkout session:', error);
            alert(error.error || 'Failed to create checkout session. Please try again.');
            router.push('/pricing');
            return;
          }

          return response.json();
        })
        .then((data) => {
          if (!data) return;
          
          console.log('Checkout session created:', data);

          if (data.url) {
            // Redirect to Stripe Checkout
            window.location.href = data.url;
          } else {
            console.error('No checkout URL returned');
            alert('Failed to create checkout session. Please try again.');
            router.push('/pricing');
          }
        })
        .catch((error) => {
          console.error('Error creating checkout session:', error);
          alert('Something went wrong. Please try again.');
          router.push('/pricing');
        });
    }
  }, [user, isLoaded, searchParams, router, isRedirecting]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#00dd5e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-sm">Redirecting to payment...</p>
      </div>
    </div>
  );
}

export default function RedirectToPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00dd5e] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <RedirectToPaymentContent />
    </Suspense>
  );
}

