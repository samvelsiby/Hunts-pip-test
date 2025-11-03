'use client';

import BackgroundParticles from '@/components/BackgroundParticles';
import HeroSection from '@/components/HeroSection';
import TrustedPartnersComponent from '@/components/TrustedPartnersComponent';
import FeaturesComponent from '@/components/FeaturesComponent';
import DevicesComponent from '@/components/DevicesComponent';
import MoneyBackGuaranteeComponent from '@/components/MoneyBackGuaranteeComponent';
import PricingComponent from '@/components/PricingComponent';
import FAQComponent from '@/components/FAQComponent';

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Corner gradient */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #DD0000 0%, #FF5B41 50%, transparent 70%)',
          }}
        />
      </div>
      
      {/* Background particles effect */}
      <BackgroundParticles />

      {/* Hero Section */}
      <HeroSection />

      {/* Trusted Partners Section */}
      <TrustedPartnersComponent />

      {/* Features Section */}
      <FeaturesComponent />

      {/* Devices Section */}
      <DevicesComponent />

      {/* Money-Back Guarantee Section */}
      <MoneyBackGuaranteeComponent />

      {/* Pricing Section */}
      <PricingComponent />

      {/* FAQ Section */}
      <FAQComponent />
    </div>
  );
}
