import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse e-mail valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginSchema = z.infer<typeof loginSchema>;
