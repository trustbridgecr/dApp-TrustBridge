import { create } from "zustand";

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export interface ApprovedLoan {
  id: string;
  title: string;
  maxAmount: number;
  platformFee: number;
  borrower: string;
  amount: number;
  createdAt?: Timestamp;
  platformAddress?: string;
  approver?: string;
  disputeResolver?: string;
  releaseSigner?: string;
  description?: string;
  submittedBy?: {
    name?: string;
    email?: string;
    address?: string;
  };
  milestones?: {
    description: string;
  }[];
  status?: string;
  lenderWallet?: string;
  updatedAt?: Timestamp;
}
interface MarketplaceStore {
  selectedLoan: ApprovedLoan | null;
  setSelectedLoan: (loan: ApprovedLoan) => void;
  clearSelectedLoan: () => void;
}

export const useMarketplaceStore = create<MarketplaceStore>((set) => ({
  selectedLoan: null,
  setSelectedLoan: (loan) => set({ selectedLoan: loan }),
  clearSelectedLoan: () => set({ selectedLoan: null }),
}));
