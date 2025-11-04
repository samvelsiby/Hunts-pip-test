'use client';

import { SignUpButton } from "@clerk/nextjs";
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
              <span className="text-white">Enhance Your </span>
              <span className="text-green-400">Trading</span>
              <span className="text-white"> with</span>
              <br />
              <span className="text-white">Professional </span>
              <span className="text-red-500 font-bold">Trading Tools</span>
            </h1>
            
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
              Access powerful TradingView indicators designed to enhance your trading analysis and decision-making process.
            </p>
            
            <div className="pt-2 sm:pt-4">
              <SignUpButton>
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
              </SignUpButton>
            </div>
          </div>

          {/* Statistics Section */}
          <StatisticsSection />
        </div>
      </div>
    </main>
  );
}
