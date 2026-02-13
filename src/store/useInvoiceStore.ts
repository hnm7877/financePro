import { create } from "zustand";
import { InvoiceCategory, CATEGORY_ICONS } from "@/types/invoice";

export interface Associate {
  _id?: string;
  name: string;
  share: number;
  avatar: string;
  isPrimary?: boolean;
  totalExpenses?: number;
}

export interface Invoice {
  _id?: string;
  merchant: string;
  date: string;
  category: InvoiceCategory;
  amount: number;
  status: "À valider" | "Ventilé";
  icon?: string;
}

interface InvoiceStore {
  currentInvoice: {
    merchant: string;
    date: string;
    category: InvoiceCategory;
    amount: number;
  };
  associates: Associate[];
  history: Invoice[];
  isLoading: boolean;
  
  // Actions
  setMerchant: (merchant: string) => void;
  setDate: (date: string) => void;
  setCategory: (category: InvoiceCategory) => void;
  setAmount: (amount: number) => void;
  
  // Async actions
  fetchInvoices: (email: string) => Promise<void>;
  fetchAssociates: (email: string) => Promise<void>;
  saveInvoice: (email: string) => Promise<void>;
  resetCurrentInvoice: () => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  currentInvoice: {
    merchant: "",
    date: new Date().toISOString().split("T")[0],
    category: InvoiceCategory.SERVICES_CLOUD,
    amount: 0,
  },
  associates: [],
  history: [],
  isLoading: false,

  setMerchant: (merchant) => set((state) => ({ currentInvoice: { ...state.currentInvoice, merchant } })),
  setDate: (date) => set((state) => ({ currentInvoice: { ...state.currentInvoice, date } })),
  setCategory: (category) => set((state) => ({ currentInvoice: { ...state.currentInvoice, category } })),
  setAmount: (amount) => set((state) => ({ currentInvoice: { ...state.currentInvoice, amount } })),

  fetchInvoices: async (email: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/invoices?email=${email}`);
      const data = await response.json();
      if (response.ok) {
        set({ history: data });
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAssociates: async (email: string) => {
    try {
      const response = await fetch(`/api/associates?email=${email}`);
      const data = await response.json();
      if (response.ok) {
        set({ associates: data });
      }
    } catch (error) {
      console.error("Failed to fetch associates:", error);
    }
  },

  saveInvoice: async (email: string) => {
    const { currentInvoice } = get();
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentInvoice,
          email,
          status: "Ventilé",
          icon: CATEGORY_ICONS[currentInvoice.category]
        }),
      });

      if (response.ok) {
        const newInvoice = await response.json();
        set((state) => ({ 
          history: [newInvoice, ...state.history],
        }));
        get().resetCurrentInvoice();
      }
    } catch (error) {
      console.error("Failed to save invoice:", error);
      throw error;
    }
  },

  resetCurrentInvoice: () => set({ 
    currentInvoice: {
      merchant: "",
      date: new Date().toISOString().split("T")[0],
      category: InvoiceCategory.SERVICES_CLOUD,
      amount: 0,
    }
  }),
}));
