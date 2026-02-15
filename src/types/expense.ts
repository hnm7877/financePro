import { z } from "zod";

// Périodes de dépenses
export enum ExpensePeriod {
  DAILY = "Journalier",
  WEEKLY = "Hebdomadaire",
  MONTHLY = "Mensuel",
  QUARTERLY = "Trimestriel",
  ANNUAL = "Annuel",
}

// Catégories de dépenses (alignées avec InvoiceCategory)
export enum ExpenseCategory {
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

// Icônes pour les catégories de dépenses
export const EXPENSE_CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.SERVICES_CLOUD]: "cloud",
  [ExpenseCategory.LOGICIELS_SAAS]: "terminal",
  [ExpenseCategory.FOURNITURES_BUREAU]: "edit_note",
  [ExpenseCategory.LOYER_COWORKING]: "corporate_fare",
  [ExpenseCategory.ELECTRICITE_INTERNET]: "router",
  [ExpenseCategory.ASSURANCES]: "verified_user",
  [ExpenseCategory.PUBLICITE_ADS]: "ads_click",
  [ExpenseCategory.ABONNEMENTS_MARKETING]: "campaign",
  [ExpenseCategory.EVENEMENTS_SALONS]: "event",
  [ExpenseCategory.REPAS_AFFAIRES]: "restaurant",
  [ExpenseCategory.CADEAUX_CLIENTS]: "featured_seasonal_and_gifts",
  [ExpenseCategory.SOUS_TRAITANCE]: "engineering",
  [ExpenseCategory.HONORAIRES_CONSEIL]: "gavel",
  [ExpenseCategory.FORMATION]: "school",
  [ExpenseCategory.RECRUTEMENT]: "person_search",
  [ExpenseCategory.ACHAT_MARCHANDISES]: "inventory_2",
  [ExpenseCategory.LOGISTIQUE_STOCKAGE]: "warehouse",
  [ExpenseCategory.TRANSPORT_LIVRAISON]: "local_shipping",
  [ExpenseCategory.CARBURANT_PEAGE]: "local_gas_station",
  [ExpenseCategory.VOYAGES_DEPLACEMENTS]: "flight_takeoff",
  [ExpenseCategory.MAINTENANCE_REPARATION]: "build",
  [ExpenseCategory.BANCARIRES_FRAIS]: "account_balance",
  [ExpenseCategory.IMPOTS_TAXES]: "account_balance_wallet",
  [ExpenseCategory.AUTRES]: "more_horiz",
};

// Interface TypeScript pour les dépenses
export interface Expense {
  _id?: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  period: ExpensePeriod;
  startDate: string;
  endDate?: string;
  status: "Active" | "Inactive";
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface pour le calcul des dividendes
export interface DividendCalculation {
  associateId: string;
  associateName: string;
  share: number;
  grossRevenue: number;
  expenseShare: number;
  netDividend: number;
}

// Interface pour le résumé financier
export interface FinancialSummary {
  period: ExpensePeriod;
  grossRevenue: number;
  totalExpenses: number;
  netDividends: number;
  netMargin: number;
  previousPeriodChange?: number;
}

// Schéma Zod pour la validation de création de dépense
export const createExpenseSchema = z.object({
  description: z
    .string()
    .min(3, "La description doit contenir au moins 3 caractères")
    .max(200, "La description ne peut pas dépasser 200 caractères"),
  amount: z
    .number()
    .positive("Le montant doit être positif")
    .max(1000000, "Le montant ne peut pas dépasser 1 000 000"),
  category: z.nativeEnum(ExpenseCategory),
  period: z.nativeEnum(ExpensePeriod),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Date de début invalide",
  }),
  endDate: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Date de fin invalide",
    }),
  status: z.enum(["Active", "Inactive"]).optional().default("Active"),
});

// Schéma Zod pour la validation de calcul de dividendes
export const calculateDividendsSchema = z.object({
  period: z.nativeEnum(ExpensePeriod),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Date de début invalide",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Date de fin invalide",
  }),
});

// Type inféré depuis le schéma Zod
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type CalculateDividendsInput = z.infer<typeof calculateDividendsSchema>;
