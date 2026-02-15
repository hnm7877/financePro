import { create } from "zustand";
import { Revenue, RevenueCategory, CreateRevenueInput } from "@/types/revenue";
import { ExpensePeriod } from "@/types/expense";

interface RevenueStore {
  // State
  revenues: Revenue[];
  currentPeriod: ExpensePeriod;
  isLoading: boolean;

  // Actions
  setRevenues: (revenues: Revenue[]) => void;
  setCurrentPeriod: (period: ExpensePeriod) => void;
  addRevenue: (revenue: Revenue) => void;
  updateRevenue: (id: string, revenue: Partial<Revenue>) => void;
  deleteRevenue: (id: string) => void;
  
  // API Actions
  fetchRevenues: (email: string, period?: ExpensePeriod) => Promise<void>;
  saveRevenue: (email: string, revenue: CreateRevenueInput) => Promise<void>;

  // Computed Selectors
  getTotalRevenuesByPeriod: (period: ExpensePeriod) => number;
  getRevenuesByCategory: () => Record<string, number>;
  getRevenuesByStatus: (status: "Encaissé" | "En attente") => Revenue[];
}

export const useRevenueStore = create<RevenueStore>((set, get) => ({
  // Initial State
  revenues: [],
  currentPeriod: ExpensePeriod.MONTHLY,
  isLoading: false,

  // Actions
  setRevenues: (revenues) => set({ revenues }),
  
  setCurrentPeriod: (period) => set({ currentPeriod: period }),
  
  addRevenue: (revenue) =>
    set((state) => ({ revenues: [...state.revenues, revenue] })),
  
  updateRevenue: (id, updatedRevenue) =>
    set((state) => ({
      revenues: state.revenues.map((rev) =>
        rev._id === id ? { ...rev, ...updatedRevenue } : rev
      ),
    })),
  
  deleteRevenue: (id) =>
    set((state) => ({
      revenues: state.revenues.filter((rev) => rev._id !== id),
    })),

  // API Actions
  fetchRevenues: async (email: string, period?: ExpensePeriod) => {
    set({ isLoading: true });
    try {
      const periodParam = period || get().currentPeriod;
      const response = await fetch(`/api/revenues?email=${email}&period=${periodParam}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch revenues");
      }
      
      const data = await response.json();
      set({ revenues: data.revenues || [] });
    } catch (error) {
      console.error("Failed to fetch revenues:", error);
      set({ revenues: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  saveRevenue: async (email: string, revenue: CreateRevenueInput) => {
    const response = await fetch("/api/revenues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...revenue }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to save revenue");
    }

    const data = await response.json();
    get().addRevenue(data.revenue);
  },

  // Computed Selectors
  getTotalRevenuesByPeriod: (period: ExpensePeriod) => {
    const { revenues } = get();
    return revenues
      .filter((rev) => rev.period === period && rev.status === "Encaissé")
      .reduce((sum, rev) => sum + rev.amount, 0);
  },

  getRevenuesByCategory: () => {
    const { revenues } = get();
    const byCategory: Record<string, number> = {};
    
    revenues
      .filter((rev) => rev.status === "Encaissé")
      .forEach((rev) => {
        byCategory[rev.category] = (byCategory[rev.category] || 0) + rev.amount;
      });
    
    return byCategory;
  },

  getRevenuesByStatus: (status: "Encaissé" | "En attente") => {
    const { revenues } = get();
    return revenues.filter((rev) => rev.status === status);
  },
}));
