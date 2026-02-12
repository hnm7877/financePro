"use client";

import { useUserStore } from "@/store/useUserStore";
import { formatCurrency } from "@/lib/utils/currency";

export function DividendsChart() {
  const { user } = useUserStore();
  const totalAmount = 25000;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-lg">Dividendes par Associé</h3>
        <p className="text-sm text-slate-500">Répartition selon parts sociales</p>
      </div>
      <div className="p-6 space-y-6 flex flex-col h-full">
        <div className="relative size-48 mx-auto flex items-center justify-center shrink-0">
          <svg className="size-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#e2e8f0" strokeWidth="3"></circle>
            <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#135bec" strokeDasharray="45 55" strokeDashoffset="0" strokeWidth="3"></circle>
            <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#fb923c" strokeDasharray="30 70" strokeDashoffset="-45" strokeWidth="3"></circle>
            <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#10b981" strokeDasharray="20 80" strokeDashoffset="-75" strokeWidth="3"></circle>
            <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#8b5cf6" strokeDasharray="5 95" strokeDashoffset="-95" strokeWidth="3"></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold">
              {formatCurrency(totalAmount, user?.country).split(",")[0]}
              {formatCurrency(totalAmount, user?.country).includes("DH") ? " DH" : "k€"}
            </span>
            <span className="text-[10px] uppercase text-slate-400 font-bold">Total Juin</span>
          </div>
        </div>
        <div className="space-y-3 flex-1">
          <PartnerRow
            color="bg-primary"
            name="Associé A"
            amount={11250}
            share="45%"
            country={user?.country}
          />
          <PartnerRow
            color="bg-orange-400"
            name="Associé B"
            amount={7500}
            share="30%"
            country={user?.country}
          />
          <PartnerRow
            color="bg-emerald-500"
            name="Associé C"
            amount={5000}
            share="20%"
            country={user?.country}
          />
          <PartnerRow
            color="bg-violet-500"
            name="Associé D"
            amount={1250}
            share="5%"
            country={user?.country}
          />
        </div>
      </div>
    </div>
  );
}

function PartnerRow({
  color,
  name,
  amount,
  share,
  country,
}: {
  color: string;
  name: string;
  amount: number;
  share: string;
  country?: string;
}) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={`size-2 rounded-full ${color}`}></div>
        <span className="text-sm font-semibold">{name}</span>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold">{formatCurrency(amount, country)}</p>
        <p className="text-[10px] text-slate-500">{share} de parts</p>
      </div>
    </div>
  );
}
