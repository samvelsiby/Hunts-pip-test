'use client';

import { Suspense, lazy } from 'react';
import BackgroundParticles from '@/components/BackgroundParticles';
import HeroSection from '@/components/HeroSection';
import LoadingLogo from '@/components/LoadingLogo';

// Lazy load below-the-fold components for better initial page load
const FeaturesComponent = lazy(() => import('@/components/FeaturesComponent'));
const ServicesComponent = lazy(() => import('@/components/ServicesComponent'));
const GlobalNetworkSection = lazy(() => import('@/components/GlobalNetworkSection'));
const BentoGridComponent = lazy(() => import('@/components/BentoGridComponent'));
const PricingComponent = lazy(() => import('@/components/PricingComponent'));
const FAQComponent = lazy(() => import('@/components/FAQComponent'));

// Loading fallback component
const SectionLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-gray-700 border-t-[#00DD5E] rounded-full animate-spin" />
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background particles effect */}
      <BackgroundParticles />

      {/* Hero Section - Above the fold, load immediately */}
      <HeroSection />

      {/* Features Section - Lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <FeaturesComponent />
      </Suspense>

      {/* Services Section - Lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <ServicesComponent />
      </Suspense>

      {/* Global Network / World Map Section - Lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <GlobalNetworkSection />
      </Suspense>

      {/* Bento Grid Section - Lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <BentoGridComponent />
      </Suspense>

      {/* Pricing Section - Lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <PricingComponent />
      </Suspense>

      {/* FAQ Section - Lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <FAQComponent />
      </Suspense>
    </div>
  );
}
