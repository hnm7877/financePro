import { useInvoiceStore } from "@/store/useInvoiceStore";
import { useEffect, useMemo, useState } from "react";

export function CashflowChart() {
  const { history } = useInvoiceStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // In a real app, we would fetch based on user session. 
    // Assuming fetchInvoices triggers correctly or data is already there from DashboardSidebar/Page.
  }, []);

  // Generate last 6 months
  const last6Months = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      d.setDate(1); // Normalise to 1st of month
      d.setHours(0,0,0,0);
      months.push(d);
    }
    return months;
  }, []);

  // Aggregate Data
  const chartData = useMemo(() => {
    return last6Months.map(monthDate => {
      const monthKey = monthDate.getMonth(); // 0-11
      const yearKey = monthDate.getFullYear();

      // Filter invoices for this month/year
      const monthlyRevenue = history
        .filter(inv => {
          const d = new Date(inv.date);
          return d.getMonth() === monthKey && d.getFullYear() === yearKey && inv.status === "Ventilé";
        })
        .reduce((sum, inv) => sum + inv.amount, 0);

      // Mock Expenses (Random but realistic relative to revenue for demo)
      // In prod, useExpenseStore.
      const mockExpenses = Math.max(monthlyRevenue * 0.6 + (Math.random() * 2000 - 1000), 0);

      return {
        monthLabel: monthDate.toLocaleString('fr-FR', { month: 'short' }).replace('.', ''),
        revenue: monthlyRevenue,
        expenses: mockExpenses
      };
    });
  }, [history, last6Months]);

  // SCALING LOGIC
  const maxVal = Math.max(...chartData.map(d => Math.max(d.revenue, d.expenses))) || 10000; // Default max if 0
  const chartHeight = 100;
  const chartWidth = 100;
  const stepX = chartWidth / (chartData.length - 1);

  const getY= (val: number) => chartHeight - ((val / (maxVal * 1.1)) * chartHeight); // 1.1 padding

  // Generate Paths
  const revenuePath = chartData.length > 0 ? `M0,${getY(chartData[0].revenue)} ` + chartData.map((d, i) => {
    if (i === 0) return "";
    // Simple Line (can use bezier for smooth curves later if needed, direct line for now for robustness)
    // Actually, let's try a simple cubic bezier approximation or just polyline for now to ensure it works.
    // Let's stick to smooth curve if possible, or just points.
    // SVG Polyline: L x,y
    return `L${i * stepX},${getY(d.revenue)}`;
  }).join(" ") : "";
  
  // Smooth Curve Logic (Catmull-Rom or similar helps, but simple quadratic bezier between points is easier)
  // For this task, let's keep it simple: Polyline or straightforward commands.
  // Actually the previous chart used Q (quadratic bezier).
  // Let's simpler: L (Line) for accurate representation first.
  
  const expensesPath = chartData.length > 0 ? `M0,${getY(chartData[0].expenses)} ` + chartData.map((d, i) => {
    if (i === 0) return "";
    return `L${i * stepX},${getY(d.expenses)}`;
  }).join(" ") : "";

  // Area Path (Close the loop for revenue)
  const areaPath = revenuePath + ` V100 H0 Z`;

  if (!mounted) return null;

  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">Évolution des Flux</h3>
          <p className="text-sm text-slate-500">Performances semestrielles du capital</p>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span className="size-2 rounded-full bg-primary"></span> Revenus
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span className="size-2 rounded-full bg-slate-300"></span> Dépenses
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 min-h-[300px] flex flex-col justify-end">
        <div className="relative h-64 w-full">
         
         {maxVal === 0 || history.length === 0 ? (
             <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                Aucune donnée disponible
             </div>
         ) : (
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#135bec" stopOpacity="0.2"></stop>
                <stop offset="100%" stopColor="#135bec" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            {/* Area */}
            <path
              d={areaPath}
              fill="url(#chartGradient)"
            ></path>
            {/* Line Revenues */}
            <path
              d={revenuePath}
              fill="none"
              stroke="#135bec"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke" 
            ></path>
            {/* Line Expenses */}
            <path
              d={expensesPath}
              fill="none"
              stroke="#94a3b8"
              strokeDasharray="4"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            ></path>
          </svg>
         )}
        </div>
        <div className="flex justify-between mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
          {chartData.map((d, index) => (
            <span key={index}>{d.monthLabel}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
