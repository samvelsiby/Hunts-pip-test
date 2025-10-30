import { client, indicatorBySlugQuery, urlFor } from '@/lib/sanity'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'

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
  documentation?: any[]
  isActive: boolean
}

async function getIndicator(slug: string): Promise<Indicator | null> {
  try {
    const indicator = await client.fetch(indicatorBySlugQuery, { slug })
    return indicator
  } catch (error) {
    console.error('Error fetching indicator:', error)
    return null
  }
}

export default async function IndicatorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const { slug } = await params
  const indicator = await getIndicator(slug)

  if (!indicator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Indicator Not Found</h1>
          <Link
            href="/library"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Back to Library
          </Link>
        </div>
      </div>
    )
  }

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/library"
            className="text-gray-400 hover:text-white transition inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Library
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Icon */}
            <div className="flex-shrink-0">
              {indicator.icon ? (
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-700">
                  <Image
                    src={urlFor(indicator.icon).width(128).height(128).url()}
                    alt={indicator.title}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-6xl">
                  {categoryIcons[indicator.category as keyof typeof categoryIcons] || '📊'}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {indicator.title}
                  </h1>
                  <p className="text-lg text-gray-400 capitalize">
                    {categoryIcons[indicator.category as keyof typeof categoryIcons]} {indicator.category} Indicator
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${planColors[indicator.planAccess]}`}>
                  {indicator.planAccess.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-300 text-lg mb-6">
                {indicator.description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {indicator.tradingViewLink && (
                  <a
                    href={indicator.tradingViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" />
                    </svg>
                    Open in TradingView
                  </a>
                )}
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        {indicator.features && indicator.features.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {indicator.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start bg-gray-900/50 rounded-lg p-4 border border-gray-700"
                >
                  <span className="text-blue-400 mr-3 text-xl">✓</span>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentation Section */}
        {indicator.documentation && indicator.documentation.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Documentation</h2>
            <div className="prose prose-invert max-w-none">
              <PortableText value={indicator.documentation} />
            </div>
          </div>
        )}

        {/* How to Use Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">How to Use This Indicator</h2>
          <ol className="space-y-4 text-gray-300">
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                1
              </span>
              <div>
                <strong className="text-white">Access TradingView</strong>
                <p className="text-gray-400 mt-1">
                  Click the "Open in TradingView" button above to access the indicator
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                2
              </span>
              <div>
                <strong className="text-white">Add to Your Chart</strong>
                <p className="text-gray-400 mt-1">
                  Add the indicator to your TradingView chart using your credentials
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                3
              </span>
              <div>
                <strong className="text-white">Configure Settings</strong>
                <p className="text-gray-400 mt-1">
                  Customize the indicator parameters based on your trading strategy
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                4
              </span>
              <div>
                <strong className="text-white">Start Trading</strong>
                <p className="text-gray-400 mt-1">
                  Use the indicator signals to inform your trading decisions
                </p>
              </div>
            </li>
          </ol>
        </div>
      </main>
    </div>
  )
}
