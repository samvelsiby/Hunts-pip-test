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
  const categoryIcons = {
    trend: '📈',
    momentum: '⚡',
    volatility: '📊',
    volume: '📦',
    custom: '⚙️',
  };

  const planBadges = {
    free: <span className="px-2 py-1 text-xs font-semibold rounded-full border-2" style={{ background: 'rgba(0, 221, 94, 0.2)', color: '#00dd5e', borderColor: '#00dd5e' }}>FREE</span>,
    premium: <span className="px-2 py-1 text-xs font-semibold rounded-full border-2" style={{ background: 'rgba(255, 0, 0, 0.2)', color: '#ff0000', borderColor: '#ff0000' }}>PREMIUM</span>,
    ultimate: <span className="px-2 py-1 text-xs font-semibold rounded-full border-2" style={{ background: 'rgba(255, 0, 0, 0.3)', color: '#ff0000', borderColor: '#00dd5e' }}>ULTIMATE</span>,
  };
  
  return (
    <div className="rounded-xl overflow-hidden shadow-lg transition-all duration-300 h-full flex flex-col border-2" style={{ 
      background: 'linear-gradient(135deg, rgba(0, 221, 94, 0.1) 0%, rgba(0, 221, 94, 0.05) 30%, rgba(255, 0, 0, 0.05) 70%, rgba(255, 0, 0, 0.1) 100%)',
      borderColor: 'rgba(0, 221, 94, 0.3)',
      boxShadow: '0 4px 6px -1px rgba(0, 221, 94, 0.1), 0 2px 4px -1px rgba(255, 0, 0, 0.1)'
    }}>
      {/* Card Header with Image */}
      <div className="relative h-48 w-full overflow-hidden">
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
      
      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category and Plan Badge */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <span className="text-sm">{categoryIcons[indicator.category as keyof typeof categoryIcons]}</span>
            <span className="text-sm text-gray-400 capitalize">
              {indicator.category}
            </span>
          </div>
          {/* Plan Badge */}
          <div>
            {planBadges[indicator.planAccess]}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2">
          {indicator.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-300 text-sm line-clamp-2 mb-4 flex-1">
          {indicator.description}
        </p>
        
        {/* Action Button */}
        <div className="flex justify-end mt-auto pt-2">
          <Link href={`/library/${indicator.slug.current}`}>
            <button className="flex items-center gap-2 text-sm font-medium transition-all hover:scale-105" style={{ color: '#00dd5e' }}>
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

