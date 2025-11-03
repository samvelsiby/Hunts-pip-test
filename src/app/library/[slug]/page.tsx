import { client, indicatorBySlugQuery, urlFor, getBlurDataURL } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import PageBreadcrumbs from '@/components/PageBreadcrumbs'

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
  documentation?: unknown[]
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

// Custom components for PortableText to render images and rich content
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-800">
            <Image
              src={urlFor(value).width(1200).height(675).url()}
              alt={value.alt || 'Documentation image'}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-4 text-center text-gray-400 text-sm italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    codeBlock: ({ value }) => (
      <pre className="bg-black/60 border border-gray-800 rounded-lg p-4 overflow-auto my-6 text-sm">
        <code>
          {value?.filename ? `// ${value.filename}\n` : ''}
          {value?.code}
        </code>
      </pre>
    ),
    youtube: ({ value }) => {
      const url: string | undefined = value?.url
      if (!url) return null
      const match = url.match(/(?:v=|\.be\/)\w+/)
      const id = match ? match[0].split('=')[1] || match[0].split('/').pop() : undefined
      if (!id) return null
      return (
        <div className="my-8 aspect-video w-full overflow-hidden rounded-lg border border-gray-800 bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )
    },
    callout: ({ value }) => {
      const tone = value?.tone || 'info'
      const toneClasses: Record<string, string> = {
        info: 'border-[#FF5B41]/30 bg-[#FF5B41]/10',
        warning: 'border-yellow-500/30 bg-yellow-500/10',
        success: 'border-green-500/30 bg-green-500/10',
      }
      return (
        <div className={`my-6 p-4 rounded-lg border ${toneClasses[tone] || toneClasses.info}`}>
          <p className="text-gray-200">{value?.text}</p>
        </div>
      )
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-white mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold text-white mt-6 mb-3">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-gray-300 leading-relaxed mb-4 text-lg">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#FF5B41] pl-6 py-2 my-6 italic text-gray-300 bg-gray-800/50 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-200">{children}</em>
    ),
    code: ({ children }) => (
      <code className="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const target = value?.href?.startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-[#FF5B41] hover:text-[#DD0000] underline"
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-gray-300 pl-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-300 pl-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-4">{children}</li>,
    number: ({ children }) => <li className="ml-4">{children}</li>,
  },
}

export default async function IndicatorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const indicator = await getIndicator(slug)

  if (!indicator) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Indicator Not Found</h1>
          <Link
            href="/library"
            className="text-[#FF5B41] hover:text-[#DD0000] underline"
          >
            Back to Library
          </Link>
        </div>
      </div>
    )
  }

  const planColors = {
    free: 'bg-green-500/10 text-green-400 border-green-500/20',
    premium: 'bg-[#FF5B41]/10 text-[#FF5B41] border-[#FF5B41]/20',
    ultimate: 'bg-[#DD0000]/10 text-[#DD0000] border-[#DD0000]/20',
  }

  const categoryIcons = {
    trend: '📈',
    momentum: '⚡',
    volatility: '📊',
    volume: '📦',
    custom: '⚙️',
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Corner gradient */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #DD0000 0%, #FF5B41 50%, transparent 70%)',
          }}
        />
      </div>
      
      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <PageBreadcrumbs />
        {/* Hero Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#FF5B41]/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-[#DD0000]/10 to-transparent"></div>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Icon */}
            <div className="shrink-0">
              {indicator.icon ? (
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-700">
                  <Image
                    src={urlFor(indicator.icon).width(128).height(128).url()}
                    alt={indicator.title}
                    width={128}
                    height={128}
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={getBlurDataURL(indicator.icon)}
                    priority
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-xl flex items-center justify-center text-6xl" style={{ background: 'linear-gradient(135deg, #DD0000 0%, #FF5B41 100%)' }}>
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
                    className="text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
                    style={{
                      background: 'linear-gradient(135deg, #DD0000 0%, #FF5B41 100%)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #FF5B41 0%, #DD0000 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #DD0000 0%, #FF5B41 100%)';
                    }}
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
                  <span className="text-[#FF5B41] mr-3 text-xl">✓</span>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentation Section with Rich Content */}
        {indicator.documentation && indicator.documentation.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-8">Documentation</h2>
            <div className="prose prose-invert max-w-none">
              <PortableText
                value={indicator.documentation as PortableTextBlock[]}
                components={portableTextComponents}
              />
            </div>
          </div>
        )}

        {/* How to Use Section */}
        <div className="bg-gradient-to-r from-[#DD0000]/10 to-[#FF5B41]/10 border border-[#FF5B41]/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">How to Use This Indicator</h2>
          <ol className="space-y-4 text-gray-300">
            <li className="flex items-start">
              <span className="text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 shrink-0 font-bold" style={{ background: 'linear-gradient(135deg, #DD0000 0%, #FF5B41 100%)' }}>
                1
              </span>
              <div>
                <strong className="text-white">Access TradingView</strong>
                <p className="text-gray-400 mt-1">
                  Click the Open in TradingView button above to access the indicator
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 shrink-0 font-bold" style={{ background: 'linear-gradient(135deg, #DD0000 0%, #FF5B41 100%)' }}>
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
              <span className="text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 shrink-0 font-bold" style={{ background: 'linear-gradient(135deg, #DD0000 0%, #FF5B41 100%)' }}>
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
              <span className="text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 shrink-0 font-bold" style={{ background: 'linear-gradient(135deg, #DD0000 0%, #FF5B41 100%)' }}>
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
