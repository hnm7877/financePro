import mongoose from "mongoose";
import { ExpenseCategory, ExpensePeriod } from "@/types/expense";

export interface IExpense extends mongoose.Document {
  companyId: mongoose.Schema.Types.ObjectId;
  description: string;
  amount: number;
  category: ExpenseCategory;
  period: ExpensePeriod;
  startDate: Date;
  endDate?: Date;
  status: "Active" | "Inactive";
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new mongoose.Schema<IExpense>(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
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
      min: [0, "Le montant ne peut pas être négatif"],
    },
    category: {
      type: String,
      enum: Object.values(ExpenseCategory),
      required: [true, "La catégorie est requise"],
    },
    period: {
      type: String,
      enum: Object.values(ExpensePeriod),
      required: [true, "La période est requise"],
    },
    startDate: {
      type: Date,
      required: [true, "La date de début est requise"],
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances des requêtes
ExpenseSchema.index({ companyId: 1, period: 1, startDate: -1 });
ExpenseSchema.index({ companyId: 1, status: 1 });

export default mongoose.models.Expense ||
  mongoose.model<IExpense>("Expense", ExpenseSchema);
