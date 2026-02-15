import { ExpensePeriod } from "@/types/expense";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useDividendStore } from "@/store/useDividendStore";
import { cn } from "@/lib/utils";

const periods = [
  { value: ExpensePeriod.DAILY, label: "Journalier" },
  { value: ExpensePeriod.WEEKLY, label: "Hebdo" },
  { value: ExpensePeriod.MONTHLY, label: "Mensuel" },
  { value: ExpensePeriod.QUARTERLY, label: "Trimestriel" },
  { value: ExpensePeriod.ANNUAL, label: "Annuel" },
];

export function PeriodSelector() {
  const { currentPeriod, setPeriod } = useExpenseStore();
  const { setSelectedPeriod } = useDividendStore();

  const handlePeriodChange = (period: ExpensePeriod) => {
    setPeriod(period);
    setSelectedPeriod(period);
  };

  return (
    <div className="bg-card-dark p-1 rounded-xl flex border border-border-dark">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => handlePeriodChange(period.value)}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-lg transition-all",
            currentPeriod === period.value
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "text-slate-400 hover:text-white"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
