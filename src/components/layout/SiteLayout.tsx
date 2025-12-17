'use client';

import { useState, useEffect } from 'react';
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
  
  // Scroll to top on page change/refresh
  useEffect(() => {
    // Avoid non-standard scroll behavior values (e.g. "instant") which can cause janky scrolling on mobile.
    // Let Next/Browser manage scroll restoration naturally; only force a safe jump to top when needed.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  // Prevent background scroll when mobile menu is open (reduces scroll glitches on iOS)
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);
  
  // Skip navigation and footer for dashboard and auth pages
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  
  if (isDashboardPage || isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black relative">
      <div className="fixed inset-0 bg-linear-to-br from-gray-900 via-black to-gray-900 pointer-events-none -z-10"></div>
      <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="relative z-0">{children}</main>
      <FooterComponent />
    </div>
  );
}
