'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import MobileMenu from '@/components/MobileMenu';

export default function ClientNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <>
      <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
