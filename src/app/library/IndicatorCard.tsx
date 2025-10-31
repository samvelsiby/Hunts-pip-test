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
  icon?: any
  features?: string[]
  planAccess: 'free' | 'pro' | 'premium'
  tradingViewLink?: string
  order: number
}

export default function IndicatorCard({ indicator }: { indicator: Indicator }) {
  const planColors = {
    free: 'bg-green-500/10 text-green-400 border-green-500/20',
    pro: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    premium: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }

  const categoryIcons = {
    trend: '📈',
    momentum: '⚡',
    volatility: '📊',
    volume: '📦',
    custom: '⚙️',
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
      {/* Icon */}
      {indicator.icon ? (
        <div className="mb-4 w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
          <Image
            src={urlFor(indicator.icon).width(64).height(64).url()}
            alt={indicator.title}
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
      ) : (
        <div className="mb-4 w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl">
          {categoryIcons[indicator.category as keyof typeof categoryIcons] || '📊'}
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white">{indicator.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${planColors[indicator.planAccess]}`}>
            {indicator.planAccess.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-400 capitalize">
          {categoryIcons[indicator.category as keyof typeof categoryIcons]} {indicator.category}
        </p>
      </div>

      {/* Description */}
      <p className="text-gray-300 mb-4 line-clamp-3">
        {indicator.description}
      </p>

      {/* Features */}
      {indicator.features && indicator.features.length > 0 && (
        <div className="mb-4">
          <ul className="space-y-1">
            {indicator.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="text-sm text-gray-400 flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Link
          href={`/library/${indicator.slug.current}`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center"
        >
          View Details
        </Link>
        {indicator.tradingViewLink && (
          <a
            href={indicator.tradingViewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            title="Open in TradingView"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

