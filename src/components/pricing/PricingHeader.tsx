'use client';

import { Tab } from "@/components/ui/tab";

export const PricingHeader = ({
  title,
  subtitle,
  frequencies,
  selectedFrequency,
  onFrequencyChange,
}: {
  title: string;
  subtitle: string;
  frequencies: string[];
  selectedFrequency: string;
  onFrequencyChange: (frequency: string) => void;
}) => (
  <div className="space-y-7 text-center">
    <div className="space-y-4">
      <h1 className="text-4xl font-bold text-white md:text-5xl">{title}</h1>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
    </div>
    <div className="mx-auto flex w-fit rounded-full bg-gray-900 p-1">
      {frequencies.map((freq) => (
        <Tab
          key={freq}
          text={freq}
          selected={selectedFrequency === freq}
          setSelected={onFrequencyChange}
          discount={freq === "yearly"}
        />
      ))}
    </div>
  </div>
);
