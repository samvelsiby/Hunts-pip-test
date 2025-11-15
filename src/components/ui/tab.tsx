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
        "relative w-fit px-6 py-2 text-sm font-semibold capitalize text-white transition-colors",
        "flex items-center justify-center gap-2.5",
      )}
    >
      {selected && (
        <span
          className="absolute inset-0 z-0 rounded-full bg-[linear-gradient(180deg,#FF3B3B,#C01717)] shadow-[0_0_20px_rgba(248,113,113,0.55)]"
        />
      )}
      {!selected && (
        <span
          className="absolute inset-0 z-0 rounded-full bg-[#1F1F23]"
        />
      )}

      <span className="relative z-10">{text}</span>

      {discount && selected && (
        <span
          className={cn(
            "relative z-10 ml-2 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold text-black bg-[#D4D4D8]",
          )}
        >
          Save 30%
        </span>
      )}
    </button>
  );
};
