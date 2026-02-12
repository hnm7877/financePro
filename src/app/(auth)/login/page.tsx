"use client";

import { LoginForm } from "@/components/features/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center relative overflow-hidden w-full">
      {/* Subtle Background Element */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Brand Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-6 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-4xl font-variation-settings-FILL-1">
              account_balance_wallet
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Connexion Utilisateur
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 font-medium">
            Gérez vos finances et dépenses d'entreprise
          </p>
        </div>

        {/* Login Card */}
        <LoginForm />

        {/* Signup Footer */}
        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
          Pas encore de compte ?
          <Link
            className="font-bold text-primary hover:underline underline-offset-4 ml-1"
            href="/register"
          >
            Créer un compte entreprise
          </Link>
        </p>

        {/* Trust Badges */}
        <div className="mt-12 flex items-center justify-center space-x-6 text-slate-400 dark:text-slate-600">
          <div className="flex items-center text-xs">
            <span className="material-symbols-outlined text-sm mr-1">verified_user</span>
            Sécurisé par SSL
          </div>
          <div className="flex items-center text-xs">
            <span className="material-symbols-outlined text-sm mr-1">gpp_good</span>
            Données chiffrées
          </div>
        </div>
      </main>

      {/* Map Decoration for Context (Discrete background style) */}
      <div className="fixed bottom-0 left-0 right-0 h-[200px] pointer-events-none select-none opacity-[0.03] dark:opacity-[0.05]">
        <img
          alt=""
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQiv3Uyf5EtoCAFtkn1P80-RlmD37bIbtAUizjIhlrbyPuFOImS-rcCDTBxvLxhmtrNYGDaILZ18i6Jd8QyaRfW_pNaA28T-wNAdXq_UXmyYpAn_WCWfnxq_up8w10w5xzYcvtVxltcJqGZY-s_gQNqB3vBwy4Q_y3jKWj2ICHgF2mpSY2DlaeGe9bG80flw27-BzZ8wCYbh3i1bt4OxCaMqaqvdsoHsCgY-KPyvRvW9hiXgpGwW6w7XhHKnwjQ3BdeA07AZtePRdK"
        />
      </div>
    </div>
  );
}
