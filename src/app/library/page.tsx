import { client, indicatorsQuery } from '@/lib/sanity'
import LibraryClient from './LibraryClient'
import LibraryHero from '@/components/LibraryHero'

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
    // Log configuration in production for debugging
    if (process.env.NODE_ENV === 'production') {
      console.log('Sanity Config:', {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? '✅ Set' : '❌ Missing',
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        hasToken: !!process.env.SANITY_API_TOKEN,
      })
    }
    
    const indicators = await client.fetch(indicatorsQuery, {}, {
      next: { 
        revalidate: 3600, // 1 hour fallback
        tags: ['indicators', 'sanity-content'] 
      }
    })
    
    if (process.env.NODE_ENV === 'production') {
      console.log(`✅ Fetched ${indicators.length} indicators from Sanity`)
    }
    
    return indicators
  } catch (error) {
    console.error('❌ Error fetching indicators from Sanity:', error)
    
    // More detailed error logging in production
    if (process.env.NODE_ENV === 'production') {
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      console.error('Sanity Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'NOT SET')
      console.error('Sanity Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET || 'NOT SET')
    }
    
    return []
  }
}

export default async function LibraryPage() {
  const indicators = await getIndicators()

  const categories = ['all', 'trend', 'momentum', 'volatility', 'volume', 'custom']

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Video Background */}
      <LibraryHero />
      
      {/* Main Content */}
      <main id="library-content" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
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
