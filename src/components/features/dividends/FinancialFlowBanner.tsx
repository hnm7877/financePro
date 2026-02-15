import { useDividendStore } from "@/store/useDividendStore";
import { formatCurrency } from "@/lib/utils/currency";
import { useUserStore } from "@/store/useUserStore";

export function FinancialFlowBanner() {
  const { summary } = useDividendStore();
  const { user } = useUserStore();

  if (!summary) {
    return (
      <div className="bg-card-dark rounded-2xl border border-border-dark p-8 text-center">
        <p className="text-slate-400">Sélectionnez une période pour voir le résumé financier</p>
      </div>
    );
  }

  const { grossRevenue, totalExpenses, netDividends, netMargin, previousPeriodChange } = summary;

  return (
    <div className="bg-card-dark rounded-2xl border border-border-dark overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 items-center p-8 gap-4 text-center relative z-10">
        {/* Gross Gains */}
        <div className="md:col-span-2 space-y-2">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Gains Bruts
          </p>
          <p className="text-4xl font-extrabold text-white">
            {formatCurrency(grossRevenue, user?.country)}
          </p>
          {previousPeriodChange !== undefined && (
            <div className={`flex items-center justify-center gap-1 text-sm ${
              previousPeriodChange >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}>
              <span className="material-symbols-outlined text-sm">
                {previousPeriodChange >= 0 ? "trending_up" : "trending_down"}
              </span>
              <span>{previousPeriodChange >= 0 ? "+" : ""}{previousPeriodChange.toFixed(1)}% vs période préc.</span>
            </div>
          )}
        </div>

        {/* Minus Operator */}
        <div className="flex justify-center">
          <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center border border-border-dark">
            <span className="material-symbols-outlined text-slate-400">remove</span>
          </div>
        </div>

        {/* Expenses */}
        <div className="md:col-span-1 space-y-2">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Dépenses
          </p>
          <p className="text-3xl font-bold text-rose-400">
            {formatCurrency(totalExpenses, user?.country)}
          </p>
          <p className="text-xs text-slate-500">Frais de fonctionnement</p>
        </div>

        {/* Equals Operator */}
        <div className="flex justify-center">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <span className="material-symbols-outlined text-primary">equal</span>
          </div>
        </div>

        {/* Net Dividends */}
        <div className="md:col-span-2 space-y-2">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">
            Dividendes Nets
          </p>
          <p className="text-4xl font-extrabold text-white">
            {formatCurrency(netDividends, user?.country)}
          </p>
          <div className="inline-flex items-center px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold">
            Marge nette: {netMargin.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
