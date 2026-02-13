import { create } from 'zustand';

interface ModalStore {
  isPremiumModalOpen: boolean;
  openPremiumModal: () => void;
  closePremiumModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isPremiumModalOpen: false,
  openPremiumModal: () => set({ isPremiumModalOpen: true }),
  closePremiumModal: () => set({ isPremiumModalOpen: false }),
}));
