"use client";

import { useEffect, useMemo } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { useDividendStore } from "@/store/useDividendStore";
import { useExpenseStore } from "@/store/useExpenseStore";
import { formatCurrency } from "@/lib/utils/currency";
import { ExpensePeriod } from "@/types/expense";

const COLORS = [
  "bg-primary",
  "bg-orange-400",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-rose-500",
];

export function DividendsChart() {
  const { user } = useUserStore();
  const { associates } = useInvoiceStore();
  const { calculations, summary, calculateDividends } = useDividendStore();
  const { currentPeriod } = useExpenseStore();

  // Calculate date range for current month
  const dateRange = useMemo(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }, []);

  // Fetch dividends data on mount
  useEffect(() => {
    if (user?.email) {
      calculateDividends(user.email, dateRange.startDate, dateRange.endDate);
    }
  }, [user?.email, dateRange, calculateDividends]);

  // Calculate total dividends and prepare chart data
  const chartData = useMemo(() => {
    if (!calculations || calculations.length === 0) {
      return {
        total: 0,
        items: [],
        hasData: false,
      };
    }

    const total = calculations.reduce((sum, calc) => sum + calc.netDividend, 0);
    
    const items = calculations.map((calc, index) => ({
      name: calc.associateName,
      amount: calc.netDividend,
      share: `${(calc.share * 100).toFixed(0)}%`,
      color: COLORS[index % COLORS.length],
      percentage: calc.share * 100,
    }));

    return {
      total,
      items,
      hasData: true,
    };
  }, [calculations]);

  // Calculate SVG circle segments
  const circleSegments = useMemo(() => {
    if (!chartData.hasData) return [];
    
    let offset = 0;
    return chartData.items.map((item) => {
      const dashArray = `${item.percentage} ${100 - item.percentage}`;
      const dashOffset = -offset;
      offset += item.percentage;
      
      return {
        color: item.color.replace("bg-", ""),
        dashArray,
        dashOffset,
      };
    });
  }, [chartData]);

  // Get current month name
  const currentMonth = new Date().toLocaleString("fr-FR", { month: "long" });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-lg">Dividendes par Associé</h3>
        <p className="text-sm text-slate-500">Répartition selon parts sociales</p>
      </div>
      <div className="p-6 space-y-6 flex flex-col h-full">
        <div className="relative size-48 mx-auto flex items-center justify-center shrink-0">
          {chartData.hasData ? (
            <>
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#e2e8f0" strokeWidth="3"></circle>
                {circleSegments.map((segment, index) => (
                  <circle
                    key={index}
                    cx="18"
                    cy="18"
                    fill="transparent"
                    r="15.915"
                    stroke={getStrokeColor(segment.color)}
                    strokeDasharray={segment.dashArray}
                    strokeDashoffset={segment.dashOffset}
                    strokeWidth="3"
                  ></circle>
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold">
                  {formatCurrency(chartData.total, user?.country).replace(",00", "")}
                </span>
                <span className="text-[10px] uppercase text-slate-400 font-bold">
                  Total {currentMonth}
                </span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold">0 €</span>
              <span className="text-[10px] uppercase text-slate-400 font-bold">
                Total {currentMonth}
              </span>
            </div>
          )}
        </div>
        <div className="space-y-3 flex-1">
          {chartData.hasData ? (
            chartData.items.map((item, index) => (
              <PartnerRow
                key={index}
                color={item.color}
                name={item.name}
                amount={item.amount}
                share={item.share}
                context={user?.country}
              />
            ))
          ) : (
            <p className="text-center text-slate-400 text-sm py-4">
              Aucun dividende calculé pour ce mois
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function getStrokeColor(colorClass: string): string {
  const colorMap: Record<string, string> = {
    "primary": "#135bec",
    "orange-400": "#fb923c",
    "emerald-500": "#10b981",
    "violet-500": "#8b5cf6",
    "pink-500": "#ec4899",
    "cyan-500": "#06b6d4",
    "amber-500": "#f59e0b",
    "rose-500": "#f43f5e",
  };
  
  return colorMap[colorClass] || "#135bec";
}

function PartnerRow({
  color,
  name,
  amount,
  share,
  context,
}: {
  color: string;
  name: string;
  amount: number;
  share: string;
  context?: string;
}) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={`size-2 rounded-full ${color}`}></div>
        <span className="text-sm font-semibold">{name}</span>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold">{formatCurrency(amount, context)}</p>
        <p className="text-[10px] text-slate-500">{share} de parts</p>
      </div>
    </div>
  );
}
