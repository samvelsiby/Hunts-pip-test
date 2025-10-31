'use client'

import { useState, useMemo } from 'react'
import IndicatorCard from './IndicatorCard'

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

interface LibraryClientProps {
  indicators: Indicator[]
  categories: string[]
}

export default function LibraryClient({ indicators, categories }: LibraryClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter indicators based on search and category
  const filteredIndicators = useMemo(() => {
    return indicators.filter((indicator) => {
      const matchesSearch = 
        indicator.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        indicator.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (indicator.features?.some(feature => 
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        ))

      const matchesCategory = 
        selectedCategory === 'all' || 
        indicator.category.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [indicators, searchQuery, selectedCategory])

  return (
    <>
      {/* Search and Category Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search indicators by name, description, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all duration-200 border ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700 hover:border-blue-500'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {indicators.length > 0 && (
          <div className="text-center text-gray-400 text-sm">
            Showing {filteredIndicators.length} of {indicators.length} indicator
            {filteredIndicators.length !== 1 ? 's' : ''}
            {searchQuery && ` matching ${searchQuery}`}
            {selectedCategory !== 'all' && ` in ${selectedCategory} category`}
          </div>
        )}
      </div>

      {/* Indicators Grid */}
      {filteredIndicators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIndicators.map((indicator) => (
            <IndicatorCard key={indicator._id} indicator={indicator} />
          ))}
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
            Try adjusting your search query or category filter
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Clear filters
          </button>
        </div>
      ) : null}
    </>
  )
}

