"use client";

import Link from 'next/link';
import { useState } from 'react';

interface PurchaseButtonProps {
  href: string;
  themeColor: string;
  children: React.ReactNode;
}

export default function PurchaseButton({ href, themeColor, children }: PurchaseButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Convert hex to rgba for glow effects
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:scale-105"
      style={{
        background: `linear-gradient(135deg, ${themeColor} 0%, ${hexToRgba(themeColor, 0.8)} 100%)`,
        boxShadow: isHovered
          ? `0 0 30px ${hexToRgba(themeColor, 0.6)}, 0 0 60px ${hexToRgba(themeColor, 0.4)}`
          : `0 0 20px ${hexToRgba(themeColor, 0.4)}, 0 0 40px ${hexToRgba(themeColor, 0.2)}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}

