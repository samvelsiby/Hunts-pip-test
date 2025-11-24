'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import IndicatorCard from './IndicatorCard'

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

interface LibraryClientProps {
  indicators: Indicator[]
}

export default function LibraryClient({ indicators }: LibraryClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPlan, setSelectedPlan] = useState<'all' | 'free' | 'premium' | 'ultimate'>('all')
  const [visibleIndicators, setVisibleIndicators] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Filter indicators based on search, category, and plan access
  const filteredIndicators = useMemo(() => {
    const filtered = indicators.filter((indicator) => {
      const matchesSearch = 
        indicator.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        indicator.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (indicator.features?.some(feature => 
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        ))

      const matchesCategory = 
        selectedCategory === 'all' || 
        indicator.category.toLowerCase() === selectedCategory.toLowerCase()

      const matchesPlan = 
        selectedPlan === 'all' || 
        indicator.planAccess.toLowerCase() === selectedPlan.toLowerCase()

      return matchesSearch && matchesCategory && matchesPlan
    })

    // When "All" is selected, sort to show premium and ultimate first
    if (selectedPlan === 'all') {
      return filtered.sort((a, b) => {
        const planPriority: Record<string, number> = {
          'ultimate': 1,
          'premium': 2,
          'free': 3
        }
        return (planPriority[a.planAccess] || 999) - (planPriority[b.planAccess] || 999)
      })
    }

    return filtered
  }, [indicators, searchQuery, selectedCategory, selectedPlan])

  // Set up intersection observer for lazy loading with preloading
  useEffect(() => {
    // Show first 10 indicators immediately (preload for faster initial render)
    const initialVisible = new Set(
      filteredIndicators.slice(0, 10).map(ind => ind._id)
    )
    setVisibleIndicators(initialVisible)

    // Preload/prefetch the first 10 indicator detail pages for faster navigation
    filteredIndicators.slice(0, 10).forEach((indicator) => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = `/library/${indicator.slug.current}`
      document.head.appendChild(link)
    })

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Set up intersection observer for the rest
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indicatorId = entry.target.getAttribute('data-indicator-id')
            if (indicatorId) {
              setVisibleIndicators((prev) => new Set([...prev, indicatorId]))
              // Unobserve once visible to improve performance
              observerRef.current?.unobserve(entry.target)
            }
          }
        })
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport for better preloading
      }
    )

    // Use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const cards = document.querySelectorAll('[data-indicator-id]')
      cards.forEach((card) => {
        observerRef.current?.observe(card)
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      observerRef.current?.disconnect()
    }
  }, [filteredIndicators])

  return (
    <>
      {/* Plan Filter Buttons - Top Right */}
      <div className="flex justify-end gap-3 mb-8">
        <button
          onClick={() => setSelectedPlan('all')}
          className={`px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
            selectedPlan === 'all'
              ? 'bg-gray-700 text-white border-2 border-gray-500'
              : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSelectedPlan('free')}
          className={`px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
            selectedPlan === 'free'
              ? 'bg-gray-600 text-white border-2 border-gray-400'
              : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-700'
          }`}
        >
          Free
        </button>
        <button
          onClick={() => setSelectedPlan('premium')}
          className={`px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
            selectedPlan === 'premium'
              ? 'bg-red-600 text-white border-2 border-red-400'
              : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-red-900/30'
          }`}
        >
          Premium
        </button>
        <button
          onClick={() => setSelectedPlan('ultimate')}
          className={`px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
            selectedPlan === 'ultimate'
              ? 'bg-[#00DD5E] text-black border-2 border-green-300'
              : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-green-900/30'
          }`}
        >
          Ultimate
        </button>
      </div>

      {/* Indicators Grid */}
      {filteredIndicators.length > 0 ? (
        <div id="library-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredIndicators.map((indicator, index) => {
            const isVisible = visibleIndicators.has(indicator._id) || index < 10
            return (
              <div
                key={indicator._id}
                data-indicator-id={indicator._id}
                className={!isVisible ? 'min-h-[400px]' : ''}
              >
                {isVisible ? (
                  <IndicatorCard indicator={indicator} priority={index < 10} />
                ) : (
                  <div className="w-full h-full bg-gray-900/50 rounded-3xl animate-pulse" />
                )}
              </div>
            )
          })}
        </div>
      ) : indicators.length > 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No indicators found</h3>
          <p className="text-gray-400 mb-4">
            Try adjusting your search query, category, or plan filter
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSelectedPlan('all')
            }}
            className="text-gray-400 hover:text-white underline transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : null}
    </>
  )
}

