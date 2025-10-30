import { client, indicatorsQuery, urlFor } from '@/lib/sanity'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

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
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const indicators = await getIndicators()

  const categories = ['all', 'trend', 'momentum', 'volatility', 'volume', 'custom']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                ← Back to Dashboard
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

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white capitalize transition-all duration-200 border border-gray-700 hover:border-blue-500"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Indicators Grid */}
        {indicators.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Indicators Yet</h3>
            <p className="text-gray-400 mb-6">
              Indicators will appear here once they are added to the CMS
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 max-w-2xl mx-auto text-left">
              <h4 className="text-lg font-semibold text-blue-400 mb-3">Getting Started with Sanity CMS:</h4>
              <ol className="space-y-2 text-gray-300">
                <li>1. Add your Sanity credentials to <code className="text-blue-400 bg-gray-800 px-2 py-1 rounded">.env.local</code></li>
                <li>2. Run <code className="text-blue-400 bg-gray-800 px-2 py-1 rounded">npm run sanity</code> to start Sanity Studio</li>
                <li>3. Create indicator documents in the CMS</li>
                <li>4. Refresh this page to see your indicators</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indicators.map((indicator) => (
              <IndicatorCard key={indicator._id} indicator={indicator} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function IndicatorCard({ indicator }: { indicator: Indicator }) {
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
