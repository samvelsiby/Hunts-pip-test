"use client"

import type React from "react"
import Link from "next/link"
import { ArrowRight, Search, Bell, Settings } from "lucide-react"
import { LaserFlow } from "./LaserFlow"
import TrustedPartnersComponent from "./TrustedPartnersComponent"

export function LaserHero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-black w-full">
      <div className="absolute inset-0 z-0">
        <LaserFlow
          color="#FF4444"
          horizontalBeamOffset={0.2}
          verticalBeamOffset={0.0}
          flowSpeed={0.97}
          verticalSizing={5}
          horizontalSizing={2}
          fogIntensity={0.45}
          fogScale={0.66}
          wispSpeed={26.5}
          wispIntensity={16.5}
          flowStrength={0.33}
          decay={0.3}
          falloffStart={0.5}
          fogFallSpeed={0.6}
          wispDensity={1}
          mouseTiltStrength={0}
          className="w-full h-full"
        />
      </div>
      

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center pt-20 pb-1">
        <div className="xl:max-w-7xl max-w-6xl  w-full mx-auto lg:px-0 px-6">
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-stone-800/50 pr-3 backdrop-blur-sm border border-stone-600/30 mb-8">
            <span className="px-2 py-0.5 bg-red-500 text-red-100 text-xs font-bold rounded-full">New</span>
            <span className="text-sm text-gray-300 tracking-tight">The Future of Crypto Trading is Here</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6 text-white leading-tight">
            GET ACCESS TO
            <br />
            INVISIBLE INSIGHTS
            <br />
            IN MARKET
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/library">
              <button className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2">
                Explore Library
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Trusted Partners Section */}
      <div className="relative z-10 w-full pb-1">
        <TrustedPartnersComponent />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
    </section>
  )
}

export default LaserHero
