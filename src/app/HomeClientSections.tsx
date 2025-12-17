'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import BackgroundParticles from '@/components/BackgroundParticles';

// Lazy load below-the-fold sections
const FeaturesComponent = lazy(() => import('@/components/FeaturesComponent'));
const ServicesComponent = lazy(() => import('@/components/ServicesComponent'));
const GlobalNetworkSection = lazy(() => import('@/components/GlobalNetworkSection'));
const BentoGridComponent = lazy(() => import('@/components/BentoGridComponent'));
const PricingComponent = lazy(() => import('@/components/PricingComponent'));
const FAQComponent = lazy(() => import('@/components/FAQComponent'));

const SectionLoader = () => (
  <div className="min-h-[360px] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-gray-700 border-t-[#00DD5E] rounded-full animate-spin" />
  </div>
);

export default function HomeClientSections() {
  // Defer non-critical work until after first paint
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 300);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      {/* Background particles effect (internally skips mobile/slow connections) */}
      <BackgroundParticles />

      {/* Below the fold sections */}
      {ready && (
        <>
          <Suspense fallback={<SectionLoader />}>
            <FeaturesComponent />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <ServicesComponent />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <GlobalNetworkSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <BentoGridComponent />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <PricingComponent />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <FAQComponent />
          </Suspense>
        </>
      )}
    </>
  );
}


