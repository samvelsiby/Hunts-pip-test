'use client';

import { TIERS } from "@/config/pricing";
import { cn } from "@/lib/utils";

// Define the features to compare across plans
const COMPARISON_FEATURES = [
  { name: "Trading Signals", description: "Access to trading signals and alerts" },
  { name: "Keyword Access", description: "Search and filter by keywords" },
  { name: "Support", description: "Customer support options" },
  { name: "Analytics", description: "Trading performance analytics" },
  { name: "Custom Alerts", description: "Set up personalized trading alerts" },
  { name: "Mobile Access", description: "Access from mobile devices" },
  { name: "AI Insights", description: "AI-powered trading recommendations" },
  { name: "Custom Strategies", description: "Create and save custom strategies" },
  { name: "API Access", description: "Programmatic access via API" },
  { name: "White Label", description: "White label options for businesses" },
  { name: "Account Manager", description: "Dedicated account manager" },
];

// Map features to tiers
type FeatureName = typeof COMPARISON_FEATURES[number]['name'];
type TierId = 'free' | 'pro' | 'premium';

type FeatureAvailability = {
  [key in FeatureName]: {
    [key in TierId]: string;
  };
};

const FEATURE_AVAILABILITY: FeatureAvailability = {
  "Trading Signals": { free: "Basic", pro: "Advanced", premium: "Advanced+" },
  "Keyword Access": { free: "Limited", pro: "Unlimited", premium: "Unlimited" },
  "Support": { free: "Community", pro: "Priority", premium: "24/7 Premium" },
  "Analytics": { free: "Basic", pro: "Advanced", premium: "Advanced+" },
  "Custom Alerts": { free: "❌", pro: "✓", premium: "✓" },
  "Mobile Access": { free: "❌", pro: "✓", premium: "✓" },
  "AI Insights": { free: "❌", pro: "❌", premium: "✓" },
  "Custom Strategies": { free: "❌", pro: "❌", premium: "✓" },
  "API Access": { free: "❌", pro: "❌", premium: "✓" },
  "White Label": { free: "❌", pro: "❌", premium: "✓" },
  "Account Manager": { free: "❌", pro: "❌", premium: "✓" },
} as FeatureAvailability;

export const PlanComparison = () => {
  return (
    <section className="py-20 px-4 sm:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Compare Plans</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See which plan is right for you with our detailed comparison
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-4 px-6 text-left text-gray-400 font-medium">Features</th>
                {TIERS.map((tier) => (
                  <th 
                    key={tier.id} 
                    className={cn(
                      "py-4 px-6 text-center",
                      tier.highlighted ? "text-blue-400" : tier.popular ? "text-green-400" : "text-white"
                    )}
                  >
                    <span className="font-bold text-lg">{tier.name}</span>
                    <div className="text-sm font-normal text-gray-400 mt-1">
                      ${tier.price.monthly}/mo
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((feature, index) => (
                <tr 
                  key={feature.name} 
                  className={cn(
                    "border-b border-gray-800",
                    index % 2 === 0 ? "bg-gray-900/30" : "bg-transparent"
                  )}
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">{feature.name}</div>
                    <div className="text-sm text-gray-400">{feature.description}</div>
                  </td>
                  {TIERS.map((tier) => {
                    const value = FEATURE_AVAILABILITY[feature.name]?.[tier.id as keyof typeof FEATURE_AVAILABILITY[typeof feature.name]];
                    
                    return (
                      <td 
                        key={`${tier.id}-${feature.name}`} 
                        className={cn(
                          "py-4 px-6 text-center",
                          value === "✓" 
                            ? tier.highlighted 
                              ? "text-blue-400" 
                              : tier.popular 
                                ? "text-green-400" 
                                : "text-white"
                            : value === "❌" 
                              ? "text-gray-500" 
                              : "text-gray-300"
                        )}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
