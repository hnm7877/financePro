"use client";

import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: "dashboard", label: "Tableau de Bord", active: true },
  { icon: "receipt_long", label: "Transactions" },
  { icon: "group", label: "Associés" },
  { icon: "description", label: "Factures" },
  { icon: "monitoring", label: "Analyses" },
];

const SUPPORT_ITEMS = [
  { icon: "settings", label: "Paramètres" },
  { icon: "help", label: "Aide" },
];

export function DashboardSidebar() {
  const { user } = useUserStore();

  return (
    <aside className="w-64 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary rounded-lg p-2 text-white">
          <span className="material-symbols-outlined block">account_balance</span>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none">FinancePro</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestion d'associés
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href="#"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              item.active
                ? "bg-primary/10 text-primary"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            <span className="material-symbols-outlined font-variation-settings-FILL-0">
              {item.icon}
            </span>
            <span className={cn("text-sm", item.active ? "font-semibold" : "font-medium")}>
              {item.label}
            </span>
          </a>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Support
          </p>
          {SUPPORT_ITEMS.map((item) => (
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined font-variation-settings-FILL-0">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="size-10 rounded-full border-2 border-white dark:border-slate-700 bg-primary/10 flex items-center justify-center text-primary font-bold">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user?.fullName || "Utilisateur"}</p>
            <p className="text-xs text-slate-500 truncate">Admin Principal</p>
          </div>
          <span className="material-symbols-outlined text-slate-400">more_vert</span>
        </div>
      </div>
    </aside>
  );
}
