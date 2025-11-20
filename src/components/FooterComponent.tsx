'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function FooterComponent() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send this to your backend
      console.log('Subscribing email:', email);
      setSubscribed(true);
      setEmail('');
      
      // Reset the subscribed state after 3 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="relative bg-black text-white pt-16 pb-8 overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-white/25 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/4 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 left-1/5 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse delay-1500"></div>
      </div>

      {/* Top border line */}
      <div className="border-t border-gray-800 max-w-7xl mx-auto"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
          {/* Column 1: Company */}
          <div>
            <h3 className="text-lg font-medium mb-6">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link></li>
              
            </ul>
          </div>

          {/* Column 2: Legal */}
          <div>
            <h3 className="text-lg font-medium mb-6">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms & Condition</Link></li>
            </ul>
          </div>

          {/* Column 3: Subscribe */}
          <div>
            <h2 className="text-3xl font-medium mb-3">Subscribe</h2>
            <div className="relative">
              <div className="absolute -top-2 -right-4 w-full max-w-xs">
                <Image 
                  src="/animations/Commet.svg" 
                  alt="Comet" 
                  width={470} 
                  height={109} 
                  className="w-full"
                />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Get weekly breakdowns of new indicators, strategy tips, and platform updates so you can act on fresh market intel the moment it drops.
            </p>
            
            <div className="mt-8">
              <p className="text-sm text-white mb-2">Stay up to date</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-grow bg-gray-800 border border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 text-white text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-full px-6 py-2 transition-colors text-sm"
                >
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <p className="text-green-500 mt-2 text-xs">Thank you for subscribing!</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                By subscribing you agree to with our <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Risk Disclaimer Section */}
        <div className="border-t border-gray-800 pt-6 mt-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                <strong className="text-white">Disclaimer:</strong> Our site is for educational use only and should not be considered financial advice. Trading and investing activities are inherently risky, and users of our material should be prepared to incur losses in connection with such activities. All content on this site is not intended to, and should not be, construed as financial advice. Decisions to buy, sell, hold or trade in securities, commodities and other investments involve risk and are best made based on the advice of qualified financial professionals. Past performance does not guarantee future results.
              </p>
              <button
                onClick={() => setShowDisclaimer(!showDisclaimer)}
                className="text-xs text-[#00dd5e] hover:text-[#00dd5e]/80 transition-colors underline"
              >
                {showDisclaimer ? 'Show Less' : 'Show Full Disclaimer'}
              </button>
            </div>
            
            {showDisclaimer && (
              <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800 max-h-[600px] overflow-y-auto">
                <div className="space-y-4 text-xs text-gray-400 leading-relaxed">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Risk Disclaimer</h4>
                    <p className="mb-2">
                      Trading and investing are risky. Many will lose money in connection with trading and investing activities.
                    </p>
                    <p className="mb-2">
                      All content on this site is not intended to, and should not be, construed as financial advice. Decisions to buy, sell, hold or trade in securities, commodities and other investments involve risk and are best made based on the advice of qualified financial professionals. Past performance does not guarantee future results.
                    </p>
                    <p>
                      The risk of loss in trading and investing can be substantial. You should therefore carefully consider whether such trading and investing activities is suitable for you in light of your financial condition.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Hypothetical and Simulated Performance Disclaimer</h4>
                    <p className="mb-2">
                      Hypothetical or Simulated performance results have certain limitations. Unlike an actual performance record, simulated results do not represent actual trading. Also, since the trades have not been executed, the results may have under-or-over compensated for the impact, if any, of certain market factors, including, but not limited to, lack of liquidity. Simulated trading programs in general are designed with the benefit of hindsight, and are based on historical information. No representation is being made that any account will or is likely to achieve profit or losses similar to those shown.
                    </p>
                    <p>
                      In addition, any strategy constructs, optimizations, or backtests displayed on our platform — including those created or suggested via our AI Backtesting platform — are hypothetical, presented for educational and informational purposes only, and are not indicative of future results or performance. Any examples, charts, equity curves, statistics, or alerts derived from such strategies are illustrative only and do not guarantee outcomes in live markets.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Market Data & Delays</h4>
                    <p className="mb-2">
                      Market data used on our website and within our products may include data licensed from third parties. CBOE BZX real-time U.S. equities data is licensed from CBOE and provided through BarChart. Real-time futures data is licensed from CME Group and provided through BarChart. Select cryptocurrency data, including major coins, is provided through CoinAPI. All data is provided &quot;as is&quot; and should be independently verified for trading purposes.
                    </p>
                    <p>
                      Data, calculations, or outputs on our platform may differ from those on other charting or brokerage platforms (including TradingView) due to differences in data vendors, time-stamping, rounding, corporate action handling, contract specifications, or execution model assumptions. If a strategy or backtest is emulated from our platform to TradingView (or another platform), results may differ for these and other reasons.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Alerts & Automation Disclaimer</h4>
                    <p className="mb-2">
                      Our platform may allow you to create, schedule, export, or route alerts (including via email, mobile notifications, webhooks, or other integrations). Alerts are provided solely for informational and educational purposes. Delivery is not guaranteed, may be delayed or interrupted, and may fail due to third-party services, connectivity issues, rate limits, or other factors outside our control.
                    </p>
                    <p>
                      You are solely responsible for how you use alerts, including any routing to brokerages, automation systems, or third-party tools. Hunts Pip does not execute trades, does not monitor your accounts, and does not accept responsibility or liability for any trading or investment decisions you make in reliance on alerts, signals, webhooks, or any other features. None of our features constitute investment advice or personalized investment advice.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Testimonials Disclaimer</h4>
                    <p className="mb-2">
                      Testimonials appearing on this website may not be representative of other clients or customers and is not a guarantee of future performance or success. Any trading results depicted in testimonials are not verified and we have no basis for believing that individual experiences depicted are typical considering that results will vary given many factors such as skill, risk management, experience, and the fact that trading and investing are very high-risk activities where it is likely you will lose money.
                    </p>
                    <p>
                      As a provider of technical analysis tools and strategies, we do not have access to the personal trading accounts or brokerage statements of our customers. As a result, we have no reason to believe our customers perform better or worse than traders as a whole based on any content, tool, or platform feature we provide.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Hunts Pip Is Not An Investment Adviser</h4>
                    <p className="mb-2">
                      Hunts Pip is not registered as an investment adviser with the U.S. Securities and Exchange Commission. Rather, Hunts Pip relies upon the &quot;publisher&apos;s exclusion&quot; from the definition of &quot;investment adviser&quot; as provided under Section 202(a)(11) (D) of the Investment Advisers Act of 1940 (the &quot;Advisers Act&quot;) and corresponding state laws. As such, Hunts Pip does not offer or provide personalized investment advice and nothing in these materials should be construed as investment advice within the meaning of the Advisers Act.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Informational and Educational Purposes Only</h4>
                    <p className="mb-2">
                      To the extent any of the content, material, information and/or any other kind of informational offering published, broadcast, or otherwise stated on this, and/or associated websites, may be deemed to be &quot;investment advice&quot;, such information is impersonal and not tailored to the investment needs of any specific person. The information contained within this, and/or, associated websites, is provided for informational and educational purposes only.
                    </p>
                    <p className="mb-2">
                      The information should not be construed as investment or trading advice and is not meant to be a solicitation or recommendation to buy, sell, or hold any positions in any indices or financial markets mentioned. The content and information provided by Hunts Pip, the website and the products and services of Hunts Pip, is solely incidental to the business and activities of Hunts Pip in providing educational tools for technical analysis and a platform for building, testing, and analyzing technical analysis strategies.
                    </p>
                    <p>
                      Hunts Pip does not, and will not, provide you with any legal, tax, estate planning or accounting advice, or any advice regarding the suitability, profitability or appropriateness for you of any security, investment, financial product, investment strategy or other matter. The data, content and information within the tools, scanners, screeners, alerts, strategies, and backtests should not be construed as investment or trading advice and is not meant to be a solicitation or recommendation to buy, sell, or hold any positions in any securities or to engage in any other transaction.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">TradingView Disclosure</h4>
                    <p>
                      Charts used on this site are by TradingView in which the majority of our technical indicators are built on. TradingView® is a registered trademark of TradingView, Inc. www.TradingView.com. TradingView® has no affiliation with the owner, developer, or provider of the Services described herein.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Copyright */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              © 2025 HUNTS PIP. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
