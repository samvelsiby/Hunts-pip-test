'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function LoadingLogo() {
  const [progress, setProgress] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    // Force scroll to top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 z-[9999]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00DD5E]/5 via-[#FF0000]/5 to-[#00DD5E]/5 animate-pulse"></div>
      
      {/* Floating particles */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-[#00DD5E]/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-[#FF0000]/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-[#00DD5E]/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-[#FF0000]/40 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
      <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-[#00DD5E]/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      
      <div className="flex flex-col items-center relative z-10">
        {/* Logo with scale and glow animation */}
        <div className="relative w-[200px] h-[54px] mb-8">
          <div className="absolute inset-0 bg-[#00DD5E]/20 blur-2xl rounded-lg animate-pulse"></div>
          <div className="relative w-full h-full" style={{ animation: 'logoScale 2s ease-in-out infinite' }}>
            <Image 
              src="/hunts-pip-logo.svg" 
              alt="HUNTS PIP Logo" 
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(0,221,94,0.5)]"
              priority
            />
          </div>
        </div>
        
        {/* Progress bar with gradient */}
        <div className="w-64 h-1.5 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-[#00DD5E] via-[#00DD5E]/80 to-[#FF0000] rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            {/* Shimmer effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ animation: 'shimmer 2s infinite' }}
            ></div>
          </div>
        </div>
        
        {/* Loading text */}
        <p className="mt-4 text-gray-400 text-sm font-medium tracking-wider animate-pulse">
          LOADING...
        </p>
      </div>
    </div>
  );
}
