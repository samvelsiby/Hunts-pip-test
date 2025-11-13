'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const LaserFlow = dynamic(() => import('./LaserFlow'), { ssr: false });

export default function HeroSection() {
  return (
    <main className="relative min-h-screen flex items-center overflow-hidden">
      {/* LaserFlow Background */}
      <div className="absolute inset-0 z-0">
        <LaserFlow
          color="#FF79C6"
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0.0}
          flowSpeed={0.35}
          verticalSizing={2.0}
          horizontalSizing={0.5}
          fogIntensity={0.45}
          wispDensity={1}
          wispSpeed={15.0}
          wispIntensity={5.0}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-8 py-20 sm:py-32 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="space-y-6 max-w-3xl">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-white">GET </span>
              <span className="text-red-500">ACCESS</span>
              <span className="text-white"> TO</span>
              <br />
              <span className="text-white">INVISIBLE INSIGHTS</span>
              <br />
              <span className="text-white">IN MARKET</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-lg sm:text-xl font-light max-w-lg">
              Powered by Neural Networks<br />
              and Machine Learning
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Link href="/library">
                <button 
                  className="px-7 py-3.5 text-white text-base font-semibold rounded-full transition-all flex items-center gap-2 hover:scale-105 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #DD0000 0%, #FF5B41 100%)',
                  }}
                >
                  View Product Library
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
