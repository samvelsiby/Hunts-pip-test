import Link from 'next/link';

export default function UltimateDocsPage() {
  const indicators = [
    "Neural Confluence Engine - Confluence score 0 to 100 from 12 features. Probability zones on chart.",
    "Smart Order Blocks - Adaptive OB detection with age decay and validity rating.",
    "Smart Liquidity Map Pro - Dynamic buy side and sell side liquidity pools with sweep probability.",
    "Volume Matrix - OBV gradient, volume spike z-score, delta proxy on TradingView, true delta on NinjaTrader.",
    "Volatility Probability Channel - Quantile based forward range for next N bars. Shows likely path.",
    "Trend Quality Index - Noise adjusted trend using Kalman LR and Hurst estimate.",
    "Exhaustion Meter - Wick factor, range extension percentile, div stack, delta fade.",
    "Regime Aware Oscillator - RSI transformed by volatility and session context for cleaner fades.",
    "Liquidity Rotation Map - Range nodes and rotation frequency to time mean reverts."
  ];

  const strategies = [
    "Institutional Momentum Model - Multi timeframe BOS filter, OB retest, VPC up path, probability gate from Neural Confluence.",
    "Trend Ladder - Pyramid entries with dynamic risk and trailing on VPC lower quantiles.",
    "Liquidity Flip Model - Stop run, OB reclaim, CHoCH confirmation, target opposite pool.",
    "Neural Scalper - Short horizon entries trained on pattern features. TP and SL from VPC quantiles."
  ];

  const scanners = [
    "Market Bias Neural Scanner - Long, neutral, short across M5, M15, H1 with confidence.",
    "Volume Imbalance Radar - Spike and delta divergence clusters. Futures gets true delta on NinjaTrader.",
    "Liquidity Sweep Detector Pro - Real time sweep probability and post sweep reversal quality.",
    "Multi Timeframe Confluence Scanner - Grades symbols 0 to 100 from regime, structure, VPC, and volume."
  ];

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
          <Link href="/docs" className="hover:text-white transition-colors">Knowledge Base</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Ultimate Plan</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>Ultimate Plan</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Everything included in the Ultimate plan
          </p>
        </div>

        {/* Indicators Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 mb-6">
            <h2 className="text-3xl font-bold text-white mb-6">What is Included</h2>
            <h3 className="text-2xl font-bold text-white mb-6 mt-8">Indicators</h3>
            <ol className="space-y-4">
              {indicators.map((indicator, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>
                    {index + 1}
                  </span>
                  <span className="text-gray-300 leading-relaxed">{indicator}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Strategies Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 mb-6">
            <h3 className="text-2xl font-bold text-white mb-6">Strategies</h3>
            <ol className="space-y-4">
              {strategies.map((strategy, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>
                    {index + 1}
                  </span>
                  <span className="text-gray-300 leading-relaxed">{strategy}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Scanners Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 mb-6">
            <h3 className="text-2xl font-bold text-white mb-6">Scanners</h3>
            <ol className="space-y-4">
              {scanners.map((scanner, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>
                    {index + 1}
                  </span>
                  <span className="text-gray-300 leading-relaxed">{scanner}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Upgrade?</h3>
          <p className="text-gray-300 leading-relaxed mb-6">
            Get access to all Ultimate features and unlock the full power of our trading suite.
          </p>
          <Link 
            href="/pricing"
            className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105 border-2"
            style={{ 
              background: '#ff0000',
              borderColor: '#00dd5e',
            }}
          >
            View Pricing
          </Link>
        </div>
      </main>
    </div>
  );
}

