'use client';

import Link from "next/link";
import Image from "next/image";
import AuthButtons from './AuthButtons';

interface NavigationProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Navigation({ mobileMenuOpen, setMobileMenuOpen }: NavigationProps) {
  return (
    <nav className="relative z-50 flex items-center justify-between px-4 sm:px-8 lg:px-12 py-4 bg-black/50 backdrop-blur-sm">
      {/* Logo - Always on the left */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Image 
          src="/hunts-pip-logo.svg" 
          alt="HUNTS PIP Logo" 
          width={120} 
          height={32}
          className="sm:w-[150px] sm:h-[40px]"
          priority
        />
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-8">
        <Link href="/library" className="text-white hover:text-gray-300 text-sm">
          Library
        </Link>
        <Link href="/pricing" className="text-white hover:text-gray-300 text-sm">Pricing</Link>
        <AuthButtons />
      </div>

      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
    </nav>
  );
}
