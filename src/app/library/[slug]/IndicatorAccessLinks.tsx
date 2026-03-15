'use client'

import TradingViewButton from '@/components/TradingViewButton'

type Plan = 'free' | 'premium' | 'ultimate'

export default function IndicatorAccessLinks(props: {
  indicatorPlanAccess: Plan
  tradingViewLink?: string
  themeColor: string
}) {
  const { tradingViewLink } = props

  // Show TradingView link to everyone, no restrictions
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {tradingViewLink ? (
        <TradingViewButton href={tradingViewLink}>
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" />
          </svg>
          TradingView Indicator Link
        </TradingViewButton>
      ) : (
        <div className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-gray-300 text-sm font-medium bg-black/40 border border-gray-700">
          Link not available yet.
        </div>
      )}
    </div>
  )
}


