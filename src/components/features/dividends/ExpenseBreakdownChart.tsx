import { useExpenseStore } from "@/store/useExpenseStore";
import { ExpenseCategory } from "@/types/expense";
import { formatCurrency } from "@/lib/utils/currency";
import { useUserStore } from "@/store/useUserStore";

const categoryLabels: Record<string, string> = {
  "Logistique & Stockage": "LOGISTIQUE",
  "Publicité & Ads": "MARKETING",
  "Abonnements Marketing": "MARKETING",
  "Services Cloud": "INFRASTRUCTURE",
  "Logiciels & SaaS": "INFRASTRUCTURE",
  "Électricité & Internet": "INFRASTRUCTURE",
};

const categoryColors: Record<string, string> = {
  LOGISTIQUE: "blue-400",
  MARKETING: "indigo-400",
  INFRASTRUCTURE: "purple-400",
  AUTRES: "slate-400",
};

export function ExpenseBreakdownChart() {
  const { getExpensesByCategory } = useExpenseStore();
  const { user } = useUserStore();
  const expensesByCategory = getExpensesByCategory();

  // Aggregate by simplified categories
  const aggregated: Record<string, number> = {
    LOGISTIQUE: 0,
    MARKETING: 0,
    INFRASTRUCTURE: 0,
    AUTRES: 0,
  };

  Object.entries(expensesByCategory).forEach(([category, amount]) => {
    const label = categoryLabels[category] || "AUTRES";
    aggregated[label] += amount;
  });

  const totalExpenses = Object.values(aggregated).reduce((sum, val) => sum + val, 0);

  const chartData = Object.entries(aggregated)
    .filter(([_, amount]) => amount > 0)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      color: categoryColors[category] || "slate-400",
    }));

  if (totalExpenses === 0) {
    return (
      <div className="bg-card-dark rounded-2xl border border-border-dark p-6">
        <h3 className="font-bold text-lg mb-6">Répartition des Dépenses de la Période</h3>
        <p className="text-center text-slate-400 py-8">Aucune dépense enregistrée</p>
      </div>
    );
  }

  return (
    <div className="bg-card-dark rounded-2xl border border-border-dark p-6">
      <h3 className="font-bold text-lg mb-6">Répartition des Dépenses de la Période</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {chartData.map((item) => (
          <div
            key={item.category}
            className="p-4 rounded-xl bg-slate-800/40 border border-border-dark/30"
          >
            <p className="text-xs font-bold text-slate-400 mb-1">{item.category}</p>
            <p className="text-lg font-bold">{formatCurrency(item.amount, user?.country)}</p>
            <div className="w-full h-1 bg-slate-700 rounded-full mt-2">
              <div
                className={`h-full bg-${item.color} rounded-full`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
