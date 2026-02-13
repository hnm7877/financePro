import { useUserStore } from "@/store/useUserStore";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

export function InvoiceHistoryTable() {
  const { user } = useUserStore();
  const { history } = useInvoiceStore();

  return (
    <div className="bg-white dark:bg-[#1a2133] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h4 className="text-sm font-black uppercase tracking-tight">Derniers Imports</h4>
        <button className="text-xs font-bold text-primary hover:underline">Voir tout l'historique</button>
      </div>
      <div className="overflow-x-auto min-h-[200px]">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-[#141b2b] text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4">Marchand</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Montant</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {history.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 italic">
                  Aucun historique pour le moment.
                </td>
              </tr>
            ) : (
              history.map((invoice, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-400 text-sm">
                          {invoice.icon || "description"}
                        </span>
                      </div>
                      <span className="text-sm font-bold">{invoice.merchant}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{invoice.date}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-bold rounded uppercase",
                      invoice.status === "Ventilé" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                    )}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">{formatCurrency(invoice.amount, user?.currency || user?.country)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">visibility</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
