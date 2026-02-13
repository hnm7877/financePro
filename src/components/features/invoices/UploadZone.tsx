"use client";

import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import { useToastStore } from "@/store/useToastStore";
import { convertToEuro } from "@/lib/utils/currencyConversion";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { COUNTRIES } from "@/data/countries";


export function UploadZone() {
  const { addToast } = useToastStore();
  const { setMerchant, setAmount, setCategory, setDate } = useInvoiceStore();

  const analyzeMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/invoices/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur d'analyse IA");
      }

      return response.json();
    },
    onSuccess: async (data) => {
      const { user } = useUserStore.getState();
      // FIX: user.country stores the CODE (e.g., "CI"), not the name.
      const userCurrency = COUNTRIES.find(c => c.code === user?.country)?.currency.code || "EUR";
      const invoiceCurrency = data.currency || "EUR";

      let finalAmount = data.amount || 0;
      let requiresManualValidation = false;

      // Currency Check
      if (invoiceCurrency !== userCurrency) {
        finalAmount = convertToEuro(data.amount || 0, invoiceCurrency);
        addToast(`Devise étrangère (${invoiceCurrency}) détectée. Montant converti en ${userCurrency}.`, "info");
        requiresManualValidation = true;
      }

      // 1. Update store with analyzed data
      setMerchant(data.merchant || "");
      setAmount(finalAmount);
      setCategory(data.category || "Autres");
      if (data.date) setDate(data.date);

      // 2. Auto-save if analysis is high confidence AND no manual validation required
      if (!requiresManualValidation && data.merchant && finalAmount > 0) {
        try {
          if (user?.email) {
            await useInvoiceStore.getState().saveInvoice(user.email);
            addToast(`🚀 Facture ${data.merchant} créée et ventilée automatiquement !`, "success");
            return; // Exit, no need for manual review
          }
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
      }
      
      // 3. Otherwise, prompt for manual review
      addToast(`IA: Facture analysée. Veuillez vérifier et valider.${requiresManualValidation ? " (Conversion de devise)" : ""}`, "info");
    },
    onError: (error: any) => {
      addToast(`Erreur IA: ${error.message || "Impossible d'analyser le fichier"}`, "error");
    },
  });

  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-[#141b2b] hover:border-primary transition-colors cursor-pointer group relative min-h-[300px]">
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) analyzeMutation.mutate(file);
        }}
        disabled={analyzeMutation.isPending}
      />
      <div className="size-16 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {analyzeMutation.isPending ? (
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
        )}
      </div>
      <h4 className="text-lg font-bold mb-2">
        {analyzeMutation.isPending ? "Analyse IA en cours..." : "Glissez-déposez votre facture ici"}
      </h4>
      <p className="text-sm text-gray-500 max-w-sm">
        Notre IA analyse instantanément le marchand, la date, le montant et la TVA.
      </p>
      <div className="mt-6 flex gap-4">
        <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all pointer-events-none">
          Parcourir les fichiers
        </button>
      </div>
      <p className="mt-4 text-[11px] text-gray-400 uppercase tracking-widest font-bold">
        PDF, JPG, PNG jusqu'à 10MB
      </p>
    </div>
  );
}
