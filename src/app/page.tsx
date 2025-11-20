'use client';

import BackgroundParticles from '@/components/BackgroundParticles';
import HeroSection from '@/components/HeroSection';
import FeaturesComponent from '@/components/FeaturesComponent';
import BentoGridComponent from '@/components/BentoGridComponent';
import ServicesComponent from '@/components/ServicesComponent';
import GlobalNetworkSection from '@/components/GlobalNetworkSection';
import PricingComponent from '@/components/PricingComponent';
import FAQComponent from '@/components/FAQComponent';

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background particles effect */}
      <BackgroundParticles />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesComponent />

        {/* Services Section */}
      <ServicesComponent />

      {/* Global Network / World Map Section */}
      <GlobalNetworkSection />

      {/* Bento Grid Section */}
      <BentoGridComponent />

    

      {/* Pricing Section */}
      <PricingComponent />

      {/* FAQ Section */}
      <FAQComponent />
    </div>
  );
}
