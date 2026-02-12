"use client";

import { useUserStore } from "@/store/useUserStore";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

const INVOICES = [
  {
    client: "TechSolutions Ltd",
    service: "Consulting Cloud",
    status: "Payé",
    statusColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    date: "12 Juin 2024",
    amount: 4200,
  },
  {
    client: "Creativ' Agency",
    service: "Branding & Logo",
    status: "En attente",
    statusColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    date: "08 Juin 2024",
    amount: 1850,
  },
  {
    client: "Global Logistics",
    service: "Maintenance Serveur",
    status: "Retard",
    statusColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    date: "25 Mai 2024",
    amount: 3100,
  },
  {
    client: "InnovCorp",
    service: "Audit Sécurité",
    status: "Payé",
    statusColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    date: "22 Mai 2024",
    amount: 5500,
  },
];

export function RecentInvoices() {
  const { user } = useUserStore();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-lg">Factures Récentes</h3>
        <button className="text-sm font-bold text-primary hover:underline transition-colors">
          Voir tout
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Client / Prestation</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {INVOICES.map((invoice, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-bold">{invoice.client}</p>
                  <p className="text-xs text-slate-500">{invoice.service}</p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      invoice.statusColor
                    )}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{invoice.date}</td>
                <td className="px-6 py-4 text-sm font-bold text-right">
                  {formatCurrency(invoice.amount, user?.country)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
