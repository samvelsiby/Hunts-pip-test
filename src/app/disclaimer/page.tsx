import Link from 'next/link';

export default function DisclaimerPage() {
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
          <span className="text-white">Disclaimer</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00dd5e 0%, #ff0000 100%)' }}>Disclaimer</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Important information about trading risks and our services.
          </p>
        </div>

        {/* Disclaimer Content */}
        <div className="space-y-8">
          {/* Short Disclaimer */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <p className="text-sm text-gray-300 leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> Our site is for educational use only and should not be considered financial advice. Trading and investing activities are inherently risky, and users of our material should be prepared to incur losses in connection with such activities. All content on this site is not intended to, and should not be, construed as financial advice. Decisions to buy, sell, hold or trade in securities, commodities and other investments involve risk and are best made based on the advice of qualified financial professionals. Past performance does not guarantee future results.
            </p>
          </div>

          {/* Risk Disclaimer */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-4">Risk Disclaimer</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p>
                Trading and investing are risky. Many will lose money in connection with trading and investing activities.
              </p>
              <p>
                All content on this site is not intended to, and should not be, construed as financial advice. Decisions to buy, sell, hold or trade in securities, commodities and other investments involve risk and are best made based on the advice of qualified financial professionals. Past performance does not guarantee future results.
              </p>
              <p>
                The risk of loss in trading and investing can be substantial. You should therefore carefully consider whether such trading and investing activities is suitable for you in light of your financial condition.
              </p>
            </div>
          </div>

          {/* Hypothetical and Simulated Performance Disclaimer */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-4">Hypothetical and Simulated Performance Disclaimer</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p>
                Hypothetical or Simulated performance results have certain limitations. Unlike an actual performance record, simulated results do not represent actual trading. Also, since the trades have not been executed, the results may have under-or-over compensated for the impact, if any, of certain market factors, including, but not limited to, lack of liquidity. Simulated trading programs in general are designed with the benefit of hindsight, and are based on historical information. No representation is being made that any account will or is likely to achieve profit or losses similar to those shown.
              </p>
              <p>
                In addition, any strategy constructs, optimizations, or backtests displayed on our platform — including those created or suggested via our AI Backtesting platform — are hypothetical, presented for educational and informational purposes only, and are not indicative of future results or performance. Any examples, charts, equity curves, statistics, or alerts derived from such strategies are illustrative only and do not guarantee outcomes in live markets.
              </p>
            </div>
          </div>

          {/* Market Data & Delays */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-4">Market Data & Delays</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p>
                Market data used on our website and within our products may include data licensed from third parties. CBOE BZX real-time U.S. equities data is licensed from CBOE and provided through BarChart. Real-time futures data is licensed from CME Group and provided through BarChart. Select cryptocurrency data, including major coins, is provided through CoinAPI. All data is provided &quot;as is&quot; and should be independently verified for trading purposes.
              </p>
              <p>
                Data, calculations, or outputs on our platform may differ from those on other charting or brokerage platforms (including TradingView) due to differences in data vendors, time-stamping, rounding, corporate action handling, contract specifications, or execution model assumptions. If a strategy or backtest is emulated from our platform to TradingView (or another platform), results may differ for these and other reasons.
              </p>
            </div>
          </div>

          {/* Alerts & Automation Disclaimer */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-4">Alerts & Automation Disclaimer</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p>
                Our platform may allow you to create, schedule, export, or route alerts (including via email, mobile notifications, webhooks, or other integrations). Alerts are provided solely for informational and educational purposes. Delivery is not guaranteed, may be delayed or interrupted, and may fail due to third-party services, connectivity issues, rate limits, or other factors outside our control.
              </p>
              <p>
                You are solely responsible for how you use alerts, including any routing to brokerages, automation systems, or third-party tools. Hunts Pip does not execute trades, does not monitor your accounts, and does not accept responsibility or liability for any trading or investment decisions you make in reliance on alerts, signals, webhooks, or any other features. None of our features constitute investment advice or personalized investment advice.
              </p>
            </div>
          </div>

          {/* Testimonials Disclaimer */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-4">Testimonials Disclaimer</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p>
                Testimonials appearing on this website may not be representative of other clients or customers and is not a guarantee of future performance or success. Any trading results depicted in testimonials are not verified and we have no basis for believing that individual experiences depicted are typical considering that results will vary given many factors such as skill, risk management, experience, and the fact that trading and investing are very high-risk activities where it is likely you will lose money.
              </p>
              <p>
                As a provider of technical analysis tools and strategies, we do not have access to the personal trading accounts or brokerage statements of our customers. As a result, we have no reason to believe our customers perform better or worse than traders as a whole based on any content, tool, or platform feature we provide.
              </p>
            </div>
          </div>

          {/* Hunts Pip Is Not An Investment Adviser */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-4">Hunts Pip Is Not An Investment Adviser</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p>
                Hunts Pip is not registered as an investment adviser with the U.S. Securities and Exchange Commission. Rather, Hunts Pip relies upon the &quot;publisher&apos;s exclusion&quot; from the definition of &quot;investment adviser&quot; as provided under Section 202(a)(11) (D) of the Investment Advisers Act of 1940 (the &quot;Advisers Act&quot;) and corresponding state laws. As such, Hunts Pip does not offer or provide personalized investment advice and nothing in these materials should be construed as investment advice within the meaning of the Advisers Act.
              </p>
            </div>
          </div>

          {/* Informational and Educational Purposes Only */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-4">Informational and Educational Purposes Only</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p>
                To the extent any of the content, material, information and/or any other kind of informational offering published, broadcast, or otherwise stated on this, and/or associated websites, may be deemed to be &quot;investment advice&quot;, such information is impersonal and not tailored to the investment needs of any specific person. The information contained within this, and/or, associated websites, is provided for informational and educational purposes only.
              </p>
              <p>
                The information should not be construed as investment or trading advice and is not meant to be a solicitation or recommendation to buy, sell, or hold any positions in any indices or financial markets mentioned. The content and information provided by Hunts Pip, the website and the products and services of Hunts Pip, is solely incidental to the business and activities of Hunts Pip in providing educational tools for technical analysis and a platform for building, testing, and analyzing technical analysis strategies.
              </p>
              <p>
                Hunts Pip does not, and will not, provide you with any legal, tax, estate planning or accounting advice, or any advice regarding the suitability, profitability or appropriateness for you of any security, investment, financial product, investment strategy or other matter. The data, content and information within the tools, scanners, screeners, alerts, strategies, and backtests should not be construed as investment or trading advice and is not meant to be a solicitation or recommendation to buy, sell, or hold any positions in any securities or to engage in any other transaction.
              </p>
            </div>
          </div>

          {/* TradingView Disclosure */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-4">TradingView Disclosure</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p>
                Charts used on this site are by TradingView in which the majority of our technical indicators are built on. TradingView® is a registered trademark of TradingView, Inc. www.TradingView.com. TradingView® has no affiliation with the owner, developer, or provider of the Services described herein.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105 border-2"
            style={{ 
              background: '#ff0000',
              borderColor: '#00dd5e',
            }}
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}

