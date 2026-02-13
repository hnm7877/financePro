"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { UploadZone } from "./UploadZone";
import { ManualInvoiceForm } from "./ManualInvoiceForm";

export function InvoiceTabs() {
  const [activeTab, setActiveTab] = useState<"ia" | "manual">("ia");

  return (
    <div className="bg-white dark:bg-[#1a2133] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="flex border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("ia")}
          className={cn(
            "flex-1 py-4 text-sm font-bold transition-all flex items-center justify-center gap-2",
            activeTab === "ia" 
              ? "text-primary border-b-2 border-primary bg-primary/5" 
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          )}
        >
          <span className="material-symbols-outlined text-xl">smart_toy</span>
          Upload Intelligent (IA)
        </button>
        <button
          onClick={() => setActiveTab("manual")}
          className={cn(
            "flex-1 py-4 text-sm font-bold transition-all flex items-center justify-center gap-2",
            activeTab === "manual" 
              ? "text-primary border-b-2 border-primary bg-primary/5" 
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          )}
        >
          <span className="material-symbols-outlined text-xl">edit_note</span>
          Saisie Manuelle
        </button>
      </div>
      <div className="p-8">
        {activeTab === "ia" ? <UploadZone /> : <ManualInvoiceForm />}
      </div>
    </div>
  );
}
