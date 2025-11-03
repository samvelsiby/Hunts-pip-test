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
    description: "Get started with basic features",
    features: [
      "Basic trading signals",
      "Limited keyword access",
      "Community support",
      "Basic analytics"
    ],
    cta: "Get Started Free",
  },
  {
    id: "pro",
    name: "Pro",
    price: {
      monthly: 30,
      yearly: 25,
    },
    description: "Advanced features for serious traders",
    features: [
      "Advanced trading signals",
      "Unlimited keyword access",
      "Priority support",
      "Advanced analytics",
      "Custom alerts",
      "Mobile app access"
    ],
    cta: "Subscribe Now",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: {
      monthly: 50,
      yearly: 42,
    },
    description: "Complete trading solution",
    features: [
      "All Pro features",
      "AI-powered insights",
      "24/7 premium support",
      "Custom strategies",
      "API access",
      "White-label options",
      "Personal account manager"
    ],
    cta: "Subscribe Now",
    highlighted: true,
  }
];
