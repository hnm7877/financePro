import { useUserStore } from "@/store/useUserStore";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";

export function DistributionPanel() {
  const { user } = useUserStore();
  const { currentInvoice, associates } = useInvoiceStore();
  const { addToast } = useToastStore();
  
  const totalAmount = currentInvoice.amount;

  const handleValidate = async () => {
    if (!currentInvoice.merchant || totalAmount <= 0) {
      addToast("Veuillez remplir les informations de la facture", "error");
      return;
    }

    try {
      await useInvoiceStore.getState().saveInvoice(user?.email || "");
      addToast(`Facture de ${formatCurrency(totalAmount, user?.country)} ventilée avec succès !`, "success");
    } catch (error) {
      addToast("Erreur lors de la sauvegarde de la facture", "error");
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a2133] rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none sticky top-8">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h5 className="text-sm font-black uppercase tracking-tight">Répartition en direct</h5>
        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Automatique</span>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Total à ventiler</p>
          <p className="text-xl font-black text-primary">{formatCurrency(totalAmount, user?.country)}</p>
        </div>
        <div className="space-y-5">
          {associates.map((associate) => (
            <div key={associate.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full border-2 border-primary/20 bg-cover bg-center" style={{ backgroundImage: `url('${associate.avatar}')` }}></div>
                  <span className="text-sm font-bold">{associate.name}</span>
                </div>
                <span className="text-sm font-black text-gray-900 dark:text-gray-100">
                  {formatCurrency(totalAmount * associate.share, user?.country)}
                </span>
              </div>
              <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={cn("absolute inset-y-0 left-0 rounded-full", associate.isPrimary ? "bg-primary" : "bg-primary/60")} 
                  style={{ width: `${associate.share * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Quote-part: {associate.share * 100}%</span>
                <button className="text-[10px] font-bold text-primary uppercase hover:underline">Modifier</button>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={handleValidate}
            className="w-full bg-primary hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">verified</span>
            Valider et Ventiler
          </button>
          <p className="mt-4 text-[10px] text-center text-gray-400 leading-relaxed px-4">
            En validant, les écritures comptables seront générées et les comptes associés mis à jour.
          </p>
        </div>
      </div>
    </div>
  );
}
