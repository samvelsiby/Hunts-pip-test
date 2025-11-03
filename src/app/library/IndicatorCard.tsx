'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor, getBlurDataURL } from '@/lib/sanity'

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
    free: <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">FREE</span>,
    premium: <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/30">PREMIUM</span>,
    ultimate: <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full border border-purple-500/30">ULTIMATE</span>,
  };
  
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/10 transition-all duration-300 h-full flex flex-col">
      {/* Card Header with Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {indicator.icon ? (
          <Image
            src={urlFor(indicator.icon).width(800).height(600).url()}
            alt=""
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={getBlurDataURL(indicator.icon)}
            priority
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-blue-900/50 to-purple-900/50"></div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/20"></div>
        
        {/* Plan Badge */}
        <div className="absolute top-4 right-4">
          {planBadges[indicator.planAccess]}
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-sm">{categoryIcons[indicator.category as keyof typeof categoryIcons]}</span>
          <span className="text-sm text-gray-400 capitalize">
            {indicator.category}
          </span>
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
            <button className="flex items-center gap-2 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
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

