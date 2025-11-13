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
  
  return (
    <Link href={`/library/${indicator.slug.current}`} className="block h-full">
      <div 
        className="rounded-3xl shadow-lg transition-all duration-300 h-full flex flex-col bg-[#0A0A0A] relative hover:scale-[1.02] cursor-pointer"
        style={{
          border: '2px solid #374151',
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
        
        {/* Card Content with colored bottom border */}
        <div 
          className="p-6 flex-1 flex flex-col rounded-b-3xl"
          style={{
            borderLeft: `2px solid ${borderColor}`,
            borderRight: `2px solid ${borderColor}`,
            borderBottom: `2px solid ${borderColor}`,
            marginLeft: '-2px',
            marginRight: '-2px',
            marginBottom: '-2px',
          }}
        >
          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-3">
            {indicator.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-400 text-base line-clamp-3 mb-4 flex-1">
            {indicator.description}
          </p>
          
          {/* View Now Button */}
          <button 
            className="px-6 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105"
            style={{
              backgroundColor: borderColor,
              color: '#000000',
            }}
          >
            View Now
          </button>
        </div>
      </div>
    </Link>
  )
}

