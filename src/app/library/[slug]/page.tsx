import { client, indicatorBySlugQuery, urlFor, getBlurDataURL } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import TradingViewButton from '@/components/TradingViewButton'
import PurchaseButton from '@/components/PurchaseButton'

// Revalidate every 5 minutes in production, or on-demand via webhook
export const revalidate = 300

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
    const indicator = await client.fetch(
      indicatorBySlugQuery, 
      { slug },
      {
        next: { 
          revalidate: 300, // 5 minutes
          tags: [`indicator-${slug}`, 'indicators', 'sanity-content'] 
        }
      }
    )
    
    if (process.env.NODE_ENV === 'production' && !indicator) {
      console.warn(`⚠️  Indicator not found for slug: ${slug}`)
    }
    
    return indicator
  } catch (error) {
    console.error(`❌ Error fetching indicator (slug: ${slug}):`, error)
    
    // More detailed error logging in production
    if (process.env.NODE_ENV === 'production') {
      if (error instanceof Error) {
        console.error('Error message:', error.message)
      }
      console.error('Sanity Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'NOT SET')
      console.error('Sanity Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET || 'NOT SET')
    }
    
    return null
  }
}

// Custom components for PortableText to render images and rich content
const getPortableTextComponents = (themeColor: string, hexToRgba: (hex: string, alpha: number) => string): PortableTextComponents => ({
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null

      return (
        <figure className="my-8">
          <div 
            className="relative w-full overflow-hidden bg-black p-1 rounded-lg"
            style={{
              border: `2px solid ${themeColor}`,
              boxShadow: `0 0 40px ${hexToRgba(themeColor, 0.5)}, 0 0 80px ${hexToRgba(themeColor, 0.3)}, inset 0 0 60px ${hexToRgba(themeColor, 0.1)}`,
            }}
          >
            {/* Glow effect behind image */}
            <div 
              className="absolute inset-0 -z-10 blur-3xl opacity-50"
              style={{
                background: `radial-gradient(ellipse at center, ${hexToRgba(themeColor, 0.6)} 0%, transparent 70%)`,
              }}
            />
            
            <Image
              src={urlFor(value).width(2400).quality(100).url()}
              alt={value.alt || 'Documentation image'}
              width={2400}
              height={1350}
              className="w-full h-auto object-contain rounded-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              quality={100}
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
})

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

  const categoryIcons = {
    trend: '📈',
    momentum: '⚡',
    volatility: '📊',
    volume: '📦',
    custom: '⚙️',
  }

  // Plan-based color theme
  const planColors = {
    free: '#6B7280',      // Gray
    premium: '#DC2626',   // Red
    ultimate: '#00DD5E',  // Green
  }

  const themeColor = planColors[indicator.planAccess]
  const isFreeIndicator = indicator.planAccess === 'free'
  
  // Convert hex to rgba for glow effects
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${hexToRgba(themeColor, 0.15)} 0%, #000000 50%, ${hexToRgba(themeColor, 0.15)} 100%)`,
      }}
    >
      {/* Additional gradient overlays for depth */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top gradient */}
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: `radial-gradient(ellipse at top center, ${hexToRgba(themeColor, 0.3)} 0%, transparent 50%)`,
          }}
        />
        {/* Bottom gradient */}
        <div 
          className="absolute bottom-0 left-0 w-full h-full"
          style={{
            background: `radial-gradient(ellipse at bottom center, ${hexToRgba(themeColor, 0.3)} 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Title with back button */}
        <div className="mb-8">
          <Link
            href="/library"
            className="inline-flex items-center gap-3 text-white hover:text-gray-300 transition-colors mb-4"
          >
            <span className="text-2xl">←</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase">
              {indicator.title}
            </h1>
          </Link>
        </div>

        {/* Main content area */}
        <div className="space-y-8 mb-12">
          {/* Large Image with glow */}
          <div 
            className="relative w-full bg-black p-1 rounded-lg"
            style={{
              border: `2px solid ${themeColor}`,
              boxShadow: `0 0 40px ${hexToRgba(themeColor, 0.5)}, 0 0 80px ${hexToRgba(themeColor, 0.3)}, inset 0 0 60px ${hexToRgba(themeColor, 0.1)}`,
            }}
          >
            {/* Glow effect behind image */}
            <div 
              className="absolute inset-0 -z-10 blur-3xl opacity-50"
              style={{
                background: `radial-gradient(ellipse at center, ${hexToRgba(themeColor, 0.6)} 0%, transparent 70%)`,
              }}
            />
            
            {indicator.icon ? (
              <Image
                src={urlFor(indicator.icon).width(2400).quality(100).url()}
                alt={indicator.title}
                width={2400}
                height={1350}
                className="w-full h-auto object-contain rounded-md"
                placeholder="blur"
                blurDataURL={getBlurDataURL(indicator.icon)}
                priority
                quality={100}
              />
            ) : (
              <div className="flex items-center justify-center w-full aspect-video text-5xl text-gray-600 bg-gray-900 rounded-md">
                {categoryIcons[indicator.category as keyof typeof categoryIcons] || '📊'}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-4xl">
            {indicator.description}
          </p>

          {/* Trading platform links (only for free indicators) */}
          {isFreeIndicator && (
            <div className="flex flex-col sm:flex-row gap-4">
              {indicator.tradingViewLink && (
                <TradingViewButton href={indicator.tradingViewLink}>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" />
                  </svg>
                  Trading View
                </TradingViewButton>
              )}
              
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-gray-500 text-sm font-medium cursor-not-allowed bg-black/40 border border-gray-700"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" />
                </svg>
                Ninja Trader
              </button>
            </div>
          )}

          {/* Purchase CTA for premium/ultimate indicators */}
          {!isFreeIndicator && (
            <div className="flex flex-col sm:flex-row gap-4">
              <PurchaseButton href="/pricing" themeColor={themeColor}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Purchase to Access
              </PurchaseButton>
            </div>
          )}
        </div>

        {/* Documentation Section */}
        {indicator.documentation && indicator.documentation.length > 0 && (
          <>
            {/* Documentation Divider */}
            <div 
              className="relative flex items-center justify-center my-12 py-8"
              style={{
                backgroundImage: `radial-gradient(circle, ${hexToRgba(themeColor, 0.5)} 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
                backgroundPosition: 'center center',
              }}
            >
              <div className="relative z-10 px-8 py-2">
                <h2 
                  className="text-xl sm:text-2xl font-bold tracking-wider relative inline-block"
                  style={{ color: themeColor }}
                >
                  DOCUMENTATION
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: themeColor }}
                  ></div>
                </h2>
              </div>
            </div>

            {/* Documentation Content */}
            <div className="prose prose-invert max-w-none">
              <PortableText
                value={indicator.documentation as PortableTextBlock[]}
                components={getPortableTextComponents(themeColor, hexToRgba)}
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
