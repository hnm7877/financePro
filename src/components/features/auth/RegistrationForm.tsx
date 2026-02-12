"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerSchema, type RegisterSchema } from "./schema";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToastStore } from "@/store/useToastStore";
import { COUNTRIES } from "@/data/countries";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

const EMPLOYEES_OPTIONS = [
  { label: "1 associé (Solo)", value: "1" },
  { label: "2 associés", value: "2" },
  { label: "3 associés", value: "3" },
  { label: "4 associés", value: "4" },
  { label: "5 associés ou plus", value: "5+" },
];

export function RegistrationForm() {
  const { addToast } = useToastStore();
  const { setUser } = useUserStore();
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const selectedCountryCode = watch("country");
  
  const selectedCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.code === selectedCountryCode);
  }, [selectedCountryCode]);

  const countryOptions = useMemo(() => {
    return COUNTRIES.map((c) => ({
      label: `${c.flag} ${c.name}`,
      value: c.code,
    }));
  }, []);

  const mutation = useMutation({
    mutationFn: async (data: RegisterSchema) => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Une erreur est survenue lors de l'inscription.");
      }

      return response.json();
    },
    onSuccess: (_data, variables) => {
      addToast("Inscription réussie ! Bienvenue sur FinTrack PRO.", "success");
      
      // Simulating login by setting user in store
      setUser({
        fullName: variables.fullName,
        companyName: variables.companyName,
        country: variables.country,
        phoneNumber: variables.phoneNumber,
      });

      setSuccess(true);
    },
    onError: () => {
      addToast("Erreur lors de l'inscription. Veuillez réessayer.", "error");
    },
  });

  const onSubmit = (data: RegisterSchema) => {
    mutation.mutate(data);
  };

  if (success) {
      return (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Compte créé avec succès !</h2>
              <p className="text-gray-500 mb-6">Votre espace est prêt.</p>
              <Button onClick={() => router.push("/dashboard")}>Accéder au Tableau de Bord</Button>
          </div>
      )
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nom Complet */}
        <Input
          label="Nom complet"
          placeholder="Jean Dupont"
          icon="person"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        {/* Nom de la société */}
        <Input
          label="Nom de la société"
          placeholder="Ex: FinTrack SAS"
          icon="business"
          error={errors.companyName?.message}
          {...register("companyName")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre d'associés */}
          <Select
            label="Nombre d'associés"
            icon="group"
            options={EMPLOYEES_OPTIONS}
            error={errors.employeesCount?.message}
            {...register("employeesCount")}
          />

          {/* Site web */}
          <Input
            label="Site web professionnel"
            placeholder="www.votreentreprise.fr"
            icon="language"
            error={errors.website?.message}
            {...register("website")}
          />

          {/* Pays */}
          <Select
            label="Pays"
            placeholder="Sélectionner un pays"
            icon="public"
            options={countryOptions}
            error={errors.country?.message}
            {...register("country")}
          />

          {/* Téléphone */}
          <Input
            label="Numéro de téléphone"
            placeholder="6 12 34 56 78"
            icon="call"
            type="tel"
            prefix={selectedCountry?.dial_code}
            error={errors.phoneNumber?.message}
            {...register("phoneNumber")}
          />
        </div>

        {/* Email */}
        <div>
          <Input
            label="E-mail professionnel"
            placeholder="jean.dupont@votreentreprise.com"
            icon="mail"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <p className="mt-2 text-xs text-gray-400">
            Nous recommandons d'utiliser une adresse e-mail professionnelle.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Button type="submit" isLoading={mutation.isPending}>
            Créer mon compte professionnel
          </Button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          Données sécurisées par chiffrement de niveau bancaire
        </div>
        <p className="text-xs text-center text-gray-400 max-w-[340px]">
          En créant un compte, vous acceptez nos{" "}
          <Link href="#" className="text-primary hover:underline">
            Conditions d'Utilisation
          </Link>{" "}
          et notre{" "}
          <Link href="#" className="text-primary hover:underline">
            Politique de Confidentialité
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
