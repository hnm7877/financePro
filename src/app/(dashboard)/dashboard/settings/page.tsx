"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/data/countries";

// Extract unique currencies from the countries list
const AVAILABLE_CURRENCIES = Array.from(
  new Map(
    COUNTRIES.map((country) => [country.currency.code, country.currency])
  ).values()
).sort((a, b) => a.name.localeCompare(b.name));

export default function SettingsPage() {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    siret: "",
    address: "",
    currency: "EUR",
  });

  useEffect(() => {
    setMounted(true);
    if (user) {
      setFormData({
        companyName: user.companyName || "",
        siret: user.siret || "",
        address: user.address || "",
        currency: user.currency || "EUR",
      });
    }
  }, [user]);

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user?.email) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          ...formData,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser({ ...user, ...updatedUser });
        alert("Paramètres mis à jour avec succès !");
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error || "Une erreur est survenue"}`);
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
      alert("Erreur de connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Header */}
      <header className="h-20 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-10 shrink-0 bg-white dark:bg-slate-900">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Paramètres de l'entreprise</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configurez les bases de votre gestion financière.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
          >
            Annuler
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* General Info Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">business</span>
              <h3 className="text-lg font-bold">Informations Générales</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-800/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800/60">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nom de la société</label>
                <input 
                  type="text" 
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" 
                  placeholder="Ex: Ma Société" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ID Fiscal / SIRET</label>
                <input 
                  type="text" 
                  name="siret"
                  value={formData.siret}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" 
                  placeholder="ID unique" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Adresse du siège social</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">location_on</span>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" 
                    placeholder="Adresse complète"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Currency Configuration Section */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">payments</span>
              <h3 className="text-lg font-bold">Configuration Monétaire</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 italic">La devise sélectionnée sera appliquée à tous les calculs de répartition entre associés.</p>
            <div className="bg-primary/5 dark:bg-primary/5 border border-primary/20 rounded-xl p-8 relative overflow-hidden">
              {/* Background Decor */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="max-w-lg">
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-4">Devise fonctionnelle du compte</label>
                <div className="relative group">
                  <select 
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="appearance-none w-full px-4 py-4 bg-white dark:bg-slate-900 border-2 border-primary/30 dark:border-slate-700 rounded-xl focus:border-primary focus:ring-0 outline-none transition-all text-base font-semibold cursor-pointer pr-12 shadow-sm"
                  >
                    {AVAILABLE_CURRENCIES.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} — {currency.name} ({currency.code})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                <div className="mt-6 flex gap-3 p-4 bg-white/50 dark:bg-slate-900/40 rounded-lg border border-primary/10">
                  <span className="material-symbols-outlined text-primary text-[20px]">info</span>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-900 dark:text-slate-200">Attention :</strong> Le changement de devise modifie l'affichage des rapports historiques mais ne convertit pas les montants déjà saisis. Assurez-vous que toutes vos saisies passées correspondent à cette unité.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Automated Splitting Logic Preview */}
          <section className="pb-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">analytics</span>
              <h3 className="text-lg font-bold">Répartition Automatisée</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Méthode de calcul</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">settings_suggest</span>
                  <span className="text-sm font-bold">Pro-rata des parts</span>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Seuil d'alerte</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-sm">warning</span>
                  <span className="text-sm font-bold">15 000 € / associé</span>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Fréquence de calcul</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500 text-sm">event_repeat</span>
                  <span className="text-sm font-bold">Temps réel</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
