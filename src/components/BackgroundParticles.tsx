'use client';

import { useState, useEffect } from 'react';

// Generate particles - only called on client side
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const baseOpacity = Math.random() * 0.3 + 0.1;
    return {
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 3000,
      opacity: baseOpacity,
    };
  });
};

export default function BackgroundParticles() {
  // Only generate particles on client side to avoid hydration mismatch
  const [particles, setParticles] = useState<Array<{
    id: number;
    top: string;
    left: string;
    size: number;
    delay: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    // Skip on reduced motion / data saver / small screens to improve mobile performance.
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;
    const nav: any = typeof navigator !== 'undefined' ? navigator : null;
    const saveData = !!nav?.connection?.saveData;
    const effectiveType: string | undefined = nav?.connection?.effectiveType;
    const isSlowNetwork = effectiveType === '2g' || effectiveType === 'slow-2g';

    if (prefersReducedMotion || saveData || isSlowNetwork || isSmallScreen) return;

    // Defer generation so first paint/LCP can happen without extra work.
    const timer = window.setTimeout(() => {
      setParticles(generateParticles(50));
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            top: particle.top,
            left: particle.left,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}ms`,
            animation: 'particlePulse 3s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  );
}
