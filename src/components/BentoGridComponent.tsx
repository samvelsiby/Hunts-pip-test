import React from 'react';
import Image from 'next/image';

export default function BentoGridComponent() {
  return (
    <section className="relative z-10 px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-red-500 text-sm sm:text-base font-semibold mb-4">Features</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            What can HuntsPip do for you?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            we offering a range of cutting-edge features that set us apart in the world of Trading and Automation.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
          {/* Large Card - Left Side (spans 2 rows) */}
          <div 
            className="lg:row-span-2 lg:col-span-4 rounded-[20px] border border-[#3AF48A]/40 bg-linear-to-br from-[#0B301E] via-[#0B301E] to-[#152317] p-8 sm:p-10 min-h-[360px] lg:min-h-[560px] shadow-[0_0_60px_rgba(0,0,0,0.7)]"
            style={{
              background: 'linear-gradient(135deg, #0B301E 0%, #152317 100%)'
            }}
          >
            {/* Content will go here */}
          </div>

          {/* Card 1 - Save you from hours of charting */}
          <div 
            className="lg:col-span-4 rounded-[20px] border border-[#3AF48A]/40 bg-linear-to-br from-[#0B301E] via-[#0B301E] to-[#152317] min-h-[210px] flex flex-col justify-end shadow-[0_0_40px_rgba(0,0,0,0.6)] relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #0B301E 0%, #152317 100%)'
            }}
          >
            {/* Default compact view with SVG */}
            <div className="py-4 sm:py-6 px-0 transition-opacity duration-300 ease-out group-hover:opacity-0">
              <div className="w-full mb-3 flex justify-center">
                <Image
                  src="/bento/card1.svg"
                  alt="Save you from hours of charting"
                  width={320}
                  height={200}
                  className="w-3/4 max-w-[220px] h-auto object-contain"
                  priority
                />
              </div>
              <div className="px-6 sm:px-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Save you from hours of charting
                </h3>
              </div>
            </div>

            {/* Hover detailed view */}
            <div className="absolute inset-0 px-6 sm:px-8 py-6 sm:py-8 flex flex-col justify-center bg-linear-to-br from-[#53FF9B] via-[#7DFFB5] to-[#42E37F] text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">
                Save you from hours of charting
              </h3>
              <div className="space-y-2 text-sm sm:text-base leading-relaxed">
                <p>Manual charting is slow and overwhelming.</p>
                <p>Hunts Pip maps key zones and clean setups automatically so you can spot trades in seconds, not hours.</p>
              </div>
            </div>
          </div>

          {/* Card 2 - Highly customizable */}
          <div 
            className="lg:col-span-4 rounded-[20px] border border-[#3AF48A]/40 bg-linear-to-br from-[#0B301E] via-[#0B301E] to-[#152317] min-h-[240px] flex flex-col justify-end shadow-[0_0_40px_rgba(0,0,0,0.6)] relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #0B301E 0%, #152317 100%)'
            }}
          >
            {/* Default compact view */}
            <div className="p-6 sm:p-8 transition-opacity duration-300 ease-out group-hover:opacity-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Highly customizable
              </h3>
            </div>

            {/* Hover detailed view */}
            <div className="absolute inset-0 px-6 sm:px-8 py-6 sm:py-8 flex flex-col justify-center bg-linear-to-br from-[#53FF9B] via-[#7DFFB5] to-[#42E37F] text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">
                Highly customizable
              </h3>
              <div className="space-y-2 text-sm sm:text-base leading-relaxed">
                <p>Most indicators force you into fixed settings.</p>
                <p>Hunts Pip lets you adjust parameters, visuals, and alerts to match your style.</p>
                <p>See structure, key zones, and confirmations in one view for precise trading.</p>
              </div>
            </div>
          </div>

          {/* Card 3 - Receive a trading toolkit */}
          <div 
            className="lg:col-span-5 rounded-[20px] border border-[#3AF48A]/40 bg-linear-to-br from-[#0B301E] via-[#0B301E] to-[#152317] min-h-[240px] flex flex-col justify-end shadow-[0_0_40px_rgba(0,0,0,0.6)] relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #0B301E 0%, #152317 100%)'
            }}
          >
            {/* Default compact view with SVG */}
            <div className="py-6 sm:py-8 px-0 transition-opacity duration-300 ease-out group-hover:opacity-0">
              <div className="w-full mb-4">
                <Image
                  src="/bento/card3.svg"
                  alt="Receive a trading toolkit"
                  width={320}
                  height={200}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
              <div className="px-6 sm:px-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Receive a trading toolkit
                </h3>
              </div>
            </div>

            {/* Hover detailed view */}
            <div className="absolute inset-0 px-6 sm:px-8 py-6 sm:py-8 flex flex-col justify-center bg-linear-to-br from-[#53FF9B] via-[#7DFFB5] to-[#42E37F] text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">
                Receive a trading toolkit
              </h3>
              <div className="space-y-2 text-sm sm:text-base leading-relaxed">
                <p>At Hunts Pip, you get a complete trading toolkit  not just one indicator.</p>
                <p>Access a growing library of tools designed to boost clarity, timing, and risk control.</p>
                <p>New modules are added regularly so your edge evolves with the market.</p>
                <p>Keep your toolkit sharp and stay ahead of changing conditions.</p>
              </div>
            </div>
          </div>

          {/* Card 4 - Learning Accelerator (wider) */}
          <div 
            className="lg:col-span-3 rounded-[20px] border border-[#3AF48A]/40 bg-linear-to-br from-[#0B301E] via-[#0B301E] to-[#152317] min-h-[240px] flex flex-col justify-end shadow-[0_0_40px_rgba(0,0,0,0.6)] relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #0B301E 0%, #152317 100%)'
            }}
          >
            {/* Default compact view */}
            <div className="p-6 sm:p-8 transition-opacity duration-300 ease-out group-hover:opacity-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Learning Accelerator
              </h3>
            </div>

            {/* Hover detailed view */}
            <div className="absolute inset-0 px-6 sm:px-8 py-6 sm:py-8 flex flex-col justify-center bg-linear-to-br from-[#53FF9B] via-[#7DFFB5] to-[#42E37F] text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">
                Learning Accelerator
              </h3>
              <div className="space-y-2 text-sm sm:text-base leading-relaxed">
                <p>Learn faster with concepts shown directly on the chart.</p>
                <p>Use visual, rule-based signals to bridge the gap between theory and execution.</p>
                <p>Turn what you learn into confident, repeatable trades in real market conditions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
