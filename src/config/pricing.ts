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
    description: "Core Hunts Pip toolkit for market structure visibility",
    features: [
      "Day Separator",
      "Sessions",
      "Market Structure",
      "Premium & Discount",
      "Fair Value Gaps",
      "Order Blocks",
      "Mitigation Blocks",
      "VWAP"
    ],
    cta: "Get Started Free",
  },
  {
    id: "premium",
    name: "Premium",
    price: {
      monthly: 30,
      yearly: 25,
    },
    description: "Premium indicator suite + everything in Free",
    features: [
      "SMC",
      "Breaker Blocks",
      "SMT",
      "Inverse Fair Value Gap",
      "Support and Resistance Zones",
      "Dealers Range - CBDR",
      "Day Separator + Sessions + True Day Open Week Open"
    ],
    cta: "Subscribe Now",
    popular: true,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: {
      monthly: 50,
      yearly: 42,
    },
    description: "Ultimate access (Free + Premium + Ultimate indicators)",
    features: [
      "Liquidity Sweep",
      "Reversal Prediction Oscillator",
      "Multi-frame OTE",
      "SMC Multi-frame Marker",
      "Multi-frame OB",
      "Multi-frame FVG"
    ],
    cta: "Subscribe Now",
    highlighted: true,
  }
];
