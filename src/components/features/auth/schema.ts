import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Le nom complet est requis"),
  companyName: z.string().min(1, "Le nom de la société est requis"),
  employeesCount: z.string().min(1, "Veuillez sélectionner le nombre d'associés"),
  website: z
    .string()
    .url("Veuillez entrer une URL valide")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Veuillez entrer une adresse e-mail valide"),
  country: z.string().min(1, "Veuillez sélectionner un pays"),
  phoneNumber: z.string().min(6, "Numéro de téléphone invalide"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
