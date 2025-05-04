import { StateCreator } from "zustand";

export interface WalletConnectionStore {
  walletConnected: boolean;
  checkWalletConnection: () => void;
  setWalletConnected: (connected: boolean) => void;
}

export const useWalletConnectionSlice: StateCreator<
  WalletConnectionStore,
  [],
  [],
  WalletConnectionStore
> = (set) => ({
  walletConnected: false,
  setWalletConnected: (connected: boolean) =>
    set({ walletConnected: connected }),
  checkWalletConnection: () => {
    const stellarWallet = localStorage.getItem("address-wallet");
    const metamaskWallet = localStorage.getItem("metamask-wallet");
    set({ walletConnected: !!stellarWallet || !!metamaskWallet });
  },
});
