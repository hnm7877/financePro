import mongoose from "mongoose";
import { RevenueCategory } from "@/types/revenue";
import { ExpensePeriod } from "@/types/expense";

export interface IRevenue extends mongoose.Document {
  companyId: mongoose.Types.ObjectId;
  description: string;
  amount: number;
  category: RevenueCategory;
  period: ExpensePeriod;
  date: Date;
  status: "Encaissé" | "En attente";
  createdAt: Date;
  updatedAt: Date;
}

const RevenueSchema = new mongoose.Schema<IRevenue>(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "L'ID de l'entreprise est requis"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "La description est requise"],
      trim: true,
      minlength: [3, "La description doit contenir au moins 3 caractères"],
      maxlength: [200, "La description ne peut pas dépasser 200 caractères"],
    },
    amount: {
      type: Number,
      required: [true, "Le montant est requis"],
      min: [0, "Le montant doit être positif"],
      max: [10000000, "Le montant ne peut pas dépasser 10 000 000"],
    },
    category: {
      type: String,
      enum: Object.values(RevenueCategory),
      required: [true, "La catégorie est requise"],
    },
    period: {
      type: String,
      enum: Object.values(ExpensePeriod),
      required: [true, "La période est requise"],
    },
    date: {
      type: Date,
      required: [true, "La date est requise"],
      index: true,
    },
    status: {
      type: String,
      enum: ["Encaissé", "En attente"],
      default: "Encaissé",
    },
  },
  {
    timestamps: true,
  }
);

// Index composé pour optimiser les requêtes
RevenueSchema.index({ companyId: 1, date: -1 });
RevenueSchema.index({ companyId: 1, period: 1, status: 1 });

export default mongoose.models.Revenue || mongoose.model<IRevenue>("Revenue", RevenueSchema);
