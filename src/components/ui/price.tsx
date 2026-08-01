"use client";

import { useCurrency } from "@/components/layout/currency-provider";
import { cn } from "@/lib/utils";

type PriceProps = {
  amountGbp: number;
  prefix?: string;
  className?: string;
};

export function Price({ amountGbp, prefix = "", className }: PriceProps) {
  const { formatPrice } = useCurrency();
  return <span className={cn(className)}>{prefix}{formatPrice(amountGbp)}</span>;
}

export function PriceFrom({ amountGbp, className }: { amountGbp: number; className?: string }) {
  const { formatPriceFrom } = useCurrency();
  return <span className={cn(className)}>{formatPriceFrom(amountGbp)}</span>;
}
