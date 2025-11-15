import Image from 'next/image';

export default function GlobalNetworkSection() {
  return (
    <section className="relative z-10 px-4 sm:px-8 py-16 sm:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <p className="text-[#00dd5e] text-sm sm:text-base font-semibold mb-3 uppercase tracking-wider">
          Global Server Network
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          Ultra-Efficient Trading Setups
          <span className="block">Around the World</span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus elit nec dictum pharetra.
        </p>

        <div className="mt-10 sm:mt-14 w-full max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-[40px] bg-linear-to-b from-[#0b301e] via-black to-black border border-white/10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(0,221,94,0.55),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,0,0,0.8),transparent_60%)]" />
            <div className="relative">
              <Image
                src="/world/wordl.png"
                alt="Global trading network world map"
                width={1440}
                height={720}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-6 max-w-xl w-full">
          <div className="flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-semibold text-white">2k+</div>
            <div className="text-xs sm:text-sm text-gray-400">Clients</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-semibold text-white">4.5</div>
            <div className="text-xs sm:text-sm text-gray-400">Rating</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-semibold text-white">20+</div>
            <div className="text-xs sm:text-sm text-gray-400">Indicators</div>
          </div>
        </div>

        <div className="mt-6 text-xs sm:text-sm font-semibold text-[#00dd5e]">
          Testimonials
        </div>
      </div>
    </section>
  );
}
