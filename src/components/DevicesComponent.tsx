'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function DevicesComponent() {
  const devices = [
    { name: 'Windows', icon: '/devices/Vector.svg' },
    { name: 'Mac', icon: '/devices/apple (1).png' },
    { name: 'Android', icon: '/devices/android (1).png' },
    { name: 'iPhone', icon: '/devices/Vector.png' },
    { name: 'Chrome', icon: '/devices/Chrome.png', highlight: true },
    { name: 'Firefox', icon: '/devices/Firefox (1).png' },
    { name: 'Edge', icon: '/devices/vecteezy_microsoft-edge-browser-brand-logo-symbol-white-design_21514918 1 (Traced).png' },
    { name: 'Linux', icon: '/devices/Linux.png' },
  ];

  return (
    <section className="relative z-10 px-4 sm:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-red-500 text-sm sm:text-base font-semibold mb-6">Devices</p>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Connect to your devices, enjoy secure and private access to the internet — even on public Wi-Fi.
          </p>
        </div>

        {/* Devices Grid - Desktop */}
        <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6 mb-8">
          {devices.map((device, index) => (
            <div
              key={index}
              className={`${
                device.highlight
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-800 hover:bg-gray-700'
              } rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col items-center justify-center min-w-[100px] lg:min-w-[120px] aspect-square`}
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 mb-3 relative">
                <Image
                  src={device.icon}
                  alt={device.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-white text-sm lg:text-base font-medium">
                {device.name}
              </span>
            </div>
          ))}
        </div>

        {/* Devices Carousel - Mobile (Continuous Scroll) */}
        <div className="md:hidden relative mb-8">
          <div className="overflow-hidden">
            <div className="flex animate-scroll-mobile">
              {/* First set */}
              {devices.map((device, index) => (
                <div
                  key={`first-${index}`}
                  className={`${
                    device.highlight
                      ? 'bg-red-500'
                      : 'bg-gray-800'
                  } rounded-2xl p-6 flex flex-col items-center justify-center min-w-[100px] aspect-square mx-2 flex-shrink-0`}
                >
                  <div className="w-10 h-10 mb-3 relative">
                    <Image
                      src={device.icon}
                      alt={device.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-white text-sm font-medium">
                    {device.name}
                  </span>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {devices.map((device, index) => (
                <div
                  key={`second-${index}`}
                  className={`${
                    device.highlight
                      ? 'bg-red-500'
                      : 'bg-gray-800'
                  } rounded-2xl p-6 flex flex-col items-center justify-center min-w-[100px] aspect-square mx-2 flex-shrink-0`}
                >
                  <div className="w-10 h-10 mb-3 relative">
                    <Image
                      src={device.icon}
                      alt={device.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-white text-sm font-medium">
                    {device.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* See All Platforms Button */}
        <div className="flex justify-center">
          <Link href="/platforms">
            <button className="bg-black hover:bg-gray-900 text-red-500 px-8 py-3 rounded-full font-semibold text-sm flex items-center gap-2 border border-gray-800 hover:border-red-500/50 transition-all duration-300">
              See All Platforms
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-mobile {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-mobile {
          animation: scroll-mobile 10s linear infinite;
        }

        .animate-scroll-mobile:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
