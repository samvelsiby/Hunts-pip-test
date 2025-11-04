import Link from 'next/link';

export default function PremiumDocsPage() {
  const indicators = [
    "Market Structure Auto - Swing map, BOS, CHoCH, equal highs and equal lows.",
    "Adaptive Trend Pack - EMA 20 50 200, Hull, Linear Regression channel with slope.",
    "Liquidity Map Lite - Prior day high and low, session high and low, round numbers, weekly open.",
    "Momentum Fusion - RSI, Stochastic, MACD histogram alignment with a single score.",
    "Session Suite - Asia, London, New York ranges with opens and bias arrows.",
    "Risk Box - ATR based SL and TP bands with RR presets.",
    "Breakout Cloud - Keltner outer bands, BB squeeze release heatline.",
    "Divergence Radar - RSI and MACD classic and hidden divergence with confidence score.",
    "Mean Revert Bands - VWAP with deviation bands, optional anchored VWAP.",
    "Range Box - Donchian 20 box with midline and rotation counter."
  ];

  const strategies = [
    "Continuation Engine - Pullback to EMA 20 or Keltner mid with ADX filter and volume spike.",
    "Breakout Retest - Break of Asia range then retest with LR channel hold.",
    "Liquidity Grab Reversal - Sweep of prior high or low, CHoCH on lower timeframe, divergence, target VWAP.",
    "VWAP Rotation - Fade at VWAP deviations with RSI 40 to 60 filter."
  ];

  const scanners = [
    "Expansion Scanner Lite - ADX above threshold, BB width percentile, ribbon aligned.",
    "Reversal Scanner Lite - Sweep plus divergence plus CHoCH in last N candles.",
    "Range Scanner Lite - BB width percentile low, ADX low, price inside Keltner and VWAP band.",
    "Session Break Scanner - London or New York drive through Asia high or low with volume spike."
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
          <span className="text-white">Premium Plan</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>Premium Plan</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Everything included in the Premium plan
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
            Get access to all Premium features and start trading smarter today.
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

