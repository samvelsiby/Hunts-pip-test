'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import MobileMenu from '@/components/MobileMenu';
import FooterComponent from '@/components/FooterComponent';
import { usePathname } from 'next/navigation';

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Skip navigation and footer for dashboard and auth pages
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  
  if (isDashboardPage || isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main>{children}</main>
      <FooterComponent />
    </div>
  );
}
