'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function MoneyBackGuaranteeComponent() {
  return (
    <section className="relative z-10 px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Container with proper aspect ratio */}
        <div className="relative w-full overflow-hidden rounded-3xl shadow-xl transition-transform hover:scale-[1.01] duration-300">
          {/* Make the entire SVG clickable */}
          <Link href="/pricing" className="block w-full h-full">
            <div className="relative w-full cursor-pointer" style={{ aspectRatio: '1280/699' }}>
              {/* SVG with all text and elements included */}
              <Image
                src="/Content.svg"
                alt="Money-Back Guarantee - 30 Days"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
                className="w-full h-full object-cover hover:brightness-105 transition-all duration-300"
              />
              
              {/* Subtle hover effect overlay */}
              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
