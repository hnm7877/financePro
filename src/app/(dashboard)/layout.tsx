"use client";

import { DashboardSidebar } from "@/components/features/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/features/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100"
      suppressHydrationWarning={true}
    >
      <DashboardSidebar />
      <div 
        className="flex-1 flex flex-col min-w-0 overflow-hidden"
        suppressHydrationWarning={true}
      >
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
