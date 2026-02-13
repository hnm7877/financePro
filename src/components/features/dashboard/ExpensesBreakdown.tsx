"use client";

import { useUserStore } from "@/store/useUserStore";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { formatCurrency } from "@/lib/utils/currency";

export function ExpensesBreakdown() {
  const { user } = useUserStore();
  const { history } = useInvoiceStore();

  const totalExpenses = history.reduce((acc, inv) => acc + inv.amount, 0);

  // Aggregate expenses by category
  const expensesByCategory = history.reduce((acc, inv) => {
    const existing = acc.find(item => item.label === inv.category);
    if (existing) {
      existing.amount += inv.amount;
    } else {
      acc.push({ label: inv.category, amount: inv.amount, percentage: 0 });
    }
    return acc;
  }, [] as { label: string; amount: number; percentage: number }[]);

  // Calculate percentages and sort
  const topExpenses = expensesByCategory
    .map(item => ({
      ...item,
      percentage: totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-lg">Répartition des Dépenses</h3>
        <p className="text-sm text-slate-500">Top catégories par montant</p>
      </div>
      <div className="p-6 flex-1 space-y-6">
        <div className="space-y-4">
          {topExpenses.length === 0 ? (
            <p className="text-center text-slate-500 py-4">Aucune dépense enregistrée</p>
          ) : (
            topExpenses.map((expense) => (
              <div key={expense.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">{expense.label}</span>
                  <span className="text-sm font-bold">
                    {formatCurrency(expense.amount, user?.country)}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${expense.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <span className="font-bold text-primary">Analyse :</span> 
              {topExpenses.length > 0
                ? ` Votre poste de dépense principal est "${topExpenses[0].label}" avec ${topExpenses[0].percentage.toFixed(1)}% du total.`
                : " Enregistrez vos premières dépenses pour obtenir des analyses."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
