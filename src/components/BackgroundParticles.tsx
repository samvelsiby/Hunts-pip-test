'use client';

import { useState, useEffect } from 'react';

export default function BackgroundParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    top: string;
    left: string;
    size: number;
    delay: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    // Generate many particles for a starry effect
    const generatedParticles = Array.from({ length: 100 }, (_, i) => {
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
    setParticles(generatedParticles);
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
