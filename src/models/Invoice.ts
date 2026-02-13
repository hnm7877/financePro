import mongoose from "mongoose";
import { InvoiceCategory } from "@/types/invoice";

export interface IInvoice extends mongoose.Document {
  companyId: mongoose.Schema.Types.ObjectId;
  merchant: string;
  date: Date;
  category: InvoiceCategory;
  amount: number;
  status: "À valider" | "Ventilé";
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new mongoose.Schema<IInvoice>(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    merchant: {
      type: String,
      required: [true, "Le marchand est requis"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "La date est requise"],
    },
    category: {
      type: String,
      enum: Object.values(InvoiceCategory),
      required: [true, "La catégorie est requise"],
    },
    amount: {
      type: Number,
      required: [true, "Le montant est requis"],
      min: [0, "Le montant ne peut pas être négatif"],
    },
    status: {
      type: String,
      enum: ["À valider", "Ventilé"],
      default: "À valider",
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Invoice ||
  mongoose.model<IInvoice>("Invoice", InvoiceSchema);
