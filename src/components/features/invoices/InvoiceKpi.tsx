"use client";

import { cn } from "@/lib/utils";

interface InvoiceKpiProps {
  title: string;
  value: string;
  trend?: string;
  trendType?: "positive" | "negative";
  description?: string;
  progressBar?: boolean;
}

export function InvoiceKpi({
  title,
  value,
  trend,
  trendType,
  description,
  progressBar = false,
}: InvoiceKpiProps) {
  return (
    <div className="bg-white dark:bg-[#1a2133] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-black mt-1">{value}</h3>
      {trend && (
        <div
          className={cn(
            "mt-2 flex items-center text-xs font-bold",
            trendType === "positive" ? "text-green-500" : "text-primary"
          )}
        >
          {trendType === "positive" && (
            <span className="material-symbols-outlined text-sm">trending_up</span>
          )}
          <span className="ml-1">{trend}</span>
        </div>
      )}
      {description && !trend && (
        <p className="mt-2 text-xs text-primary font-bold">{description}</p>
      )}
      {progressBar && (
        <div className="mt-2 w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full w-full"></div>
        </div>
      )}
    </div>
  );
}
