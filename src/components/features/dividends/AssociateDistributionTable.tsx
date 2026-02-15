import { useDividendStore } from "@/store/useDividendStore";
import { formatCurrency } from "@/lib/utils/currency";
import { useUserStore } from "@/store/useUserStore";

export function AssociateDistributionTable() {
  const { calculations, summary } = useDividendStore();
  const { user } = useUserStore();

  if (!calculations || calculations.length === 0) {
    return (
      <div className="bg-card-dark rounded-2xl border border-border-dark p-8 text-center">
        <p className="text-slate-400">Aucune donnée de distribution disponible</p>
      </div>
    );
  }

  const totalShare = calculations.reduce((sum, calc) => sum + calc.share, 0);

  return (
    <div className="bg-card-dark rounded-2xl border border-border-dark overflow-hidden h-full">
      <div className="p-6 border-b border-border-dark flex justify-between items-center">
        <h3 className="font-bold text-lg">Calcul de la Part Nette par Associé</h3>
        <button className="flex items-center gap-2 text-xs font-bold text-primary hover:underline">
          <span className="material-symbols-outlined text-sm">download</span>
          Exporter (PDF)
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/30 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Associé</th>
              <th className="px-6 py-4 font-semibold text-center">Équité %</th>
              <th className="px-6 py-4 font-semibold text-right">Part Gains Bruts</th>
              <th className="px-6 py-4 font-semibold text-right">Quote-part Frais</th>
              <th className="px-6 py-4 font-semibold text-right text-white">Dividende Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-dark/50">
            {calculations.map((calc) => (
              <tr key={calc.associateId} className="hover:bg-slate-800/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                      {calc.associateName.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{calc.associateName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-1 rounded bg-slate-800 text-xs font-bold">
                    {(calc.share * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm text-slate-300">
                  {formatCurrency(calc.grossRevenue, user?.country)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-rose-400/80">
                  -{formatCurrency(calc.expenseShare, user?.country)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-primary">
                  {formatCurrency(calc.netDividend, user?.country)}
                </td>
              </tr>
            ))}
          </tbody>
          {summary && (
            <tfoot>
              <tr className="bg-primary/5">
                <td className="px-6 py-4 font-bold text-sm">TOTAL</td>
                <td className="px-6 py-4 text-center text-sm font-bold">
                  {(totalShare * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-white">
                  {formatCurrency(summary.grossRevenue, user?.country)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-rose-400">
                  -{formatCurrency(summary.totalExpenses, user?.country)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-primary">
                  {formatCurrency(summary.netDividends, user?.country)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
