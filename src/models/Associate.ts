import mongoose from "mongoose";

export interface IAssociate extends mongoose.Document {
  companyId: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  roles: ('Dirigeant' | 'Associé' | 'Gérant' | 'Investisseur' | 'Conseiller')[];
  share: number;
  avatar: string;
  isPrimary: boolean;
  isActive?: boolean; // Deprecated, use status
  status: 'Actif' | 'Suspendu';
  totalExpenses: number;
  createdAt: Date;
  updatedAt: Date;
}

const AssociateSchema = new mongoose.Schema<IAssociate>(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Le nom de l'associé est requis"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email de l'associé est requis"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    roles: [{
      type: String,
      enum: ['Dirigeant', 'Associé', 'Gérant', 'Investisseur', 'Conseiller'],
    }],
    share: {
      type: Number,
      required: [true, "La part est requise"],
      min: 0,
      max: 1,
    },
    avatar: {
      type: String,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Actif', 'Suspendu'],
      default: 'Actif',
    },
    totalExpenses: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Associate = mongoose.models.Associate ||
  mongoose.model<IAssociate>("Associate", AssociateSchema);

export default Associate;
