import { client, indicatorsQuery } from '@/lib/sanity'
export const revalidate = 60
import Link from 'next/link'
import LibraryClient from './LibraryClient'

interface Indicator {
  _id: string
  title: string
  slug: { current: string }
  description: string
  category: string
  icon?: unknown
  features?: string[]
  planAccess: 'free' | 'pro' | 'premium'
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
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-400 hover:text-white transition">
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-white">Indicator Library</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Explore Our Trading Indicators
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Access powerful TradingView indicators designed to enhance your trading strategy
          </p>
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
