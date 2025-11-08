import React from 'react';

export default function BentoGridComponent() {
  return (
    <section className="relative z-10 px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-red-500 text-sm sm:text-base font-semibold mb-4">Features</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Use HuntsPip
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            we offering a range of cutting-edge features that set us apart in the world of Forex and Automation.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-6">
          {/* Large Card - Left Side (spans 2 rows) */}
          <div 
            className="lg:row-span-2 lg:col-span-2 rounded-3xl border-2 border-[#ADFFCE] p-8 min-h-[400px] lg:min-h-[600px]"
            style={{
              background: 'linear-gradient(135deg, #0a3d2e 0%, #051a13 100%)'
            }}
          >
            {/* Content will go here */}
          </div>

          {/* Card 1 - Save you from hours of charting */}
          <div 
            className="lg:col-span-2 rounded-3xl border-2 border-[#ADFFCE] p-8 min-h-[250px] flex flex-col justify-end"
            style={{
              background: 'linear-gradient(135deg, #0a3d2e 0%, #051a13 100%)'
            }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Save you from hours of charting
            </h3>
          </div>

          {/* Card 2 - Highly customizable */}
          <div 
            className="lg:col-span-2 rounded-3xl border-2 border-[#ADFFCE] p-8 min-h-[250px] flex flex-col justify-end"
            style={{
              background: 'linear-gradient(135deg, #0a3d2e 0%, #051a13 100%)'
            }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Highly customizable
            </h3>
          </div>

          {/* Card 3 - Receive a trading toolkit */}
          <div 
            className="lg:col-span-1 rounded-3xl border-2 border-[#ADFFCE] p-8 min-h-[280px] flex flex-col justify-end"
            style={{
              background: 'linear-gradient(135deg, #0a3d2e 0%, #051a13 100%)'
            }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Receive a trading toolkit
            </h3>
          </div>

          {/* Card 4 - Learning Accelerator (wider) */}
          <div 
            className="lg:col-span-3 rounded-3xl border-2 border-[#ADFFCE] p-8 min-h-[280px] flex flex-col justify-end"
            style={{
              background: 'linear-gradient(135deg, #0a3d2e 0%, #051a13 100%)'
            }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Learning Accelerator
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
