export default function TrustedPartnersComponent() {
  const companies = [
    "Company",
    "Company",
    "Company",
    "Company",
    "Company",
    "Company"
  ];

  return (
    <section className="relative z-10 px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-gray-400 text-sm sm:text-base mb-8 sm:mb-12">
          Our trusted partners and companies, relying on our safe services.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-12">
          {companies.map((company, index) => (
            <div 
              key={index}
              className="flex items-center justify-center"
            >
              <span className="text-white text-base sm:text-lg font-semibold hover:text-gray-300 transition-colors cursor-pointer">
                {company}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
