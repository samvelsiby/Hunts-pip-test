'use client';

import Link from 'next/link';
import StatisticsSection from './StatisticsSection';

export default function HeroSection() {
  return (
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
              <span className="text-red-500 font-bold">BEST</span>
              <br />
              <span className="text-red-500 font-bold">TRADING STRATEGY</span>
            </h1>
            
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Aenean cursus elit nec dictum pharetra
            </p>
            
            <div className="pt-2 sm:pt-4">
              <Link href="/signup">
                <button 
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-white text-sm sm:text-base font-semibold rounded-full transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #DD0000 0%, #FF5B41 100%)',
                  }}
                >
                  Get Pivien
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>

          {/* Statistics Section */}
          <StatisticsSection />
        </div>
      </div>
    </main>
  );
}
