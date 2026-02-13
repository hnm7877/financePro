import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  fullName: string;
  companyName: string;
  email: string;
  country: string;
  phoneNumber: string;
  siret?: string;
  address?: string;
  currency?: string;
}

interface UserStore {
  user: UserState | null;
  setUser: (user: UserState) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "fintrack-user-storage",
    }
  )
);
