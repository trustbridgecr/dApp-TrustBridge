import { create } from "zustand";

interface MarketplaceStore {
  selectedLoan: any | null;
  setSelectedLoan: (loan: any) => void;
  clearSelectedLoan: () => void;
}

export const useMarketplaceStore = create<MarketplaceStore>((set) => ({
  selectedLoan: null,
  setSelectedLoan: (loan) => set({ selectedLoan: loan }),
  clearSelectedLoan: () => set({ selectedLoan: null }),
}));
