'use client';

import Image from 'next/image';
import Link from 'next/link';
import HlsVideo from '@/components/HlsVideo'
import { CLOUDFLARE_STREAM_UIDS, cloudflareStreamHlsUrl } from '@/config/cloudflare-stream'

export default function ServicesComponent() {
  return (
    <section className="relative z-10 px-4 sm:px-8 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[#00dd5e] text-sm sm:text-base font-semibold mb-4 uppercase tracking-wider">
            Services
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Sneak Peak Into
            <span
              className="block text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}
            >
               Our Trading Accuracy Tools
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
           Start Trading Today wth Exclusive Tool Kit
          </p>
        </div>

        {/* Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto items-stretch">
          {/* Left Feature: Data Encryption */}
          <div 
            className="relative flex flex-col items-center text-center h-full"
          >
            {/* Video Preview */}
            <div className="relative mb-8 w-full max-w-lg overflow-hidden bg-black/20">
              <HlsVideo
                className="w-full h-full object-cover"
                src={cloudflareStreamHlsUrl(CLOUDFLARE_STREAM_UIDS.services2)}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
              {/* Feathered edge overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%), linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%)'
                }} />
              </div>
            </div>

            {/* Content */}
            <div className="mt-auto space-y-4">
              <p className="text-[#00dd5e] text-sm font-semibold mb-3 uppercase tracking-wider">
                Something for your future
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Lifetime Updates Included
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Your subscription automatically unlocks every future refinement, feature, and performance upgrade at no extra cost. As we sharpen algorithms and add new tools, they drop straight into your toolkit so you always stay ahead.
              </p>
            </div>
          </div>

          {/* Right Feature: High-Accuracy */}
          <div className="relative flex flex-col items-center text-center h-full">
            {/* Video Preview */}
            <div className="relative mb-8 w-full max-w-lg overflow-hidden bg-black/20">
              <HlsVideo
                className="w-full h-full object-cover"
                src={cloudflareStreamHlsUrl(CLOUDFLARE_STREAM_UIDS.obCharts)}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
              {/* Feathered edge overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%), linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%)'
                }} />
              </div>
            </div>

            {/* Content */}
            <div className="mt-auto space-y-4">
              <p className="text-[#00dd5e] text-sm font-semibold mb-3 uppercase tracking-wider">
                Architecture You Can Trust
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Non-Repainting Accuracy
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                What you see is what you get. Our indicators never redraw or change historical values, so every backtest, screenshot, and data point stays fixed and reliable. Build and refine strategies with confidence that past signals remain exactly as plotted.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 rounded-full border border-[#00dd5e] px-8 py-2.5 text-white text-base font-semibold hover:bg-[#00dd5e]/10 transition-colors"
          >
            Explore Our Collection
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

