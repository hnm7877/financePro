"use client";

import { useUserStore } from "@/store/useUserStore";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { InvoiceKpi } from "@/components/features/invoices/InvoiceKpi";
import { InvoiceTabs } from "@/components/features/invoices/InvoiceTabs";
import { DistributionPanel } from "@/components/features/invoices/DistributionPanel";
import { InvoiceHistoryTable } from "@/components/features/invoices/InvoiceHistoryTable";
import { formatCurrency } from "@/lib/utils/currency";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function InvoicesPage() {
  const { user } = useUserStore();
  const { history, fetchInvoices, fetchAssociates, isLoading } = useInvoiceStore();
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

  const totalSpent = useMemo(() => {
    return history.reduce((acc, inv) => acc + inv.amount, 0);
  }, [history]);

  const pendingCount = useMemo(() => {
    return history.filter(inv => inv.status === "À valider").length;
  }, [history]);

  if (!mounted || !user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InvoiceKpi
          title="Dépenses cumulées"
          value={formatCurrency(totalSpent, user.country)}
          trend={history.length > 0 ? `Sur ${history.length} factures` : "Aucune facture"}
          trendType="positive"
        />
        <InvoiceKpi
          title="Factures en attente"
          value={pendingCount.toString()}
          description="À valider avant le 30"
        />
        <InvoiceKpi
          title="Capacité IA disponible"
          value="Illimité"
          progressBar
        />
      </div>

      {/* Main Split Interface */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Input Options */}
        <div className="flex-1 space-y-8">
          <InvoiceTabs />
          <InvoiceHistoryTable />
        </div>

        {/* Right: Dynamic Split Panel */}
        <div className="w-full lg:w-96">
          <DistributionPanel />
        </div>
      </div>
    </div>
  );
}
