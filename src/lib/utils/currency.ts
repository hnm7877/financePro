import { COUNTRIES } from "@/data/countries";

export function formatCurrency(amount: number, countryCode?: string) {
  const country = COUNTRIES.find((c) => c.code === countryCode);
  const currency = country?.currency || { code: "EUR", symbol: "€" };

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: 2,
  }).format(amount);
}
