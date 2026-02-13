"use client";

import { KpiCard } from "@/components/features/dashboard/KpiCard";
import { RecentInvoices } from "@/components/features/dashboard/RecentInvoices";
import { ExpensesBreakdown } from "@/components/features/dashboard/ExpensesBreakdown";
import { CashflowChart } from "@/components/features/dashboard/CashflowChart";
import { DividendsChart } from "@/components/features/dashboard/DividendsChart";
import { useUserStore } from "@/store/useUserStore";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useUserStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
    }
  }, [user, router, mounted]);

  if (!mounted || !user) return null;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          title="Dépenses Totales"
          amount={45280}
          icon="payments"
          trend="+12.5%"
          trendType="positive"
          description="vs mois précédent"
          iconBg="bg-orange-100 dark:bg-orange-500/20"
          iconColor="text-orange-600 dark:text-orange-400"
        />
        <KpiCard
          title="Investissements"
          amount={120000}
          icon="trending_up"
          trend="-4.2%"
          trendType="negative"
          description="réallocation en cours"
          iconBg="bg-blue-100 dark:bg-blue-500/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <KpiCard
          title="Factures Payées"
          amount={32150}
          icon="check_circle"
          trend="+8.1%"
          trendType="positive"
          description="taux de recouvrement 82%"
          iconBg="bg-emerald-100 dark:bg-emerald-500/20"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <KpiCard
          title="À Encaisser"
          amount={13130}
          icon="schedule"
          trend="14 factures"
          description="en attente de validation"
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
