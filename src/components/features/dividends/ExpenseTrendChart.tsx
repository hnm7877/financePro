import { useExpenseStore } from "@/store/useExpenseStore";
import { useMemo } from "react";

export function ExpenseTrendChart() {
  const { expenses } = useExpenseStore();

  // Generate last 6 months
  const last6Months = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      months.push(d);
    }
    return months;
  }, []);

  // Aggregate expenses by month
  const chartData = useMemo(() => {
    return last6Months.map((monthDate) => {
      const monthKey = monthDate.getMonth();
      const yearKey = monthDate.getFullYear();

      const monthlyExpenses = expenses
        .filter((exp) => {
          const d = new Date(exp.startDate);
          return (
            d.getMonth() === monthKey &&
            d.getFullYear() === yearKey &&
            exp.status === "Active"
          );
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      return {
        monthLabel: monthDate
          .toLocaleString("fr-FR", { month: "short" })
          .replace(".", ""),
        amount: monthlyExpenses,
      };
    });
  }, [expenses, last6Months]);

  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1);
  const totalExpenses = chartData.reduce((sum, d) => sum + d.amount, 0);

  // Calculate trend
  const currentMonth = chartData[chartData.length - 1]?.amount || 0;
  const previousMonth = chartData[chartData.length - 2]?.amount || 0;
  const trend = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

  // Empty state
  if (totalExpenses === 0) {
    return (
      <div className="bg-card-dark rounded-2xl border border-border-dark p-6 flex flex-col h-[220px]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">ÉVOLUTION DÉPENSES</p>
            <h4 className="text-xl font-bold">0.0k €</h4>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-500/10 text-slate-500">
            +0%
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 text-sm">Aucune dépense enregistrée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-dark rounded-2xl border border-border-dark p-6 flex flex-col h-[220px]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase">Évolution Dépenses</p>
          <h4 className="text-xl font-bold">
            {(currentMonth / 1000).toFixed(1)}k €
          </h4>
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
            trend >= 0
              ? "bg-rose-500/10 text-rose-500"
              : "bg-emerald-500/10 text-emerald-500"
          }`}
        >
          {trend >= 0 ? "+" : ""}{trend.toFixed(0)}%
        </span>
      </div>
      <div className="flex-1 flex items-end gap-1.5 pb-2">
        {chartData.map((data, index) => {
          const height = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
          const isCurrentMonth = index === chartData.length - 1;
          return (
            <div
              key={index}
              className={`flex-1 rounded-t-sm ${
                isCurrentMonth ? "bg-primary" : "bg-slate-800"
              }`}
              style={{ height: `${height}%` }}
              title={`${data.monthLabel}: ${data.amount.toFixed(2)} €`}
            ></div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 mt-2">
        {chartData.map((data, index) => (
          <span key={index}>{data.monthLabel}</span>
        ))}
      </div>
    </div>
  );
}
