'use client';

import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';

export default function LoadingLogo() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 z-50">
      {/* Background particles effect - simplified version */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-white/15 rounded-full animate-pulse delay-1500"></div>
      <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-pink-500/30 rounded-full animate-pulse delay-700"></div>
      
      <div className="flex flex-col items-center">
        <div className="relative w-[180px] h-[48px] animate-pulse">
          <Image 
            src="/hunts-pip-logo.svg" 
            alt="HUNTS PIP Logo" 
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="mt-6 flex flex-col items-center gap-2">
          <Spinner className="size-8 text-blue-500" />
          <div className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
          
          </div>
        </div>
      </div>
    </div>
  );
}
