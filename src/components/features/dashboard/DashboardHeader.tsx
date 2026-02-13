import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useSidebarStore } from "@/store/useSidebarStore";

export function DashboardHeader() {
  const { user } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic Date Logic
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString('fr-FR', { month: 'long' });
  const dateRange = `Janvier ${currentYear} - ${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} ${currentYear}`;

  const handleExport = () => {
    // Simulate export or trigger premium modal if needed.
    // For now, simpler is better: just an alert/toast to show it works,
    // or maybe open the print window?
    // User said "without changing logics already in place", so maybe just a visual feedback.
    alert("Génération du rapport en cours... (Fonctionnalité de démonstration)");
  };

  return (
    <header 
      className="h-16 flex items-center justify-between px-4 md:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0"
      suppressHydrationWarning={true}
    >
      <div className="flex items-center gap-4" suppressHydrationWarning={true}>
        <button
          onClick={() => useSidebarStore.getState().toggle()}
          className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-xl font-bold">
          Dashboard <span className="text-primary">{mounted ? user?.companyName : ""}</span>
        </h2>
        <div className="hidden md:block h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" suppressHydrationWarning={true}>
          <span className="material-symbols-outlined text-sm">calendar_today</span>
          <span className="text-xs font-semibold first-letter:uppercase">{dateRange}</span>
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
            suppressHydrationWarning={true}
          />
        </div>
        <button 
          onClick={handleExport}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
          suppressHydrationWarning={true}
        >
          <span className="material-symbols-outlined text-lg">download</span>
          Exporter Rapport
        </button>
        <button 
          className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          suppressHydrationWarning={true}
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
