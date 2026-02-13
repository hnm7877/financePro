import { COUNTRIES } from "@/data/countries";

export function formatCurrency(amount: number, context?: string) {
  // If context is a currency code (3 chars, e.g. "EUR", "USD"), use it directly
  if (context && context.length === 3) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: context,
      minimumFractionDigits: 2,
    }).format(amount);
  }

  // Otherwise assume it's a country code
  const country = COUNTRIES.find((c) => c.code === context);
  const currency = country?.currency || { code: "EUR", symbol: "€" };

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: 2,
  }).format(amount);
}
