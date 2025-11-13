'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

interface Indicator {
  _id: string
  title: string
  slug: { current: string }
  description: string
  category: string
  icon?: unknown
  features?: string[]
  planAccess: 'free' | 'premium' | 'ultimate'
  tradingViewLink?: string
  order: number
}

export default function IndicatorCard({ indicator }: { indicator: Indicator }) {
  const planColors = {
    free: '#6B7280',      // Gray
    premium: '#DC2626',   // Red
    ultimate: '#00DD5E',  // Green
  };

  const borderColor = planColors[indicator.planAccess];
  
  // Convert hex to rgba for glow effect
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  // Glow effect based on plan type
  const glowStyle = {
    boxShadow: `0 0 20px ${hexToRgba(borderColor, 0.25)}, 0 0 40px ${hexToRgba(borderColor, 0.15)}, 0 0 60px ${hexToRgba(borderColor, 0.1)}`,
  };
  
  const hoverGlowStyle = {
    boxShadow: `0 0 30px ${hexToRgba(borderColor, 0.4)}, 0 0 60px ${hexToRgba(borderColor, 0.25)}, 0 0 90px ${hexToRgba(borderColor, 0.15)}`,
  };
  
  return (
    <Link href={`/library/${indicator.slug.current}`} className="block h-full">
      <div 
        className="rounded-3xl transition-all duration-300 h-full flex flex-col bg-[#0A0A0A] relative hover:scale-[1.02] cursor-pointer group"
        style={{
          border: '1px solid #374151',
          ...glowStyle,
        }}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, hoverGlowStyle);
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, glowStyle);
        }}
      >
        {/* Card Header with Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
          {indicator.icon ? (
            <Image
              src={urlFor(indicator.icon).width(800).height(600).url()}
              alt=""
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full" style={{ background: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}></div>
          )}
        </div>
        
        {/* Card Content with colored bottom border and inner glow */}
        <div 
          className="p-6 flex-1 flex flex-col rounded-b-3xl relative"
          style={{
            borderLeft: `1px solid ${borderColor}`,
            borderRight: `1px solid ${borderColor}`,
            borderBottom: `1px solid ${borderColor}`,
            marginLeft: '-1px',
            marginRight: '-1px',
            marginBottom: '-1px',
            background: `linear-gradient(180deg, ${hexToRgba(borderColor, 0.12)} 0%, ${hexToRgba(borderColor, 0.05)} 30%, transparent 100%)`,
            boxShadow: `inset 0 20px 40px ${hexToRgba(borderColor, 0.2)}, inset 0 10px 20px ${hexToRgba(borderColor, 0.15)}`,
          }}
        >
          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-2">
            {indicator.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-400 text-sm line-clamp-2">
            {indicator.description}
          </p>
        </div>
      </div>
    </Link>
  )
}

