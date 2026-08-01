export type CurrencyCode = "GBP" | "PKR" | "SAR";

/** Admin stores all prices in GBP; these rates convert for display only. */
export const CURRENCY_CONFIG: Record<
  CurrencyCode,
  { label: string; symbol: string; locale: string; rateFromGbp: number }
> = {
  GBP: { label: "British Pound", symbol: "£", locale: "en-GB", rateFromGbp: 1 },
  PKR: { label: "Pakistani Rupee", symbol: "Rs", locale: "en-PK", rateFromGbp: 375 },
  SAR: { label: "Saudi Riyal", symbol: "SR", locale: "en-SA", rateFromGbp: 4.76 },
};

const VALID: CurrencyCode[] = ["GBP", "PKR", "SAR"];

export function isCurrencyCode(value: string | null | undefined): value is CurrencyCode {
  return VALID.includes(value as CurrencyCode);
}

/** Map Cloudflare country code → display currency. */
export function currencyFromCountry(countryCode: string | null | undefined): CurrencyCode {
  const country = countryCode?.toUpperCase() || "";
  if (country === "PK") return "PKR";
  if (country === "SA") return "SAR";
  if (country === "GB") return "GBP";
  return "GBP";
}

export function convertFromGbp(amountGbp: number, currency: CurrencyCode): number {
  const rate = CURRENCY_CONFIG[currency].rateFromGbp;
  if (currency === "GBP") return amountGbp;
  return Math.round(amountGbp * rate);
}

export function formatPrice(amountGbp: number, currency: CurrencyCode): string {
  const converted = convertFromGbp(amountGbp, currency);
  const { locale, symbol } = CURRENCY_CONFIG[currency];

  if (currency === "PKR") {
    return `${symbol} ${converted.toLocaleString(locale, { maximumFractionDigits: 0 })}`;
  }
  if (currency === "SAR") {
    return `${converted.toLocaleString(locale, { maximumFractionDigits: 0 })} ${symbol}`;
  }
  return `${symbol}${converted.toLocaleString(locale, { maximumFractionDigits: 0 })}`;
}

export function formatPriceFrom(amountGbp: number, currency: CurrencyCode): string {
  return `From ${formatPrice(amountGbp, currency)}`;
}
