import { create } from "zustand";
import { Expense, ExpensePeriod, ExpenseCategory, EXPENSE_CATEGORY_ICONS } from "@/types/expense";

interface ExpenseStore {
  expenses: Expense[];
  currentPeriod: ExpensePeriod;
  isLoading: boolean;
  
  // Actions
  setExpenses: (expenses: Expense[]) => void;
  setPeriod: (period: ExpensePeriod) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  
  // Async actions
  fetchExpenses: (email: string, period?: ExpensePeriod) => Promise<void>;
  saveExpense: (email: string, expense: Omit<Expense, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  
  // Computed selectors
  getTotalExpensesByPeriod: (period: ExpensePeriod) => number;
  getExpensesByCategory: () => Record<ExpenseCategory, number>;
  getActiveExpenses: () => Expense[];
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],
  currentPeriod: ExpensePeriod.MONTHLY,
  isLoading: false,

  setExpenses: (expenses) => set({ expenses }),
  
  setPeriod: (period) => set({ currentPeriod: period }),
  
  addExpense: (expense) => set((state) => ({ 
    expenses: [expense, ...state.expenses] 
  })),
  
  updateExpense: (id, updatedExpense) => set((state) => ({
    expenses: state.expenses.map((exp) =>
      exp._id === id ? { ...exp, ...updatedExpense } : exp
    ),
  })),
  
  removeExpense: (id) => set((state) => ({
    expenses: state.expenses.filter((exp) => exp._id !== id),
  })),

  fetchExpenses: async (email: string, period?: ExpensePeriod) => {
    set({ isLoading: true });
    try {
      const periodParam = period || get().currentPeriod;
      const response = await fetch(`/api/expenses?email=${email}&period=${periodParam}`);
      const data = await response.json();
      if (response.ok) {
        set({ expenses: data });
      }
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  saveExpense: async (email: string, expense) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...expense,
          email,
          icon: EXPENSE_CATEGORY_ICONS[expense.category],
        }),
      });

      if (response.ok) {
        const newExpense = await response.json();
        get().addExpense(newExpense);
      } else {
        throw new Error("Failed to save expense");
      }
    } catch (error) {
      console.error("Failed to save expense:", error);
      throw error;
    }
  },

  deleteExpense: async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        get().removeExpense(id);
      } else {
        throw new Error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Failed to delete expense:", error);
      throw error;
    }
  },

  getTotalExpensesByPeriod: (period: ExpensePeriod) => {
    const { expenses } = get();
    return expenses
      .filter((exp) => exp.period === period && exp.status === "Active")
      .reduce((sum, exp) => sum + exp.amount, 0);
  },

  getExpensesByCategory: () => {
    const { expenses } = get();
    const byCategory: Record<ExpenseCategory, number> = {} as Record<ExpenseCategory, number>;
    
    Object.values(ExpenseCategory).forEach((category) => {
      byCategory[category] = 0;
    });

    expenses
      .filter((exp) => exp.status === "Active")
      .forEach((exp) => {
        byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
      });

    return byCategory;
  },

  getActiveExpenses: () => {
    return get().expenses.filter((exp) => exp.status === "Active");
  },
}));
