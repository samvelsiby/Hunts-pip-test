'use client';

import Link from "next/link";

export const PricingCTA = () => {
  return (
    <section className="py-20 px-4 sm:px-8 bg-black">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl overflow-hidden relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[45px_45px] opacity-100 mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        <div className="relative z-10 p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Still have questions?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Our team is here to help you find the perfect plan for your trading needs. 
            Contact us for personalized assistance or to request a demo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Contact Sales
            </Link>
            <Link 
              href="/demo"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
