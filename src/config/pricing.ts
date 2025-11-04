export const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

export interface PricingTier {
  name: string;
  id: string;
  price: Record<string, number | string>;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  popular?: boolean;
}

export const TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: {
      monthly: 0,
      yearly: 0,
    },
    description: "9 TradingView Indicators - Perfect for beginners",
    features: [
      "Day Separator",
      "Sessions",
      "Market Structure",
      "Premium & Discount",
      "Fair Value Gaps",
      "Order Blocks",
      "Breaker Blocks",
      "Mitigation Blocks",
      "Session VWAP Bands"
    ],
    cta: "Get Started Free",
  },
  {
    id: "pro",
    name: "Premium",
    price: {
      monthly: 30,
      yearly: 25,
    },
    description: "6 Indicators + 3 Signals - Advanced trading tools",
    features: [
      "SMT Divergence",
      "Support & Resistance (CPR, Pivot Points)",
      "CBDR - Dealers Range",
      "Day Separator + Sessions + True Day Open",
      "SMC Markers",
      "Silver Bullet Signal",
      "Unicorn Signal",
      "Retracement to Asian & London FVG"
    ],
    cta: "Subscribe Now",
    popular: true,
  },
  {
    id: "premium",
    name: "Ultimate",
    price: {
      monthly: 50,
      yearly: 42,
    },
    description: "All Premium + Ultimate Features - Complete trading solution",
    features: [
      "All Premium Indicators",
      "Market Structure Auto",
      "Adaptive Trend Pack",
      "Liquidity Map Lite",
      "Momentum Fusion",
      "Session Suite",
      "Risk Box",
      "Breakout Cloud",
      "Divergence Radar",
      "Mean Revert Bands",
      "Range Box",
      "All Premium Strategies",
      "Continuation Engine",
      "Breakout Retest",
      "Liquidity Grab Reversal",
      "VWAP Rotation",
      "Ultimate Indicators",
      "Liquidity Sweep",
      "Knoxville Divergence",
      "Neural Confluence Engine",
      "Smart Order Blocks",
      "Smart Liquidity Map Pro",
      "Volume Matrix",
      "Volatility Probability Channel",
      "Trend Quality Index",
      "Exhaustion Meter",
      "Regime Aware Oscillator",
      "Liquidity Rotation Map",
      "All Ultimate Strategies",
      "Institutional Momentum Model",
      "Trend Ladder",
      "Liquidity Flip Model",
      "Neural Scalper",
      "All Premium & Ultimate Scanners"
    ],
    cta: "Subscribe Now",
    highlighted: true,
  }
];
