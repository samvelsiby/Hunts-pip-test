'use client';

import Image from 'next/image';

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
              With Our Trading Accuracy Tools
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            We deliver high-fidelity accuracy tools that surface institutional insights, verified market trends, and multi-frame confluence so you can trust every trading decision.
          </p>
        </div>

        {/* Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
          {/* Left Feature: Data Encryption */}
          <div className="relative flex flex-col items-center text-center">
            {/* Video Preview */}
            <div className="relative mb-8 w-full max-w-lg overflow-hidden bg-black/20">
              <video
                className="w-full h-full object-cover"
                src="/services/2.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
              {/* Feathered edge overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%), linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%)'
                }} />
              </div>
            </div>

            {/* Content */}
            <div className="mt-auto">
              <p className="text-[#00dd5e] text-sm font-semibold mb-3 uppercase tracking-wider">
                Market Connectivity
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Real-Time Market Shield
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Precision background analysis, multi-frame confluence, and real-time triggers keep you ahead of breakouts, reversals, and institutional flow so you can optimize every trade with confidence.
              </p>
            </div>
          </div>

          {/* Right Feature: High-Accuracy */}
          <div className="relative flex flex-col items-center text-center">
            {/* Video Preview */}
            <div className="relative mb-8 w-full max-w-lg overflow-hidden bg-black/20">
              <video
                className="w-full h-full object-cover"
                src="/services/OB CHARTS.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
              {/* Feathered edge overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%), linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%)'
                }} />
              </div>
            </div>

            {/* Content */}
            <div className="mt-auto">
              <p className="text-[#00dd5e] text-sm font-semibold mb-3 uppercase tracking-wider">
                High-Accuracy
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Optimize Your Trades
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Precision background analysis, multi-frame confluence, and real-time triggers keep you ahead of breakouts, reversals, and institutional flow so you can optimize every trade with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

