'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import LoadingLogo from './LoadingLogo';

export default function HeroSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load Spline with optimized lazy loading
  useEffect(() => {
    // Small delay to allow initial page render for better performance
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Prevent scroll from interfering with Spline
  useEffect(() => {
    if (!shouldLoad) return;

    const preventScrollCapture = (e: WheelEvent | TouchEvent) => {
      // Allow scroll to pass through to the page
      const target = e.target as HTMLElement;
      if (target.closest('iframe[src*="spline"]') || target.closest('[class*="spline"]')) {
        // Don't prevent default, let it bubble up to document
        return;
      }
    };

    // Add event listeners to ensure scroll events bubble up
    window.addEventListener('wheel', preventScrollCapture, { passive: true });
    window.addEventListener('touchmove', preventScrollCapture, { passive: true });

    return () => {
      window.removeEventListener('wheel', preventScrollCapture);
      window.removeEventListener('touchmove', preventScrollCapture);
    };
  }, [shouldLoad]);

  // Aggressively hide watermark with MutationObserver
  useEffect(() => {
    if (!shouldLoad) return;

    const hideWatermark = () => {
      // Comprehensive selectors for all possible watermark variations
      const selectors = [
        '[class*="watermark"]',
        '[class*="spline-logo"]',
        '[class*="spline-watermark"]',
        '[id*="watermark"]',
        '[id*="spline-logo"]',
        'a[href*="spline"]',
        'a[href*="spline.design"]',
        'a[href*="spline"] img',
        'a[href*="spline"] svg',
        'div[style*="position: fixed"]',
        'div[style*="position:absolute"]',
        'div[style*="bottom"]',
        'div[style*="right"]',
        'iframe[src*="spline"] ~ div',
        'iframe[src*="spline"] + div',
        '[data-spline-watermark]',
        '[data-spline-logo]',
      ];

      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            // Check if element is in bottom-right corner (typical watermark position)
            const rect = htmlEl.getBoundingClientRect();
            const isBottomRight = 
              (rect.bottom > window.innerHeight - 100 && rect.right > window.innerWidth - 200) ||
              htmlEl.textContent?.toLowerCase().includes('spline') ||
              htmlEl.getAttribute('href')?.includes('spline');
            
            if (isBottomRight || selector.includes('watermark') || selector.includes('spline-logo')) {
              htmlEl.style.display = 'none';
              htmlEl.style.visibility = 'hidden';
              htmlEl.style.opacity = '0';
              htmlEl.style.pointerEvents = 'none';
              htmlEl.style.width = '0';
              htmlEl.style.height = '0';
              htmlEl.style.overflow = 'hidden';
              htmlEl.style.position = 'absolute';
              htmlEl.style.left = '-9999px';
            }
          });
        } catch (e) {
          // Ignore errors
        }
      });
    };

    // Run immediately
    hideWatermark();

    // MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      hideWatermark();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'style'],
    });

    // Also run at intervals to catch late-loading elements
    const timers = [100, 300, 500, 1000, 2000, 3000, 5000].map(delay => 
      setTimeout(hideWatermark, delay)
    );

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [shouldLoad]);

  return (
    <main className="relative z-10 min-h-screen flex items-center overflow-hidden bg-black">
      {/* Loading State */}
      {isLoading && <LoadingLogo />}
      
      {/* Spline 3D Scene - Background */}
      <div 
        className="absolute inset-0 w-full h-full"
      >
        <style jsx global>{`
          /* Hide all Spline watermark/logo elements - comprehensive selectors */
          .spline-watermark,
          [class*="spline-watermark"],
          [class*="watermark"],
          [id*="watermark"],
          [id*="spline-logo"],
          [class*="spline-logo"],
          [class*="spline"][class*="logo"],
          iframe[src*="spline"] + div,
          iframe[src*="spline"] ~ div,
          div[class*="spline"] [class*="logo"],
          div[class*="spline"] [class*="watermark"],
          canvas + div[style*="position"],
          /* Hide matrix logo and any branding */
          a[href*="spline"],
          a[href*="spline"] img,
          a[href*="spline"] svg,
          div[style*="position: fixed"][style*="bottom"],
          div[style*="position: fixed"][style*="right"],
          div[style*="position:absolute"][style*="bottom"],
          div[style*="position:absolute"][style*="right"],
          [data-spline-watermark],
          [data-spline-logo] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            left: -9999px !important;
            z-index: -1 !important;
          }
          
          /* Ensure Spline canvas fills container and doesn't capture scroll */
          canvas {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }
          
          /* Allow iframe interactions */
          iframe[src*="spline"] {
            pointer-events: auto !important;
          }
        `}</style>
        {shouldLoad && (
          <>
            <iframe
              ref={iframeRef}
              src="https://my.spline.design/untitled-d20Iy1Eu6FRqsx4QVnJnsIfT/"
              frameBorder="0"
              width="100%"
              height="100%"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onLoad={() => setIsLoading(false)}
              style={{
                border: 'none',
                display: 'block',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                touchAction: 'none',
                overscrollBehavior: 'none',
              }}
            />
            {/* Solid overlay to cover watermark area in bottom-right corner - covers larger area */}
            <div 
              className="absolute bottom-0 right-0 pointer-events-none"
              style={{
                width: '400px',
                height: '200px',
                background: '#000000',
                pointerEvents: 'none',
                zIndex: 9999,
              }}
            />
            {/* Fixed overlay to cover any fixed-position watermarks */}
            <div 
              className="fixed bottom-0 right-0 pointer-events-none"
              style={{
                width: '350px',
                height: '180px',
                background: '#000000',
                pointerEvents: 'none',
                zIndex: 99999,
              }}
            />
          </>
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 px-4 sm:px-8 w-full pointer-events-none">
        <div className="max-w-7xl mx-auto w-full py-20">
          <div className="max-w-3xl">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-white">GET </span>
              <span className="text-red-500">ACCESS</span>
              <span className="text-white"> TO</span>
              <br />
              <span className="text-white">INVISIBLE INSIGHTS</span>
              <br />
              <span className="text-white">IN MARKET</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-lg sm:text-xl font-light max-w-lg mt-6">
              Powered by Neural Networks<br />
              and Machine Learning
            </p>

            {/* CTA Button */}
            <div className="pt-8 pointer-events-auto">
              <Link href="/library">
                <button 
                  className="px-7 py-3.5 text-white text-base font-semibold rounded-full transition-all flex items-center gap-2 hover:scale-105 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #DD0000 0%, #FF5B41 100%)',
                  }}
                >
                  View Product Library
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
