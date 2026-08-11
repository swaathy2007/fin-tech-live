import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceChangeProps {
  change: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const PriceChange: React.FC<PriceChangeProps> = ({ change, className, size = "md" }) => {
  const isUp = change >= 0;

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs font-semibold gap-0.5",
    md: "px-2.5 py-1 text-xs font-bold gap-1",
    lg: "px-3 py-1.5 text-sm font-bold gap-1",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md transition-all duration-150",
        isUp
          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20",
        sizeClasses[size],
        className
      )}
    >
      {isUp ? (
        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
      ) : (
        <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
      )}
      <span>
        {isUp ? "+" : ""}
        {change.toFixed(1)}%
      </span>
    </div>
  );
};