import { client, indicatorsQuery } from '@/lib/sanity'
import LibraryClient from './LibraryClient'

// Cache this page for 1 hour in production, but revalidate every 60 seconds in development
export const revalidate = 3600

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

async function getIndicators(): Promise<Indicator[]> {
  try {
    const indicators = await client.fetch(indicatorsQuery)
    return indicators
  } catch (error) {
    console.error('Error fetching indicators:', error)
    return []
  }
}

export default async function LibraryPage() {
  const indicators = await getIndicators()

  const categories = ['all', 'trend', 'momentum', 'volatility', 'volume', 'custom']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 mb-16 p-8 sm:p-12">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-blue-500/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-t from-purple-500/10 to-transparent"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Explore Our <span className="text-blue-400">Trading Indicators</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Access powerful TradingView indicators designed to enhance your trading strategy
            </p>
            <div className="w-24 h-1 bg-blue-500/30 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Client Component with Search and Filters */}
        {indicators.length > 0 ? (
          <LibraryClient indicators={indicators} categories={categories} />
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Indicators Available</h3>
            <p className="text-gray-400 mb-6">
              Please check back soon. We&apos;re adding new indicators.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
