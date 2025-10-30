'use client';

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import PricingComponent from '@/components/PricingComponent';
import TrustedPartnersComponent from '@/components/TrustedPartnersComponent';
import FeaturesComponent from '@/components/FeaturesComponent';
import DevicesComponent from '@/components/DevicesComponent';
import MoneyBackGuaranteeComponent from '@/components/MoneyBackGuaranteeComponent';
import FAQComponent from '@/components/FAQComponent';
import FooterComponent from '@/components/FooterComponent';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background particles effect */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-white/15 rounded-full animate-pulse delay-1500"></div>
        <div className="absolute bottom-60 right-10 w-1 h-1 bg-white/25 rounded-full animate-pulse delay-3000"></div>
        <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-pink-500/30 rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-2500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-8 lg:px-12 py-4 border-b border-gray-800/50">
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
          <div className="flex items-center gap-1 text-white hover:text-gray-300 cursor-pointer text-sm">
            <span>Library</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <Link href="/pricing" className="text-white hover:text-gray-300 text-sm">Pricing</Link>
          <Link href="/testimonials" className="text-white hover:text-gray-300 text-sm">Testimonials</Link>
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-8">
            <div className="flex items-center gap-2 text-white hover:text-gray-300 cursor-pointer text-lg">
              <span>Library</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <Link 
              href="/pricing" 
              className="text-white hover:text-gray-300 text-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/testimonials" 
              className="text-white hover:text-gray-300 text-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <div onClick={() => setMobileMenuOpen(false)}>
              <AuthButtons />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="relative z-10 px-4 sm:px-8 py-8 sm:py-12 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {/* Hero Content */}
            <div className="space-y-4 sm:space-y-6 max-w-3xl">
              <div className="text-green-400 text-sm sm:text-base lg:text-lg font-medium">
                Automate. Your. Life
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Stay </span>
                <span className="text-green-400">PROFITABLE</span>
                <span className="text-white"> as a</span>
                <br />
                <span className="text-white">trader with our </span>
                <span className="text-red-500">BEST</span>
                <br />
                <span className="text-red-500">TRADING STRATEGY</span>
              </h1>
              
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Aenean cursus elit nec dictum pharetra
              </p>
              
              <div className="pt-2 sm:pt-4">
                <SignUpButton>
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-red-500 text-white text-sm sm:text-base font-semibold rounded-full hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-500/30">
                    Get Pivien
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </SignUpButton>
              </div>
            </div>

            {/* Statistics in Hero */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-16 max-w-3xl pt-8 sm:pt-12">
              {/* Satisfied Users */}
              <div className="text-left">
                <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                  <div className="w-6 h-6 sm:w-10 sm:h-10 bg-white rounded-full"></div>
                  <div className="w-6 h-6 sm:w-10 sm:h-10 bg-white rounded-full -ml-2 sm:-ml-4"></div>
                  <div className="w-6 h-6 sm:w-10 sm:h-10 bg-white rounded-full -ml-2 sm:-ml-4"></div>
                </div>
                <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">3,000+</div>
                <div className="text-gray-400 text-xs sm:text-sm">Satisfied user</div>
              </div>

              {/* Rating */}
              <div className="text-left">
                <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">4.8</div>
                <div className="text-gray-400 text-xs sm:text-sm">Rating</div>
              </div>

              {/* Funds Managed */}
              <div className="text-left">
                <div className="mb-2 sm:mb-3">
                  <svg className="w-6 h-6 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">20+ M</div>
                <div className="text-gray-400 text-xs sm:text-sm">Funds Managed</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Trusted Partners Section */}
      <TrustedPartnersComponent />

      {/* Features Section */}
      <FeaturesComponent />

      {/* Devices Section */}
      <DevicesComponent />

      {/* Money-Back Guarantee Section */}
      <MoneyBackGuaranteeComponent />

      {/* Pricing Section - Integrated directly into the main page */}
      <PricingComponent />

      {/* FAQ Section */}
      <FAQComponent />

      {/* Footer */}
      <FooterComponent />
    </div>
  );
}

function AuthButtons() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>;
  }

  if (isSignedIn) {
    return (
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <Link 
          href="/dashboard"
          className="w-full lg:w-auto text-center px-5 py-2 text-white text-sm border border-gray-600 rounded-full hover:bg-gray-800 transition-colors"
        >
          Dashboard
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <SignInButton>
      <button className="w-full lg:w-auto px-6 py-2 text-white text-sm border border-gray-600 rounded-full hover:bg-gray-800 transition-colors">
        Login
      </button>
    </SignInButton>
  );
}
