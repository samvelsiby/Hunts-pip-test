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
    description: "2 Indicators + 8 Signals - Complete trading solution",
    features: [
      "Liquidity Sweep",
      "Knoxville Divergence",
      "SMC Multi-frame Marker",
      "OTE + Multi-frame Market Structure",
      "CRT MOVES Signal",
      "ORB - ORB + TBL Signal",
      "PDH/PDL RAID PLAYS Signal",
      "PWL/PWH RAID SETUPS Signal",
      "11 or 10 am Reversal Signal",
      "TBL RAID + FVG OR OB + MSS + INVERSION"
    ],
    cta: "Subscribe Now",
    highlighted: true,
  }
];
