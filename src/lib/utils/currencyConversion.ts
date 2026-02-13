
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 0.93, // 1 USD = 0.93 EUR
  GBP: 1.17, // 1 GBP = 1.17 EUR
  CHF: 1.06, // 1 CHF = 1.06 EUR
  CAD: 0.69, // 1 CAD = 0.69 EUR
  AUD: 0.61, // 1 AUD = 0.61 EUR
  JPY: 0.0062, // 1 JPY = 0.0062 EUR
  CNY: 0.13, // 1 CNY = 0.13 EUR
  // Afrique de l'Ouest & Centrale (CFA)
  XOF: 0.0015, // 1 XOF = 0.0015 EUR (Fixed)
  XAF: 0.0015, // 1 XAF = 0.0015 EUR (Fixed)
  
  // Afrique du Nord
  MAD: 0.092, // Maroc
  TND: 0.30,  // Tunisie
  DZD: 0.0068, // Algérie
  EGP: 0.019, // Egypte
  LYD: 0.19, // Libye
  MRU: 0.023, // Mauritanie

  // Afrique de l'Est
  KES: 0.0071, // Kenya
  UGX: 0.00024, // Ouganda
  TZS: 0.00035, // Tanzanie
  RWF: 0.00072, // Rwanda
  BIF: 0.00032, // Burundi
  ETB: 0.0080, // Ethiopie
  DJF: 0.0052, // Djibouti
  
  // Afrique de l'Ouest (Hors CFA)
  NGN: 0.00060, // Nigeria
  GHS: 0.058, // Ghana
  GNF: 0.00010, // Guinée
  GMD: 0.013, // Gambie
  CVE: 0.0090, // Cap-Vert (Fixed to Euro)
  SLL: 0.00004, // Sierra Leone
  LRD: 0.0048, // Liberia

  // Afrique Australe
  ZAR: 0.049, // Afrique du Sud
  NAD: 0.049, // Namibie (Pegged to ZAR)
  BWP: 0.068, // Botswana
  MZN: 0.014, // Mozambique
  AOA: 0.0011, // Angola
  ZMW: 0.035, // Zambie
  MWK: 0.00057, // Malawi
  LSL: 0.049, // Lesotho
  SZL: 0.049, // Eswatini

  // Afrique Centrale (Hors CFA)
  CDF: 0.00033, // RDC
  STN: 0.040, // Sao Tomé (Fixed)

  // Océan Indien
  MGA: 0.00020, // Madagascar
  MUR: 0.020, // Maurice
  SCR: 0.067, // Seychelles
  KMF: 0.0020, // Comores (Fixed)

  EUR: 1,
};

/**
 * Convert an amount from a foreign currency to EUR (Local Base).
 * Rates are approximate/fixed for now.
 */
export function convertToEuro(amount: number, currency: string): number {
  const rate = EXCHANGE_RATES[currency.toUpperCase()];
  // If currency not found or is EUR, return amount as is (or handle error)
  if (rate === undefined) return amount;
  return Number((amount * rate).toFixed(2));
}

/**
 * Convert from EUR to target currency (e.g. for display)
 */
export function convertFromEuro(amount: number, targetCurrency: string): number {
  const rate = EXCHANGE_RATES[targetCurrency.toUpperCase()];
  if (!rate) return amount;
  return Number((amount / rate).toFixed(2));
}
