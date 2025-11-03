import { client, indicatorBySlugQuery, urlFor, getBlurDataURL } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import PageBreadcrumbs from '@/components/PageBreadcrumbs'
import TradingViewButton from '@/components/TradingViewButton'

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
      <pre className="bg-gray-900/60 rounded-lg p-4 overflow-auto my-6 text-sm">
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
        <div className="my-8 aspect-video w-full overflow-hidden rounded-lg bg-black">
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
        info: 'bg-[#FF5B41]/10',
        warning: 'bg-yellow-500/10',
        success: 'bg-green-500/10',
      }
      return (
        <div className={`my-6 p-4 rounded-lg ${toneClasses[tone] || toneClasses.info}`}>
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
        <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#FF5B41]/10 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-[#DD0000]/10 to-transparent opacity-50"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-8">
            {/* Icon */}
            <div className="shrink-0">
              {indicator.icon ? (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                  <Image
                    src={urlFor(indicator.icon).width(160).height(160).url()}
                    alt={indicator.title}
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                    placeholder="blur"
                    blurDataURL={getBlurDataURL(indicator.icon)}
                    priority
                  />
                </div>
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl flex items-center justify-center text-6xl shadow-lg" style={{ background: 'linear-gradient(135deg, #DD0000 0%, #FF5B41 100%)' }}>
                  {categoryIcons[indicator.category as keyof typeof categoryIcons] || '📊'}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-4">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    {indicator.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-400 capitalize mb-4">
                    {categoryIcons[indicator.category as keyof typeof categoryIcons]} {indicator.category} Indicator
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${planColors[indicator.planAccess]} self-start md:self-auto`}>
                  {indicator.planAccess.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
                {indicator.description}
              </p>

              {/* Action Button */}
              {indicator.tradingViewLink && (
                <div className="flex gap-4">
                  <TradingViewButton href={indicator.tradingViewLink}>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" />
                    </svg>
                    Open in TradingView
                  </TradingViewButton>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        {indicator.features && indicator.features.length > 0 && (
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-8">
            <h2 className="text-3xl font-bold text-white mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {indicator.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start bg-gray-900/40 rounded-xl p-5 hover:bg-gray-900/60 transition-colors"
                >
                  <span className="text-[#FF5B41] mr-4 text-2xl font-bold">✓</span>
                  <span className="text-gray-300 text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentation Section with Rich Content */}
        {indicator.documentation && indicator.documentation.length > 0 && (
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-8">
            <h2 className="text-3xl font-bold text-white mb-8">Documentation</h2>
            <div className="prose prose-invert max-w-none">
              <PortableText
                value={indicator.documentation as PortableTextBlock[]}
                components={portableTextComponents}
              />
            </div>
          </div>
        )}

        {/* Call to Action Section */}
        {indicator.planAccess === 'free' ? (
          <div className="relative overflow-hidden rounded-2xl p-8 md:p-12" style={{ background: 'linear-gradient(135deg, rgba(0, 221, 94, 0.2) 0%, rgba(0, 221, 94, 0.1) 30%, rgba(255, 0, 0, 0.1) 70%, rgba(255, 0, 0, 0.2) 100%)' }}>
            <div className="absolute top-0 right-0 w-full h-full opacity-20" style={{ background: 'radial-gradient(circle at top right, #00dd5e 0%, transparent 60%)' }}></div>
            <div className="absolute bottom-0 left-0 w-full h-full opacity-20" style={{ background: 'radial-gradient(circle at bottom left, #ff0000 0%, transparent 60%)' }}></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <Image 
                  src="/hunts-pip-logo.svg" 
                  alt="HUNTS PIP Logo" 
                  width={180} 
                  height={48}
                  className="w-auto h-12 md:h-16"
                  priority
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Get Started with <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>Free Access</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-300 mb-6">
                  Sign up for free to access this indicator and start enhancing your trading strategy today.
                </p>
                
                <Link 
                  href="/sign-up"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-white transition-all hover:scale-105 shadow-lg hover:shadow-xl border-2"
                  style={{ 
                    background: '#00dd5e',
                    borderColor: '#ff0000',
                    borderWidth: '2px'
                  }}
                >
                  <span>Sign Up Free</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl p-8 md:p-12" style={{ background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.2) 0%, rgba(255, 0, 0, 0.1) 30%, rgba(0, 221, 94, 0.1) 70%, rgba(0, 221, 94, 0.2) 100%)' }}>
            <div className="absolute top-0 right-0 w-full h-full opacity-20" style={{ background: 'radial-gradient(circle at top right, #ff0000 0%, transparent 60%)' }}></div>
            <div className="absolute bottom-0 left-0 w-full h-full opacity-20" style={{ background: 'radial-gradient(circle at bottom left, #00dd5e 0%, transparent 60%)' }}></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <Image 
                  src="/hunts-pip-logo.svg" 
                  alt="HUNTS PIP Logo" 
                  width={180} 
                  height={48}
                  className="w-auto h-12 md:h-16"
                  priority
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Unlock <span className="text-transparent bg-clip-text uppercase" style={{ backgroundImage: 'linear-gradient(135deg, #ff0000 0%, #00dd5e 100%)' }}>{indicator.planAccess}</span> Access
                </h2>
                <p className="text-lg md:text-xl text-gray-300 mb-6">
                  Upgrade to {indicator.planAccess} plan to access this premium indicator and unlock advanced trading features.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold text-white transition-all hover:scale-105 shadow-lg hover:shadow-xl border-2"
                    style={{ 
                      background: '#ff0000',
                      borderColor: '#00dd5e',
                      borderWidth: '2px'
                    }}
                  >
                    <span>View Pricing</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  
                  <Link 
                    href="/sign-up"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold border-2 transition-all hover:scale-105"
                    style={{ 
                      borderColor: '#00dd5e',
                      color: '#00dd5e',
                      background: 'transparent'
                    }}
                  >
                    <span>Try Free First</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
