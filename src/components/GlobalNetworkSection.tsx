'use client';

import { useEffect, useRef, useState } from 'react';

export default function GlobalNetworkSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldUseVideo, setShouldUseVideo] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const isSmallScreen = window.innerWidth < 768;
    const nav: any = navigator as any;
    const saveData = !!nav?.connection?.saveData;
    const effectiveType: string | undefined = nav?.connection?.effectiveType;
    const isSlowNetwork = effectiveType === '2g' || effectiveType === 'slow-2g';
    const disable = prefersReducedMotion || saveData || isSlowNetwork || isSmallScreen;
    setShouldUseVideo(!disable);
    if (disable) {
      setIsLoaded(true); // no spinner if we're not using video
      return;
    }

    const video = videoRef.current;
    if (video) {
      video.load();
      
      const handleCanPlay = () => {
        setIsLoaded(true);
        video.play().catch(err => console.log('Video autoplay failed:', err));
      };

      video.addEventListener('canplay', handleCanPlay);
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  return (
    <>
    <section className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {/* Video */}
      {shouldUseVideo ? (
        <video
          ref={videoRef}
          className={`w-full min-h-screen object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          src="/network/Phooen.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        />
      ) : (
        <div
          className="w-full min-h-screen"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, rgba(0, 221, 94, 0.14), transparent 55%), radial-gradient(circle at 85% 40%, rgba(255, 0, 0, 0.12), transparent 55%), linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,1))',
          }}
        />
      )}

      <div className="absolute inset-x-0 bottom-0 px-8 pb-16 sm:pb-20 pt-20 bg-gradient-to-t from-black via-black/85 to-transparent text-center">
        <div className="max-w-3xl mx-auto text-white">
          <p className="text-[#00dd5e] text-sm font-semibold mb-3 uppercase tracking-wider">
            Unbeatable Accuracy
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Price Level Precision
          </h2>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed pb-2">
            Zones are calculated with exact precision to specific price points, not rounded estimates. Get the accurate levels where point of interest actually exist for better entry and exit timing.
          </p>
        </div>
      </div>
    </section>

    </>
  );
}
