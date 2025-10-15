'use client';

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import PricingComponent from '@/components/PricingComponent';

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background particles effect */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-white/15 rounded-full animate-pulse delay-1500"></div>
        <div className="absolute bottom-60 right-10 w-1 h-1 bg-white/25 rounded-full animate-pulse delay-3000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-black font-bold text-lg">{`{}`}</span>
          </div>
          <span className="text-white text-xl font-bold">MUNTS PIP</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-1 text-white hover:text-gray-300 cursor-pointer">
            <span>Library</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <Link href="/pricing" className="text-white hover:text-gray-300">Pricing</Link>
          <Link href="/testimonials" className="text-white hover:text-gray-300">Testimonials</Link>
        </div>

        <div className="flex items-center gap-4">
          <AuthButtons />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="text-green-400 text-lg font-medium">
                  Automate. Your. Life
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Stay <span className="text-green-400">PROFITABLE</span> as a trader with our{" "}
                  <span className="text-red-500">BEST TRADING STRATEGY</span>
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus elit nec dictum pharetra. 
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <SignUpButton>
                  <button className="px-8 py-4 bg-red-500 text-white text-lg font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                    Get Pivien →
                  </button>
                </SignUpButton>
              </div>
            </div>

            {/* Right side - Placeholder for image/graphic */}
            <div className="hidden lg:block">
              <div className="w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p>Trading Strategy Visual</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Statistics Section */}
      <section className="relative z-10 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Satisfied Users */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-white mb-2">3,000+</div>
              <div className="text-gray-400">Satisfied user</div>
            </div>

            {/* Rating */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-4xl font-bold text-white mb-2">4.8</div>
              <div className="text-gray-400">Rating</div>
            </div>

            {/* Funds Managed */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-white mb-2">20+ M</div>
              <div className="text-gray-400">Funds Managed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Integrated directly into the main page */}
      <PricingComponent />

      {/* Footer */}
      <footer className="relative z-10 px-8 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            Our trusted partners and companies, relying on our safe services.
          </p>
        </div>
      </footer>
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
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard"
          className="px-4 py-2 text-white border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Dashboard
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <SignInButton>
      <button className="px-6 py-2 text-white border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors">
        Login
      </button>
    </SignInButton>
  );
}
