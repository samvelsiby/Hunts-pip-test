"use client";

import { useState } from 'react';

interface TradingViewButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function TradingViewButton({ href, children }: TradingViewButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center"
      style={{
        background: isHovered
          ? 'linear-gradient(135deg, #FF5B41 0%, #DD0000 100%)'
          : 'linear-gradient(135deg, #DD0000 0%, #FF5B41 100%)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </a>
  );
}

