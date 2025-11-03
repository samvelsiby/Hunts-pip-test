'use client';

export const PricingCTA = () => {
  return (
    <section className="py-20 px-4 sm:px-8 bg-black">
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden relative border-2" style={{ 
        background: 'linear-gradient(135deg, rgba(0, 221, 94, 0.1) 0%, rgba(0, 221, 94, 0.05) 30%, rgba(255, 0, 0, 0.05) 70%, rgba(255, 0, 0, 0.1) 100%)',
        borderColor: 'rgba(0, 221, 94, 0.3)'
      }}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[45px_45px] opacity-100 mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Gradient overlays */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20" style={{ background: 'radial-gradient(circle at top right, #00dd5e 0%, transparent 60%)' }}></div>
        <div className="absolute bottom-0 left-0 w-full h-full opacity-20" style={{ background: 'radial-gradient(circle at bottom left, #ff0000 0%, transparent 60%)' }}></div>
        
        <div className="relative z-10 p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>Custom Development</span>?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            We offer custom development for indicators tailored to your specific trading needs. 
            Contact us to discuss your requirements and get a personalized solution.
          </p>
          <div className="flex justify-center">
            <a 
              href="mailto:contact@huntspip.com"
              className="px-8 py-3 text-white font-semibold rounded-lg transition-all hover:scale-105 inline-flex items-center gap-2 border border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contact@huntspip.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
