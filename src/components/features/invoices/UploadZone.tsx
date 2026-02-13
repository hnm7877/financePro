"use client";

import { useMutation } from "@tanstack/react-query";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { useToastStore } from "@/store/useToastStore";


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
    onSuccess: (data) => {
      setMerchant(data.merchant || "");
      setAmount(data.amount || 0);
      setCategory(data.category || "Autres");
      if (data.date) setDate(data.date);
      
      addToast(`IA: Facture ${data.merchant} détectée avec succès`, "success");
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
