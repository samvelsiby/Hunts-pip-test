'use client';

import { cn } from "@/lib/utils";

interface TabProps {
  text: string;
  selected: boolean;
  setSelected: (text: string) => void;
  discount?: boolean;
}

export const Tab = ({
  text,
  selected,
  setSelected,
  discount = false,
}: TabProps) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={cn(
        "relative w-fit px-4 py-2 text-sm font-semibold capitalize text-white transition-colors",
        discount && "flex items-center justify-center gap-2.5",
      )}
    >
      <span className="relative z-10">{text}</span>
      {selected && (
        <span
          className="absolute inset-0 z-0 rounded-full bg-gray-800 shadow-sm"
        ></span>
      )}
      {discount && (
        <span
          className={cn(
            "relative z-10 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold text-white",
            selected
              ? "bg-green-500"
              : "bg-gray-700",
          )}
        >
          Save 15%
        </span>
      )}
    </button>
  );
};
