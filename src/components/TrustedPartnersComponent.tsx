'use client';

import Image from 'next/image';

export default function TrustedPartnersComponent() {
  // Use the actual SVG files from the companies directory
  const companies = [
    { name: "MetaTrader 4", logo: "/companies/Metatrader.svg" },
    { name: "MetaTrader 5", logo: "/companies/Metatrder5.svg" },
    { name: "NinjaTrader", logo: "/companies/Ninjatrader.svg" },
    { name: "TradingView", logo: "/companies/Trading.svg" }
  ];

  // Duplicate the companies array to create seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="relative z-10 px-4 sm:px-8 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-gray-400 text-sm sm:text-base mb-8 sm:mb-12">
          Our trusted partners and companies, relying on our safe services.
        </p>
        
        {/* Horizontal scrolling container */}
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-12 sm:gap-16 lg:gap-20 animate-scroll">
            {duplicatedCompanies.map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center h-16 sm:h-20 w-32 sm:w-40"
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={160}
                  height={60}
                  className="w-auto h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
