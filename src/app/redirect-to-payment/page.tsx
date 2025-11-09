'use client';

import { useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { getPaymentLink } from '@/config/payment-links';

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

      // Handle paid tiers - get payment link
      const paymentLink = getPaymentLink(tier, frequency);
      
      if (!paymentLink) {
        console.error('Payment link not found for:', tier, frequency);
        alert('Payment link not found for this plan. Please contact support.');
        router.push('/pricing');
        return;
      }

      // Construct payment URL with user info
      const userEmail = user.emailAddresses?.[0]?.emailAddress;
      const url = new URL(paymentLink);
      
      if (userEmail) {
        url.searchParams.set('prefilled_email', userEmail);
      }
      
      url.searchParams.set('client_reference_id', user.id);

      // Redirect to Stripe Payment Link
      window.location.href = url.toString();
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

