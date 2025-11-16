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
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {/* Video */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        src="/network/Phooen.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
    </section>
  );
}
