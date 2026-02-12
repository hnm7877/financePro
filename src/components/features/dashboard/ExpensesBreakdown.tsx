"use client";

import { useUserStore } from "@/store/useUserStore";
import { formatCurrency } from "@/lib/utils/currency";

const EXPENSES = [
  { label: "Ressources Humaines", amount: 22640, percentage: 50 },
  { label: "Infrastructure Cloud", amount: 13584, percentage: 30 },
  { label: "Marketing & Pub", amount: 6792, percentage: 15 },
  { label: "Bureautique", amount: 2264, percentage: 5 },
];

export function ExpensesBreakdown() {
  const { user } = useUserStore();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-lg">Répartition des Dépenses</h3>
        <p className="text-sm text-slate-500">Top catégories ce mois-ci</p>
      </div>
      <div className="p-6 flex-1 space-y-6">
        <div className="space-y-4">
          {EXPENSES.map((expense) => (
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
          ))}
        </div>
        <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <span className="font-bold text-primary">Optimisation possible :</span> Vos
              frais d'infrastructure ont augmenté de 12% ce mois-ci. Envisagez une revue des
              instances inutilisées pour réduire les dépenses fixes de l'associé C (responsable technique).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
