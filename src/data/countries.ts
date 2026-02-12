export interface Country {
  name: string;
  code: string;
  flag: string;
  dial_code: string;
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
}

export const COUNTRIES: Country[] = [
  {
    name: "France",
    code: "FR",
    flag: "🇫🇷",
    dial_code: "+33",
    currency: { code: "EUR", symbol: "€", name: "Euro" },
  },
  {
    name: "Belgique",
    code: "BE",
    flag: "🇧🇪",
    dial_code: "+32",
    currency: { code: "EUR", symbol: "€", name: "Euro" },
  },
  {
    name: "Suisse",
    code: "CH",
    flag: "🇨🇭",
    dial_code: "+41",
    currency: { code: "CHF", symbol: "CHF", name: "Franc suisse" },
  },
  {
    name: "Canada",
    code: "CA",
    flag: "🇨🇦",
    dial_code: "+1",
    currency: { code: "CAD", symbol: "$", name: "Dollar canadien" },
  },
  {
    name: "États-Unis",
    code: "US",
    flag: "🇺🇸",
    dial_code: "+1",
    currency: { code: "USD", symbol: "$", name: "Dollar américain" },
  },
  {
    name: "Royaume-Uni",
    code: "GB",
    flag: "🇬🇧",
    dial_code: "+44",
    currency: { code: "GBP", symbol: "£", name: "Livre sterling" },
  },
  {
    name: "Allemagne",
    code: "DE",
    flag: "🇩🇪",
    dial_code: "+49",
    currency: { code: "EUR", symbol: "€", name: "Euro" },
  },
  {
    name: "Espagne",
    code: "ES",
    flag: "🇪🇸",
    dial_code: "+34",
    currency: { code: "EUR", symbol: "€", name: "Euro" },
  },
  {
    name: "Italie",
    code: "IT",
    flag: "🇮🇹",
    dial_code: "+39",
    currency: { code: "EUR", symbol: "€", name: "Euro" },
  },
  {
    name: "Sénégal",
    code: "SN",
    flag: "🇸🇳",
    dial_code: "+221",
    currency: { code: "XOF", symbol: "CFA", name: "Franc CFA" },
  },
  {
    name: "Côte d'Ivoire",
    code: "CI",
    flag: "🇨🇮",
    dial_code: "+225",
    currency: { code: "XOF", symbol: "CFA", name: "Franc CFA" },
  },
  {
    name: "Maroc",
    code: "MA",
    flag: "🇲🇦",
    dial_code: "+212",
    currency: { code: "MAD", symbol: "DH", name: "Dirham marocain" },
  },
  {
    name: "Tunisie",
    code: "TN",
    flag: "🇹🇳",
    dial_code: "+216",
    currency: { code: "TND", symbol: "DT", name: "Dinar tunisien" },
  },
    {
    name: "Algérie",
    code: "DZ",
    flag: "🇩🇿",
    dial_code: "+213",
    currency: { code: "DZD", symbol: "DA", name: "Dinar algérien" },
  },
];
