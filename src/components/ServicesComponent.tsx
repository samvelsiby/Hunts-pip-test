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
            Elevate Your <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>Trading Experience</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus elit nec dictum pharetra.
          </p>
        </div>

        {/* Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
          {/* Left Feature: Data Encryption */}
          <div className="relative flex flex-col items-center text-center">
            {/* Phone Illustration with Curved Line and Icon */}
            <div className="relative mb-8 w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
              <div className="relative">
                {/* Gradient Background */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-30 blur-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #2AFF66 0%, #0F0F10 100%)',
                  }}
                />
                <Image
                  src="/services/mobile1.svg"
                  alt="Connected Securely"
                  width={600}
                  height={1200}
                  className="w-full h-auto relative z-10"
                  priority
                />
                {/* Curved Line - Left phone */}
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ width: '100%', height: '100%' }}
                  viewBox="0 0 300 600"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M 50 550 Q 150 400 200 300 Q 230 250 250 200"
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* Icon Overlay - Shield with checkmark */}
                <div className="absolute top-[40%] right-[15%] transform -translate-y-1/2">
                  <div className="w-14 h-14 rounded-full bg-gray-900/80 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mt-auto">
              <p className="text-[#00dd5e] text-sm font-semibold mb-3 uppercase tracking-wider">
                Data Encryption
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Connected Securely
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus elit nec dictum pharetra.
              </p>
            </div>
          </div>

          {/* Right Feature: High-Accuracy */}
          <div className="relative flex flex-col items-center text-center">
            {/* Phone Illustration with Curved Line and Icon */}
            <div className="relative mb-8 w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
              <div className="relative">
                {/* Gradient Background */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-30 blur-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #2AFF66 0%, #0F0F10 100%)',
                  }}
                />
                <Image
                  src="/services/mobile2.svg"
                  alt="Optimize Your Trades"
                  width={600}
                  height={1200}
                  className="w-full h-auto relative z-10"
                  priority
                />
                {/* Curved Line - Right phone */}
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ width: '100%', height: '100%' }}
                  viewBox="0 0 300 600"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M 250 550 Q 150 400 100 300 Q 70 250 50 200"
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* Icon Overlay - Lightning bolt */}
                <div className="absolute top-[40%] left-[15%] transform -translate-y-1/2">
                  <div className="w-14 h-14 rounded-full bg-gray-900/80 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus elit nec dictum pharetra.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

