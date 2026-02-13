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
  // Afrique de l'Ouest
  {
    name: "Bénin",
    code: "BJ",
    flag: "🇧🇯",
    dial_code: "+229",
    currency: { code: "XOF", symbol: "CFA", name: "Franc CFA" },
  },
  {
    name: "Burkina Faso",
    code: "BF",
    flag: "🇧🇫",
    dial_code: "+226",
    currency: { code: "XOF", symbol: "CFA", name: "Franc CFA" },
  },
  {
    name: "Mali",
    code: "ML",
    flag: "🇲🇱",
    dial_code: "+223",
    currency: { code: "XOF", symbol: "CFA", name: "Franc CFA" },
  },
  {
    name: "Togo",
    code: "TG",
    flag: "🇹🇬",
    dial_code: "+228",
    currency: { code: "XOF", symbol: "CFA", name: "Franc CFA" },
  },
  {
    name: "Nigéria",
    code: "NG",
    flag: "🇳🇬",
    dial_code: "+234",
    currency: { code: "NGN", symbol: "₦", name: "Naira" },
  },
  {
    name: "Ghana",
    code: "GH",
    flag: "🇬🇭",
    dial_code: "+233",
    currency: { code: "GHS", symbol: "₵", name: "Cedi" },
  },
  // Afrique Centrale
  {
    name: "Cameroun",
    code: "CM",
    flag: "🇨🇲",
    dial_code: "+237",
    currency: { code: "XAF", symbol: "FCFA", name: "Franc CFA" },
  },
  {
    name: "Gabon",
    code: "GA",
    flag: "🇬🇦",
    dial_code: "+241",
    currency: { code: "XAF", symbol: "FCFA", name: "Franc CFA" },
  },
  {
    name: "RDC",
    code: "CD",
    flag: "🇨🇩",
    dial_code: "+243",
    currency: { code: "CDF", symbol: "FC", name: "Franc congolais" },
  },
  {
    name: "Congo",
    code: "CG",
    flag: "🇨🇬",
    dial_code: "+242",
    currency: { code: "XAF", symbol: "FCFA", name: "Franc CFA" },
  },
  // Afrique de l'Est
  {
    name: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    dial_code: "+254",
    currency: { code: "KES", symbol: "KSh", name: "Shilling kényan" },
  },
  {
    name: "Éthiopie",
    code: "ET",
    flag: "🇪🇹",
    dial_code: "+251",
    currency: { code: "ETB", symbol: "Br", name: "Birr éthiopien" },
  },
  {
    name: "Tanzanie",
    code: "TZ",
    flag: "🇹🇿",
    dial_code: "+255",
    currency: { code: "TZS", symbol: "TSh", name: "Shilling tanzanien" },
  },
  {
    name: "Ouganda",
    code: "UG",
    flag: "🇺🇬",
    dial_code: "+256",
    currency: { code: "UGX", symbol: "USh", name: "Shilling ougandais" },
  },
  {
    name: "Rwanda",
    code: "RW",
    flag: "🇷🇼",
    dial_code: "+250",
    currency: { code: "RWF", symbol: "FRw", name: "Franc rwandais" },
  },
  // Afrique Australe
  {
    name: "Afrique du Sud",
    code: "ZA",
    flag: "🇿🇦",
    dial_code: "+27",
    currency: { code: "ZAR", symbol: "R", name: "Rand" },
  },
  {
    name: "Madagascar",
    code: "MG",
    flag: "🇲🇬",
    dial_code: "+261",
    currency: { code: "MGA", symbol: "Ar", name: "Ariary" },
  },
  // Afrique du Nord (Complément)
  {
    name: "Égypte",
    code: "EG",
    flag: "🇪🇬",
    dial_code: "+20",
    currency: { code: "EGP", symbol: "£", name: "Livre égyptienne" },
  },
];
