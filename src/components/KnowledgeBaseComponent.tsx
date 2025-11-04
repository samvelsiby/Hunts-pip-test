'use client';

import Link from 'next/link';

export default function KnowledgeBaseComponent() {
  const quickLinks = [
    {
      title: "Quick Start",
      description: "Learn how to add Hunts Pip indicators to your TradingView chart",
      href: "/docs/quick-start",
      icon: "🚀"
    },
    {
      title: "Premium Plan",
      description: "Explore all Premium plan features and indicators",
      href: "/docs/premium",
      icon: "⭐"
    },
    {
      title: "Ultimate Plan",
      description: "Discover Ultimate plan features and advanced strategies",
      href: "/docs/ultimate",
      icon: "💎"
    },
    {
      title: "Full Documentation",
      description: "Browse our complete knowledge base",
      href: "/docs",
      icon: "📚"
    }
  ];

  return (
    <section className="relative z-10 px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[#00dd5e] text-sm sm:text-base font-semibold mb-4 uppercase tracking-wider">
            Knowledge Base
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Learn How to Use <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>Our Indicators</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Get started with our TradingView indicators and learn how to maximize your trading potential.
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="group bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl sm:text-5xl flex-shrink-0">{link.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#00dd5e] transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    {link.description}
                  </p>
                  <div className="mt-4 flex items-center text-[#00dd5e] text-sm font-semibold group-hover:gap-2 transition-all">
                    <span>Learn More</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link 
            href="/docs"
            className="inline-flex items-center px-8 py-4 rounded-lg font-semibold text-white transition-all hover:scale-105 border-2"
            style={{ 
              background: '#ff0000',
              borderColor: '#00dd5e',
            }}
          >
            View All Documentation
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

