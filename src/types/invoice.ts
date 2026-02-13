export enum InvoiceCategory {
  // Frais Généraux & Bureau
  SERVICES_CLOUD = "Services Cloud",
  LOGICIELS_SAAS = "Logiciels & SaaS",
  FOURNITURES_BUREAU = "Fournitures de bureau",
  LOYER_COWORKING = "Loyer & Coworking",
  ELECTRICITE_INTERNET = "Électricité & Internet",
  ASSURANCES = "Assurances",

  // Marketing & Commercial
  PUBLICITE_ADS = "Publicité & Ads",
  ABONNEMENTS_MARKETING = "Abonnements Marketing",
  EVENEMENTS_SALONS = "Événements & Salons",
  REPAS_AFFAIRES = "Repas d'affaires",
  CADEAUX_CLIENTS = "Cadeaux clients",

  // Ressources Humaines & Services
  SOUS_TRAITANCE = "Sous-traitance & Freelance",
  HONORAIRES_CONSEIL = "Honoraires & Conseil",
  FORMATION = "Formation",
  RECRUTEMENT = "Recrutement",

  // Logistique & Transport
  ACHAT_MARCHANDISES = "Achat de marchandises",
  LOGISTIQUE_STOCKAGE = "Logistique & Stockage",
  TRANSPORT_LIVRAISON = "Transport & Livraison",
  CARBURANT_PEAGE = "Carburant & Péage",
  VOYAGES_DEPLACEMENTS = "Voyages & Déplacements",

  // Divers
  MAINTENANCE_REPARATION = "Maintenance & Réparation",
  BANCARIRES_FRAIS = "Frais bancaires",
  IMPOTS_TAXES = "Impôts & Taxes",
  AUTRES = "Autres",
}

export const CATEGORY_ICONS: Record<InvoiceCategory, string> = {
  [InvoiceCategory.SERVICES_CLOUD]: "cloud",
  [InvoiceCategory.LOGICIELS_SAAS]: "terminal",
  [InvoiceCategory.FOURNITURES_BUREAU]: "edit_note",
  [InvoiceCategory.LOYER_COWORKING]: "corporate_fare",
  [InvoiceCategory.ELECTRICITE_INTERNET]: "router",
  [InvoiceCategory.ASSURANCES]: "verified_user",
  [InvoiceCategory.PUBLICITE_ADS]: "ads_click",
  [InvoiceCategory.ABONNEMENTS_MARKETING]: "campaign",
  [InvoiceCategory.EVENEMENTS_SALONS]: "event",
  [InvoiceCategory.REPAS_AFFAIRES]: "restaurant",
  [InvoiceCategory.CADEAUX_CLIENTS]: "featured_seasonal_and_gifts",
  [InvoiceCategory.SOUS_TRAITANCE]: "engineering",
  [InvoiceCategory.HONORAIRES_CONSEIL]: "gavel",
  [InvoiceCategory.FORMATION]: "school",
  [InvoiceCategory.RECRUTEMENT]: "person_search",
  [InvoiceCategory.ACHAT_MARCHANDISES]: "inventory_2",
  [InvoiceCategory.LOGISTIQUE_STOCKAGE]: "warehouse",
  [InvoiceCategory.TRANSPORT_LIVRAISON]: "local_shipping",
  [InvoiceCategory.CARBURANT_PEAGE]: "local_gas_station",
  [InvoiceCategory.VOYAGES_DEPLACEMENTS]: "flight_takeoff",
  [InvoiceCategory.MAINTENANCE_REPARATION]: "build",
  [InvoiceCategory.BANCARIRES_FRAIS]: "account_balance",
  [InvoiceCategory.IMPOTS_TAXES]: "account_balance_wallet",
  [InvoiceCategory.AUTRES]: "more_horiz",
};
