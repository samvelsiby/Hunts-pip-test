'use client';

import { useState } from "react";
import BackgroundParticles from '@/components/BackgroundParticles';
import Navigation from '@/components/Navigation';
import MobileMenu from '@/components/MobileMenu';
import HeroSection from '@/components/HeroSection';
import TrustedPartnersComponent from '@/components/TrustedPartnersComponent';
import FeaturesComponent from '@/components/FeaturesComponent';
import DevicesComponent from '@/components/DevicesComponent';
import MoneyBackGuaranteeComponent from '@/components/MoneyBackGuaranteeComponent';
import PricingComponent from '@/components/PricingComponent';
import FAQComponent from '@/components/FAQComponent';
import FooterComponent from '@/components/FooterComponent';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background particles effect */}
      <BackgroundParticles />

      {/* Navigation */}
      <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

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

      {/* Footer */}
      <FooterComponent />
    </div>
  );
}
