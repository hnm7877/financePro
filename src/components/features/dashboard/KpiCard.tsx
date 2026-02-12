"use client";

import { useUserStore } from "@/store/useUserStore";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  amount: number;
  icon: string;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  description?: string;
  iconBg: string;
  iconColor: string;
}

export function KpiCard({
  title,
  amount,
  icon,
  trend,
  trendType = "neutral",
  description,
  iconBg,
  iconColor,
}: KpiCardProps) {
  const { user } = useUserStore();

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={cn("p-2 rounded-lg", iconBg, iconColor)}>
          <span className="material-symbols-outlined block">{icon}</span>
        </div>
      </div>
      <h3 className="text-2xl font-extrabold mb-1">
        {formatCurrency(amount, user?.country)}
      </h3>
      <div className="flex items-center gap-1.5">
        {trend && (
          <span
            className={cn(
              "text-xs font-bold flex items-center",
              trendType === "positive" && "text-emerald-500",
              trendType === "negative" && "text-red-500",
              trendType === "neutral" && "text-slate-500"
            )}
          >
            {trend}
          </span>
        )}
        {description && <span className="text-[10px] text-slate-400">{description}</span>}
      </div>
    </div>
  );
}
