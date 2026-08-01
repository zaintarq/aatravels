"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type CurrencyCode,
  formatPrice,
  formatPriceFrom,
  isCurrencyCode,
} from "@/lib/currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountGbp: number) => string;
  formatPriceFrom: (amountGbp: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function readCurrencyCookie(): CurrencyCode | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)currency=([^;]+)/);
  const value = match?.[1];
  return isCurrencyCode(value) ? value : null;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("GBP");

  useEffect(() => {
    const saved = readCurrencyCookie();
    if (saved) setCurrencyState(saved);
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    document.cookie = `currency=${code}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setCurrencyState(code);
  }, []);

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      formatPrice: (amountGbp: number) => formatPrice(amountGbp, currency),
      formatPriceFrom: (amountGbp: number) => formatPriceFrom(amountGbp, currency),
    }),
    [currency, setCurrency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
