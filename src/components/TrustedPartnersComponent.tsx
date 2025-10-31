import Image from 'next/image';

export default function TrustedPartnersComponent() {
  // Use the actual SVG files from the companies directory
  const companies = [
    { name: "MetaTrader 4", logo: "/companies/Metatrader.svg" },
    { name: "MetaTrader 5", logo: "/companies/Metatrder5.svg" },
    { name: "NinjaTrader", logo: "/companies/Ninjatrader.svg" },
    { name: "TradingView", logo: "/companies/Trading.svg" }
  ];

  return (
    <section className="relative z-10 px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-gray-400 text-sm sm:text-base mb-8 sm:mb-12">
          Our trusted partners and companies, relying on our safe services.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {companies.map((company, index) => (
            <div 
              key={index}
              className="flex items-center justify-center h-16 sm:h-20"
            >
              <Image 
                src={company.logo} 
                alt={company.name} 
                width={160} 
                height={60}
                className="w-auto h-full object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
