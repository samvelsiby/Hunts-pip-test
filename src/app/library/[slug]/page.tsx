import { client, indicatorBySlugQuery, urlFor, getBlurDataURL } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import TradingViewButton from '@/components/TradingViewButton'

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
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      
      return (
        <figure className="my-8">
          <div className="relative w-full overflow-hidden bg-gray-800">
            <Image
              src={urlFor(value).width(2400).quality(100).url()}
              alt={value.alt || 'Documentation image'}
              width={2400}
              height={1350}
              className="w-full h-auto object-contain"
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
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Top row: back + static badge */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <span className="text-lg">←</span>
            <span>Back to library</span>
          </Link>
          <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-white/5 text-gray-100 border border-white/15">
            {indicator.planAccess.toUpperCase()} PLAN
          </span>
        </div>

        {/* Hero media card */}
        <section className="rounded-[28px] bg-[#050505]/90 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[720px] opacity-60 blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(221,0,0,0.6) 0%, transparent 70%)' }}
            />
          </div>

          <div className="relative z-10 px-6 pt-6 sm:px-10 sm:pt-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
              {indicator.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-400 capitalize mb-6 flex items-center gap-2">
              <span>{categoryIcons[indicator.category as keyof typeof categoryIcons] || '📊'}</span>
              <span>{indicator.category} Indicator</span>
            </p>
          </div>

          {/* Main preview image */}
          <div className="relative z-10 px-4 pb-8 sm:px-8">
            <div className="relative w-full max-w-4xl mx-auto overflow-hidden bg-black/80 border border-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.9)]">
              <div className="relative w-full bg-black">
                {indicator.icon ? (
                  <Image
                    src={urlFor(indicator.icon).width(2400).quality(100).url()}
                    alt={indicator.title}
                    width={2400}
                    height={1350}
                    className="w-full h-auto object-contain"
                    placeholder="blur"
                    blurDataURL={getBlurDataURL(indicator.icon)}
                    priority
                    quality={100}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full aspect-video text-5xl text-gray-600">
                    {categoryIcons[indicator.category as keyof typeof categoryIcons] || '📊'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Overview / documentation text */}
        {indicator.documentation && indicator.documentation.length > 0 ? (
          <section className="rounded-[28px] bg-[#050505]/90 px-6 py-8 sm:px-10 sm:py-10">
            <div className="prose prose-invert max-w-none">
              <PortableText
                value={indicator.documentation as PortableTextBlock[]}
                components={portableTextComponents}
              />
            </div>
          </section>
        ) : (
          <section className="rounded-[28px] bg-[#050505]/90 px-6 py-8 sm:px-10 sm:py-10">
            <p className="text-gray-300 text-lg leading-relaxed">
              {indicator.description}
            </p>
          </section>
        )}

        {/* Optional: key features below documentation */}
        {indicator.features && indicator.features.length > 0 && (
          <section className="rounded-[24px] bg-[#050505]/90 px-6 py-8 sm:px-10 sm:py-9">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">Key Features</h2>
            <ul className="space-y-3">
              {indicator.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300 text-base sm:text-lg">
                  <span className="text-[#FF5B41] mt-1 text-xl">●</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Bottom CTA row */}
        {indicator.tradingViewLink && (
          <section className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <TradingViewButton href={indicator.tradingViewLink}>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" />
              </svg>
              TradingView
            </TradingViewButton>

            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-gray-500 text-sm font-medium cursor-not-allowed bg-black/40"
            >
              NinjaTrader (coming soon)
            </button>
          </section>
        )}
      </main>
    </div>
  )
}
