import { create } from "zustand";
import { DividendCalculation, FinancialSummary, ExpensePeriod } from "@/types/expense";

interface DividendStore {
  calculations: DividendCalculation[];
  summary: FinancialSummary | null;
  selectedPeriod: ExpensePeriod;
  isCalculating: boolean;
  
  // Actions
  setCalculations: (calculations: DividendCalculation[]) => void;
  setSummary: (summary: FinancialSummary) => void;
  setSelectedPeriod: (period: ExpensePeriod) => void;
  
  // Async actions
  calculateDividends: (email: string, startDate: string, endDate: string) => Promise<void>;
  fetchDividendHistory: (email: string) => Promise<void>;
}

export const useDividendStore = create<DividendStore>((set, get) => ({
  calculations: [],
  summary: null,
  selectedPeriod: ExpensePeriod.MONTHLY,
  isCalculating: false,

  setCalculations: (calculations) => set({ calculations }),
  
  setSummary: (summary) => set({ summary }),
  
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),

  calculateDividends: async (email: string, startDate: string, endDate: string) => {
    set({ isCalculating: true });
    try {
      const response = await fetch("/api/dividends/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          period: get().selectedPeriod,
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        set({
          calculations: data.calculations,
          summary: data.summary,
        });
      } else {
        throw new Error("Failed to calculate dividends");
      }
    } catch (error) {
      console.error("Failed to calculate dividends:", error);
      throw error;
    } finally {
      set({ isCalculating: false });
    }
  },

  fetchDividendHistory: async (email: string) => {
    try {
      const response = await fetch(`/api/dividends/history?email=${email}`);
      const data = await response.json();
      if (response.ok) {
        // Store historical data if needed
        console.log("Dividend history:", data);
      }
    } catch (error) {
      console.error("Failed to fetch dividend history:", error);
    }
  },
}));
