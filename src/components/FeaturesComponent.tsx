export default function FeaturesComponent() {
  const features = [
    {
      title: "Better trading Accuracy",
      description: "Multi-indicator confluence filters out false signals before they reach you. When Time and Price all align, you get a clear signal—not noise. These tools are designed to enhance your analysis and help you make more informed trading decisions.",
      icon: (
        <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Vertical bars */}
          <rect x="20" y="20" width="20" height="100" rx="10" stroke="#EF4444" strokeWidth="3" fill="none"/>
          <rect x="50" y="40" width="20" height="80" rx="10" stroke="#EF4444" strokeWidth="3" fill="none"/>
          <rect x="110" y="40" width="20" height="80" rx="10" stroke="#EF4444" strokeWidth="3" fill="none"/>
          <rect x="140" y="20" width="20" height="100" rx="10" stroke="#EF4444" strokeWidth="3" fill="none"/>
          {/* Center circle with target icon */}
          <circle cx="100" cy="30" r="25" fill="#EF4444"/>
          <circle cx="100" cy="30" r="10" stroke="white" strokeWidth="2" fill="none"/>
          <circle cx="100" cy="30" r="5" fill="white"/>
          <line x1="100" y1="15" x2="100" y2="5" stroke="white" strokeWidth="2"/>
          <line x1="100" y1="45" x2="100" y2="55" stroke="white" strokeWidth="2"/>
          <line x1="85" y1="30" x2="75" y2="30" stroke="white" strokeWidth="2"/>
          <line x1="115" y1="30" x2="125" y2="30" stroke="white" strokeWidth="2"/>
        </svg>
      )
    },
    {
      title: "Mechanical Trading Edge",
      description: "100% rule-based signals eliminate emotional trading. No interpretation, no second-guessing—just clear mechanical rules that execute the same way every time. These tools are designed to enhance your trading workflow and support consistent decision-making.",
      icon: (
        <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Chevron lines */}
          <path d="M30 30 L60 60 L30 90" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M50 30 L80 60 L50 90" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M120 30 L150 60 L120 90" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M140 30 L170 60 L140 90" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          {/* Center circle with robot icon */}
          <circle cx="100" cy="60" r="25" fill="#EF4444"/>
          <circle cx="93" cy="55" r="3" fill="white"/>
          <circle cx="107" cy="55" r="3" fill="white"/>
          <rect x="90" y="65" width="20" height="3" rx="1.5" fill="white"/>
          <circle cx="100" cy="60" r="18" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
    {
      title: "Institutional Grade Tools",
      description: "Professional traders use advanced systems with built-in risk management, multi-indicator confluence, and automated stops. These tools are designed to enhance your trading analysis with institutional-grade features to support your trading decisions.",
      icon: (
        <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Arc lines */}
          <path d="M30 90 Q30 30 100 30" stroke="#EF4444" strokeWidth="3" fill="none"/>
          <path d="M50 95 Q50 40 100 40" stroke="#EF4444" strokeWidth="3" fill="none"/>
          <path d="M170 90 Q170 30 100 30" stroke="#EF4444" strokeWidth="3" fill="none"/>
          <path d="M150 95 Q150 40 100 40" stroke="#EF4444" strokeWidth="3" fill="none"/>
          {/* Center circle with wrench icon */}
          <circle cx="100" cy="30" r="25" fill="#EF4444"/>
          <path d="M95 25 L95 35 M105 25 L105 35" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="95" cy="30" r="6" stroke="white" strokeWidth="2" fill="none"/>
          <circle cx="105" cy="30" r="6" stroke="white" strokeWidth="2" fill="none"/>
          <rect x="92" y="28" width="16" height="4" fill="white"/>
        </svg>
      )
    }
  ];

  return (
    <section className="relative z-10 px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-red-500 text-sm sm:text-base font-semibold mb-4">Features</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Use Hunts Pip
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            we offering a range of cutting-edge features that set us apart in the world of Forex and Automation.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-[#2A2A2C] rounded-3xl p-8 sm:p-10 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 min-h-[420px] sm:min-h-[460px] flex flex-col"
            >
              {/* Icon Container */}
              <div className="mb-8 h-32 sm:h-36 flex items-center justify-center">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-5">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed flex-grow">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
