"use client";

import { useCurrency } from "@/components/layout/currency-provider";
import { CURRENCY_CONFIG, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";

const ORDER: CurrencyCode[] = ["GBP", "PKR", "SAR"];

export function CurrencySwitcher({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <label className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="sr-only">Currency</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="rounded-lg border border-ink-900/10 bg-white px-2 py-1.5 text-xs font-medium text-ink-700 dark:border-white/10 dark:bg-ink-800 dark:text-white/80"
        aria-label="Select currency"
      >
        {ORDER.map((code) => (
          <option key={code} value={code}>
            {code} ({CURRENCY_CONFIG[code].symbol})
          </option>
        ))}
      </select>
    </label>
  );
}
