"use client";

import { KpiCard } from "@/components/features/dashboard/KpiCard";
import { RecentInvoices } from "@/components/features/dashboard/RecentInvoices";
import { ExpensesBreakdown } from "@/components/features/dashboard/ExpensesBreakdown";
import { CashflowChart } from "@/components/features/dashboard/CashflowChart";
import { DividendsChart } from "@/components/features/dashboard/DividendsChart";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useUserStore();
  const { history, fetchInvoices, fetchAssociates } = useInvoiceStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
    } else if (mounted && user) {
      fetchInvoices(user.email);
      fetchAssociates(user.email);
    }
  }, [user, router, mounted, fetchInvoices, fetchAssociates]);

  if (!mounted || !user) return null;

  // Calculate KPIs
  const totalExpenses = history.reduce((acc, inv) => acc + inv.amount, 0);
  
  // For "Investissements", let's sum up "Services Cloud" and "Logiciels & SaaS" and "Investissements" if exists
  const investments = history
    .filter(inv => 
      ["Services Cloud", "Logiciels & SaaS", "Investissements"].includes(inv.category)
    )
    .reduce((acc, inv) => acc + inv.amount, 0);
    
  const paidInvoicesCount = history.filter(inv => inv.status === "Ventilé").length;
  // Percentage of paid invoices (assuming "Ventilé" means paid/processed)
  const paidRate = history.length > 0 
    ? Math.round((paidInvoicesCount / history.length) * 100) 
    : 0;
    
  // Pending amount
  const pendingAmount = history
    .filter(inv => inv.status === "À valider")
    .reduce((acc, inv) => acc + inv.amount, 0);
  const pendingCount = history.filter(inv => inv.status === "À valider").length;

  const paidAmount = history
    .filter(inv => inv.status === "Ventilé")
    .reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          title="Dépenses Totales"
          amount={totalExpenses}
          icon="payments"
          trend="+12.5%" // Still static trend for now as we don't have historical data by month yet easily accessible
          trendType="positive"
          description="vs mois précédent"
          iconBg="bg-orange-100 dark:bg-orange-500/20"
          iconColor="text-orange-600 dark:text-orange-400"
        />
        <KpiCard
          title="Investissements (Tech)"
          amount={investments}
          icon="trending_up"
          trend={`${Math.round((investments / (totalExpenses || 1)) * 100)}%`}
          trendType="neutral"
          description="du total des dépenses"
          iconBg="bg-blue-100 dark:bg-blue-500/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <KpiCard
          title="Factures Traitées"
          amount={paidAmount}
          icon="check_circle"
          trend={`+${paidRate}%`}
          trendType="positive"
          description={`taux de traitement ${paidRate}%`}
          iconBg="bg-emerald-100 dark:bg-emerald-500/20"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <KpiCard
          title="En Attente"
          amount={pendingAmount}
          icon="schedule"
          trend={`${pendingCount} factures`}
          trendType="neutral"
          description="à valider"
          iconBg="bg-amber-100 dark:bg-amber-500/20"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <CashflowChart />
        <DividendsChart />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentInvoices />
        <ExpensesBreakdown />
      </div>
    </div>
  );
}
