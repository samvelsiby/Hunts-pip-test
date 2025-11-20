"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingLogo from './LoadingLogo';

const SPLINE_EMBED_URL = 'https://my.spline.design/untitled-d20Iy1Eu6FRqsx4QVnJnsIfT/';

export default function HeroSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Load Spline with optimized lazy loading
  useEffect(() => {
    // Small delay to allow initial page render for better performance
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);


  return (
    <main className="relative z-10 min-h-screen flex items-center overflow-hidden bg-black">
      {/* Loading State */}
      {isLoading && <LoadingLogo />}
      
      {/* Spline 3D Scene - Background */}
      <div className="absolute inset-0 w-full h-full">
        {shouldLoad && (
          <iframe
            src={SPLINE_EMBED_URL}
            title="Hunts Pip hero Spline scene"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            className={`w-full h-full border-0 transition-opacity duration-500 transform -translate-y-10 sm:-translate-y-16 lg:-translate-y-20 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-56 sm:w-64 h-40 bg-black pointer-events-none" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full pointer-events-none">
        <div className="max-w-7xl mx-auto min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 pt-24 pb-10 sm:pt-28 sm:pb-4 text-center">
          <div className="space-y-3 sm:space-y-2 w-full">
          
            
            <h1 className="text-[1.8rem] sm:text-[3rem] lg:text-[4rem] font-extrabold leading-tight text-white">
              <span className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 whitespace-normal sm:whitespace-nowrap text-center">
                <span className="text-white tracking-[0.15em]">GET</span>
                <div className="relative inline-flex items-center justify-center px-5 sm:px-7 py-1 sm:py-1.5 uppercase tracking-[0.2em] sm:tracking-[0.25em] font-extrabold text-white mt-2 sm:mt-0">
                  <div className="absolute inset-0 border border-[#E60012] bg-gradient-to-r from-[#8B0000] via-[#C40000] to-[#FF1A00] opacity-90" />
                  <div className="absolute -left-2 -top-2 w-3 h-3 border-2 border-[#E60012]" />
                  <div className="absolute -right-2 -top-2 w-3 h-3 border-2 border-[#E60012]" />
                  <div className="absolute -left-2 -bottom-2 w-3 h-3 border-2 border-[#E60012]" />
                  <div className="absolute -right-2 -bottom-2 w-3 h-3 border-2 border-[#E60012]" />
                  <span
                    className="relative z-10 text-white tracking-[0.3em]"
                    style={{ animation: 'accessShift 2.4s ease-in-out infinite' }}
                  >
                    ACCESS
                  </span>
                </div>
                <span className="text-white tracking-[0.15em] sm:tracking-[0.2em]">TO INVISIBLE</span>
              </span>
              <span className="block mt-3 text-white tracking-[0.2em] sm:tracking-[0.25em] uppercase">INSIGHTS IN MARKET</span>
            </h1>
          </div>

          {/* CTA Button */}
          <div className="pt-6 pointer-events-auto w-full flex justify-center">
            <Link href="/library">
              <button
                className="px-8 sm:px-10 py-3 text-white text-base font-semibold rounded-full transition-transform flex items-center gap-2 hover:scale-105 shadow-[0_15px_45px_rgba(255,0,0,0.45)]"
                style={{
                  background: 'linear-gradient(135deg, #FF0000 0%, #FF4D00 100%)',
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
    </main>
  );
}
