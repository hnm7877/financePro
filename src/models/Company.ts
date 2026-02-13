import mongoose from "mongoose";

export interface Company extends mongoose.Document {
  fullName: string;
  companyName: string;
  employeesCount: string;
  website?: string;
  email: string;
  country: string;
  phoneNumber: string;
  siret?: string;
  address?: string;
  currency?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new mongoose.Schema<Company>(
  {
    fullName: {
      type: String,
      required: [true, "Le nom complet est requis"],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Le nom de la société est requis"],
      trim: true,
    },
    employeesCount: {
      type: String,
      required: [true, "Le nombre d'associés est requis"],
    },
    website: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez entrer une adresse email valide",
      ],
    },
    country: {
      type: String,
      required: [true, "Le pays est requis"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Le numéro de téléphone est requis"],
      trim: true,
    },
    siret: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      default: "EUR",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent overwrite model compilation error in Next.js hot reload
export const Company = mongoose.models.Company ||
  mongoose.model<Company>("Company", CompanySchema);

export default Company;
