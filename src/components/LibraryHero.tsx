'use client'

import { useEffect, useRef } from 'react'

export default function LibraryHero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      video.play().catch(err => {
        console.log('Autoplay prevented:', err)
      })
    }

    const handleEnded = () => {
      video.currentTime = 0
      video.play().catch(err => {
        console.log('Loop restart prevented:', err)
      })
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  const scrollToContent = () => {
    const element = document.getElementById('library-content')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        src="/default.mp4"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
  
      {/* Content Container with rounded bottom border */}
      <div className="relative z-20 flex flex-col items-center justify-between h-full">
        {/* Top Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-4">
            <span className="text-[#00DD5E]">
              EXPLORE OUR TRADING INDICATORS
            </span>
          </h1>
          
          <p className="text-gray-300 text-base sm:text-lg md:text-xl text-center max-w-2xl mb-6">
            Access powerful TradingView indicators<br />
            designed to enhance your trading strategy
          </p>

          {/* Gradient Line */}
          <div className="w-32 h-1 bg-linear-to-r from-green-400 via-yellow-500 to-red-500 rounded-full" />
        </div>

        {/* Bottom section with rounded border */}
        <div className="relative w-full flex justify-center pb-50">
          {/* Rounded border container */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-black rounded-t-[40px] border-t-2 border-gray-800" />

          {/* Scroll Down Button - positioned at the border line */}
          <button
            onClick={scrollToContent}
            className="relative z-30 w-32 h-32 rounded-full bg-[#00DD5E] hover:bg-green-400 transition-all duration-300 flex items-center justify-center translate-y-10"
            aria-label="Scroll to explore indicators"
          >
            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75" />
            <svg
              className="w-12 h-12 text-black relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            
            {/* Circular Text - Rotating */}
            <svg
              className="absolute inset-0 w-full h-full animate-spin"
              style={{ animationDuration: '10s' }}
              viewBox="0 0 100 100"
            >
              <defs>
                <path
                  id="circlePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                />
              </defs>
              <text className="text-[7px] fill-black font-bold tracking-wider">
                <textPath href="#circlePath" startOffset="0%">
                  EXPLORE • EXPLORE • EXPLORE • EXPLORE •
                </textPath>
              </text>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
