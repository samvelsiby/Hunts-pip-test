'use client';

import BackgroundParticles from '@/components/BackgroundParticles';
import HeroSection from '@/components/HeroSection';
import FeaturesComponent from '@/components/FeaturesComponent';
import BentoGridComponent from '@/components/BentoGridComponent';
import ServicesComponent from '@/components/ServicesComponent';
import MoneyBackGuaranteeComponent from '@/components/MoneyBackGuaranteeComponent';
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

      {/* Bento Grid Section */}
      <BentoGridComponent />

      {/* Services Section */}
      <ServicesComponent />

      {/* Money-Back Guarantee Section */}
      <MoneyBackGuaranteeComponent />

      {/* Pricing Section */}
      <PricingComponent />

      {/* FAQ Section */}
      <FAQComponent />
    </div>
  );
}
