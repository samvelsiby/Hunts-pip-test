'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <main className="relative z-10 min-h-screen flex items-center overflow-hidden bg-black">
      {/* Spline 3D Scene - Background - Always visible, no loading state */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <iframe
          src="https://my.spline.design/untitled-d20Iy1Eu6FRqsx4QVnJnsIfT/"
          frameBorder="0"
          width="100%"
          height="100%"
          loading="eager"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ border: 'none', display: 'block', transform: 'translateX(-15%)' }}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 px-4 sm:px-8 w-full pointer-events-none">
        <div className="max-w-7xl mx-auto w-full py-20">
          <div className="max-w-3xl">
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
            <p className="text-gray-300 text-lg sm:text-xl font-light max-w-lg mt-6">
              Powered by Neural Networks<br />
              and Machine Learning
            </p>

            {/* CTA Button */}
            <div className="pt-8 pointer-events-auto">
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
