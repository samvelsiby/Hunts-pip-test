'use client';

import Image from 'next/image';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export default function FeaturesComponent() {
  const features = [
    {
      title: "Better trading Accuracy",
      description: "Multi-indicator confluence filters out false signals before they reach you. When Time and Price all align, you get a clear signal—not noise. Higher accuracy means fewer losses and more winning trades.",
      imageSrc: "/offer/Image (3).svg"
    },
    {
      title: "Mechanical Trading Edge",
      description: "100% rule-based signals eliminate emotional trading. No interpretation, no second-guessing—just clear mechanical rules that execute the same way every time. Remove the human error from your trading.",
      imageSrc: "/offer/Image (4).svg"
    },
    {
      title: "Institutional Grade Tools",
      description: "Professional traders use advanced systems with built-in risk management, multi-indicator confluence, and automated stops. Now you can too. Get bank-level analysis at a fraction of the cost.",
      imageSrc: "/offer/Image (5).svg"
    }
  ];

  return (
    <section className="relative z-10 px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
      {/* Chart SVG as background - behind the cards */}
      <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 z-0 overflow-hidden opacity-80">
        <div className="w-full max-w-[1440px] mx-auto">
          <Image 
            src="/offer/Chart.svg" 
            alt="Trading Chart" 
            width={1440} 
            height={265} 
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 relative z-10">
          <p className="text-red-500 text-sm sm:text-base font-semibold mb-4">Features</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Use HuntsPip
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            we offering a range of cutting-edge features that set us apart in the world of Forex and Automation.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <CardContainer key={index} className="inter-var" containerClassName="py-0">
              <CardBody 
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.3)'
                }}
                className="rounded-3xl p-8 sm:p-10 border-2 border-[#FFE9E9]/20 hover:border-[#FFE9E9]/40 transition-all duration-300 w-full max-w-[380px] min-h-[550px] flex flex-col relative overflow-hidden justify-end mx-auto h-auto"
              >
                {/* SVG Image - positioned at the top center */}
                <CardItem translateZ="60" className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[280px] h-[180px]">
                  <Image 
                    src={feature.imageSrc}
                    alt={feature.title}
                    width={331}
                    height={244}
                    className="w-full h-full object-contain"
                    priority
                  />
                </CardItem>

                <CardItem translateZ="50" className="relative z-20 mt-auto pt-[140px]">
                  {/* Title */}
                  <CardItem translateZ="80" as="h3" className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    {feature.title}
                  </CardItem>

                  {/* Description */}
                  <CardItem translateZ="60" as="p" className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </CardItem>
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
