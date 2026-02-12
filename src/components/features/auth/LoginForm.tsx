"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, type LoginSchema } from "./login-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToastStore } from "@/store/useToastStore";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export function LoginForm() {
  const { addToast } = useToastStore();
  const { setUser } = useUserStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginSchema) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur de connexion");
      }

      return response.json();
    },
    onSuccess: (data) => {
      addToast("Connexion réussie !", "success");
      setUser(data);
      router.push("/dashboard");
    },
    onError: (error: any) => {
      addToast(error.message || "Identifiants invalides", "error");
    },
  });

  const onSubmit = (data: LoginSchema) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div>
          <label
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
            htmlFor="email"
          >
            E-mail professionnel
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-xl font-variation-settings-FILL-0">
                alternate_email
              </span>
            </div>
            <input
              className={`block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-[#0d1117] border ${
                errors.email ? "border-red-500" : "border-slate-200 dark:border-slate-700"
              } rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm`}
              id="email"
              placeholder="nom@entreprise.fr"
              type="email"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <Link
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              href="#"
            >
              Oublié ?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-xl font-variation-settings-FILL-0">
                lock
              </span>
            </div>
            <input
              className={`block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-[#0d1117] border ${
                errors.password ? "border-red-500" : "border-slate-200 dark:border-slate-700"
              } rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm`}
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-variation-settings-FILL-0">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            className="h-4 w-4 text-primary focus:ring-primary/50 border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-background-dark cursor-pointer"
            id="remember-me"
            type="checkbox"
            {...register("rememberMe")}
          />
          <label
            className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
            htmlFor="remember-me"
          >
            Se souvenir de moi
          </label>
        </div>

        {/* Primary CTA */}
        <Button 
          type="submit" 
          isLoading={mutation.isPending}
          className="w-full"
        >
          <span className="material-symbols-outlined mr-2 text-lg font-variation-settings-FILL-0">login</span>
          Se connecter
        </Button>
      </form>

      {/* Social/Other Logins */}
      <div className="mt-8 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-[#161b22] text-slate-500 font-medium uppercase tracking-wider text-xs">
            Ou continuer avec
          </span>
        </div>
      </div>

      <div className="mt-6">
        <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-semibold text-slate-700 dark:text-slate-300">
          <img
            alt=""
            className="h-5 w-5"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCExdEBwmQWT2GxQkSac1Hyqhp4J9wCg4IQXxlWciSZ8w4QTQdCARuUjkWadNrblPuM8Gtrbs7I9w4CQDdKUAWCJ1DZOqYbFCjnVw7-aNXwPPvVPFX3sFIifADuJYjg5meXoxd7M-Mg4luQ2zY3Che3-LwwHMDQ7f18XlzkqhbrcoCijeVuJdQErlj8JuvIuFACC_J0MfVgXvT9Z1NPPXLgWPrb2PqFRp-g3gn1VQbDcmfGShfvvCFATFGYFxDInGQIPdmw6sfD-Nwr"
          />
          Connexion SSO Entreprise
        </button>
      </div>
    </div>
  );
}
