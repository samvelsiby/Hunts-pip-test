'use client';

import { useEffect, useRef, useState } from 'react';

export default function GlobalNetworkSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
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
        preload="auto"
      />

      <div className="absolute inset-x-0 bottom-0 px-8 pb-12 pt-20 bg-gradient-to-t from-black via-black/85 to-transparent text-center translate-y-8 sm:translate-y-14">
        <div className="max-w-3xl mx-auto text-white">
          <p className="text-[#00dd5e] text-sm font-semibold mb-3 uppercase tracking-wider">
            Unbeatable Accuracy
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Price Level Precision
          </h2>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            Zones are calculated with exact precision to specific price points, not rounded estimates. Get the accurate levels where point of interest actually exist for better entry and exit timing.
          </p>
        </div>
      </div>
    </section>

    </>
  );
}
