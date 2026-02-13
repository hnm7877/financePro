"use client";

import { useUserStore } from "@/store/useUserStore";

export function DashboardHeader() {
  const { user } = useUserStore();

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">
          Dashboard <span className="text-primary">{user?.companyName}</span>
        </h2>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <span className="material-symbols-outlined text-sm">calendar_today</span>
          <span className="text-xs font-semibold">Janvier 2024 - Juin 2024</span>
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-primary outline-none"
            placeholder="Rechercher une transaction..."
            type="text"
          />
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
          <span className="material-symbols-outlined text-lg">download</span>
          Exporter Rapport
        </button>
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
