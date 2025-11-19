'use client';

import { PAYMENT_FREQUENCIES, TIERS } from "@/config/pricing";
import { useState } from "react";
import { PricingCard } from "./PricingCard";
import { PricingHeader } from "./PricingHeader";

export const Pricing = () => {
  const [selectedPaymentFreq, setSelectedPaymentFreq] = useState(
    PAYMENT_FREQUENCIES[1],
  );

  return (
    <section className="flex flex-col items-center gap-10 py-20 px-4 sm:px-8 bg-black overflow-visible">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <PricingHeader
          title="Choose Your Trading Plan"
          subtitle="Select the perfect plan to enhance your trading analysis. Save 30% when you pay yearly."
          frequencies={PAYMENT_FREQUENCIES}
          selectedFrequency={selectedPaymentFreq}
          onFrequencyChange={setSelectedPaymentFreq}
        />

        {/* Pricing Cards */}
        <div className="grid w-full gap-4 sm:gap-8 mt-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-visible">
          {TIERS.map((tier, i) => (
            <PricingCard
              key={i}
              tier={tier}
              paymentFrequency={selectedPaymentFreq}
            />
          ))}
        </div>
        
        <div className="text-center mt-12 space-y-2">
          <p className="text-gray-400">
            All plans include our core trading signals and keyword access
          </p>
          <p className="text-gray-400 text-xs uppercase tracking-widest">
            Premium includes everything in Free · Ultimate includes both Free + Premium
          </p>
        </div>
      </div>
    </section>
  );
};
