'use client';

import { Pricing } from '@/components/pricing/Pricing';
import { PlanComparison } from '@/components/pricing/PlanComparison';
import { PricingCTA } from '@/components/pricing/PricingCTA';

export default function PricingComponent() {
  return (
    <>
      <Pricing />
      <PlanComparison />
      <PricingCTA />
    </>
  );
}
