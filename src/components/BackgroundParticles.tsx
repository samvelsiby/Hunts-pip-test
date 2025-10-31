'use client';

export default function BackgroundParticles() {
  return (
    <div className="absolute inset-0">
      <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-2000"></div>
      <div className="absolute top-80 right-1/3 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-white/15 rounded-full animate-pulse delay-1500"></div>
      <div className="absolute bottom-60 right-10 w-1 h-1 bg-white/25 rounded-full animate-pulse delay-3000"></div>
      <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-pink-500/30 rounded-full animate-pulse delay-700"></div>
      <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-2500"></div>
    </div>
  );
}
