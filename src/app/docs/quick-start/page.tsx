import Link from 'next/link';

export default function QuickStartPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Corner gradient */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #DD0000 0%, #FF5B41 50%, transparent 70%)',
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Quick Start</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Quick Start: Adding <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>Hunts Pip</span> to Your Chart
          </h1>
          <p className="text-gray-400 text-lg">
            Get started with our TradingView indicators in just a few simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {/* Step 1 */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>
                1
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">Open a TradingView Chart</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Navigate to <strong className="text-white">TradingView.com</strong> and open a chart for any asset you wish to analyze (e.g., BTC/USD, EUR/USD, AAPL).
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>
                2
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">Open the &apos;Indicators&apos; Menu</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  At the top of your chart, locate and click on the <strong className="text-white">&quot;Indicators&quot;</strong> button. This will open a new window where you can search for and manage your indicators.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>
                3
              </div>
              <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-3">Navigate to &apos;Invite-Only Scripts&apos;</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            A new window will appear. On the left-hand side is a navigation menu. Near the bottom of this menu, you will find a folder with a lock icon named <strong className="text-white">&quot;Invite-Only Scripts&quot;</strong>. This is a private folder where indicators shared directly with you are stored. Click on it.
          </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>
                4
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">Add Hunts Pip Indicator to Your Chart</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Inside the &quot;Invite-Only Scripts&quot; folder, you will see our indicators listed. Simply click on the indicator name you want to use. The window will close, and the indicator will automatically load onto your chart.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
          <h2 className="text-2xl font-bold text-white mb-4">What&apos;s Next?</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Once you&apos;ve added the indicator to your chart, explore our documentation to learn how to configure settings and use the features effectively.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/library"
              className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105 border-2"
              style={{ 
                background: '#ff0000',
                borderColor: '#00dd5e',
              }}
            >
              Browse Indicators
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

