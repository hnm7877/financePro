"use client";

import { useEffect, useState, useMemo } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useRevenueStore } from "@/store/useRevenueStore";
import { useDividendStore } from "@/store/useDividendStore";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { PeriodSelector } from "@/components/features/dividends/PeriodSelector";
import { FinancialFlowBanner } from "@/components/features/dividends/FinancialFlowBanner";
import { AssociateDistributionTable } from "@/components/features/dividends/AssociateDistributionTable";
import { ExpenseBreakdownChart } from "@/components/features/dividends/ExpenseBreakdownChart";
import { ExpenseTrendChart } from "@/components/features/dividends/ExpenseTrendChart";
import { AddExpenseModal } from "@/components/features/dividends/AddExpenseModal";
import { AddRevenueModal } from "@/components/features/dividends/AddRevenueModal";
import { ExpensePeriod } from "@/types/expense";
import { useRouter } from "next/navigation";

export default function DividendsPage() {
  const { user } = useUserStore();
  const { currentPeriod, fetchExpenses } = useExpenseStore();
  const { fetchRevenues } = useRevenueStore();
  const { calculateDividends, selectedPeriod } = useDividendStore();
  const { fetchInvoices, fetchAssociates } = useInvoiceStore();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Calculate date range based on selected period
  const dateRange = useMemo(() => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (selectedPeriod) {
      case ExpensePeriod.DAILY:
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case ExpensePeriod.WEEKLY:
        const dayOfWeek = now.getDay();
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case ExpensePeriod.MONTHLY:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case ExpensePeriod.QUARTERLY:
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
        break;
      case ExpensePeriod.ANNUAL:
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }, [selectedPeriod]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
    } else if (mounted && user?.email) {
      // Fetch all necessary data
      fetchExpenses(user.email, currentPeriod);
      fetchRevenues(user.email, currentPeriod);
      fetchInvoices(user.email);
      fetchAssociates(user.email);
      
      // Calculate dividends for the current period
      calculateDividends(user.email, dateRange.startDate, dateRange.endDate);
    }
  }, [user, currentPeriod, dateRange, mounted, router, fetchExpenses, fetchRevenues, fetchInvoices, fetchAssociates, calculateDividends]);

  if (!mounted || !user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Period Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">Analyse des Bénéfices & Dividendes</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Suivez la rentabilité de votre structure et la répartition nette des dividendes.
          </p>
        </div>
        <PeriodSelector />
      </div>

      {/* Section 1: Financial Flow Banner */}
      <section>
        <FinancialFlowBanner />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section 2: Distribution Table */}
        <section className="lg:col-span-2">
          <AssociateDistributionTable />
        </section>

        {/* Section 3: Charts & Trends */}
        <section className="space-y-6">
          {/* Mini Chart 1: Expenses Trend */}
          <ExpenseTrendChart />

          {/* Revenue Management Card */}
          <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-600/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined">trending_up</span>
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                Gestion des Gains
              </p>
            </div>
            <p className="text-sm mb-4">
              Enregistrez vos revenus encaissés pour un calcul précis des dividendes.
            </p>
            <button
              onClick={() => setIsRevenueModalOpen(true)}
              className="w-full py-2.5 bg-white text-emerald-600 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Ajouter un gain
            </button>
          </div>

          {/* Expense Management Card */}
          <div className="bg-primary rounded-2xl p-6 text-white shadow-xl shadow-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined">info</span>
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                Gestion des Dépenses
              </p>
            </div>
            <p className="text-sm mb-4">
              Ajoutez et gérez vos dépenses périodiques pour un calcul précis des dividendes.
            </p>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="w-full py-2.5 bg-white text-primary rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Ajouter une dépense
            </button>
          </div>
        </section>
      </div>

      {/* Expense Breakdown Details */}
      <section>
        <ExpenseBreakdownChart />
      </section>

      {/* Modals */}
      <AddRevenueModal isOpen={isRevenueModalOpen} onClose={() => setIsRevenueModalOpen(false)} />
      <AddExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} />
    </div>
  );
}
