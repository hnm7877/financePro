import { z } from "zod";
import { ExpensePeriod } from "./expense";

// Enum pour les catégories de revenus
export enum RevenueCategory {
  VENTES = "Ventes",
  SERVICES = "Services",
  ABONNEMENTS = "Abonnements",
  COMMISSIONS = "Commissions",
  CONSULTING = "Consulting",
  FORMATIONS = "Formations",
  LICENCES = "Licences",
  AUTRES = "Autres",
}

// Interface pour un revenu
export interface Revenue {
  _id: string;
  companyId: string;
  description: string;
  amount: number;
  category: RevenueCategory;
  period: ExpensePeriod;
  date: Date;
  status: "Encaissé" | "En attente";
  createdAt?: Date;
  updatedAt?: Date;
}

// Schéma Zod pour la validation de création de revenu
export const createRevenueSchema = z.object({
  description: z
    .string()
    .min(3, "La description doit contenir au moins 3 caractères")
    .max(200, "La description ne peut pas dépasser 200 caractères"),
  amount: z
    .number()
    .positive("Le montant doit être positif")
    .max(10000000, "Le montant ne peut pas dépasser 10 000 000"),
  category: z.nativeEnum(RevenueCategory),
  period: z.nativeEnum(ExpensePeriod),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Date invalide",
  }),
  status: z.enum(["Encaissé", "En attente"]).optional().default("Encaissé"),
});

// Type inféré depuis le schéma Zod
export type CreateRevenueInput = z.infer<typeof createRevenueSchema>;

// Interface pour le résumé financier (utilisé dans les calculs)
export interface FinancialSummary {
  totalRevenues: number;
  totalExpenses: number;
  netDividends: number;
  period: ExpensePeriod;
  startDate: string;
  endDate: string;
}
