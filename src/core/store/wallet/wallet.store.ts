import { create } from "zustand";

interface WalletState {
  publicKey: string | null;
  setPublicKey: (publicKey: string | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  publicKey: typeof window !== "undefined" ? localStorage.getItem("publicKey") : null,
  setPublicKey: (publicKey) => {
    if (publicKey) {
      localStorage.setItem("publicKey", publicKey); // Persist to localStorage
    } else {
      localStorage.removeItem("publicKey"); // Clear from localStorage
    }
    set({ publicKey });
  },
}));