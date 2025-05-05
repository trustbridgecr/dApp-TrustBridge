import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import Cookies from "js-cookie";
import { useState } from "react";
import { kit } from "../constants/wallet-kit.constant";
import { useWalletStore } from "@/core/store/wallet/wallet.store";

const SELECTED_WALLET_ID = "selectedWalletId";

function getSelectedWalletId() {
  return localStorage.getItem(SELECTED_WALLET_ID);
}



export const useWallet = () => {
  const { connectWalletStore, disconnectWalletStore } = useGlobalAuthenticationStore();
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const connectWallet = async () => {
    const { setPublicKey } = useWalletStore.getState();
  
    await kit.openModal({
      modalTitle: "Connect to your favorite wallet",
      onWalletSelected: async (option: ISupportedWallet) => {
        try {
          localStorage.setItem(SELECTED_WALLET_ID, option.id);
          kit.setWallet(option.id);
  
          const { address } = await kit.getAddress();
          setPublicKey(address); // Update the global state with the wallet address
          connectWalletStore(address, option.name);
          Cookies.set("isAuthenticated", "true");
        } catch (error) {
          console.error("Error connecting wallet:", error);
        }
      },
    });
  };

  const disconnectWallet = async () => {
    try {
      localStorage.removeItem(SELECTED_WALLET_ID);
      localStorage.removeItem("publicKey");
      kit.disconnect();
      setPublicKey(null);
      disconnectWalletStore();
      Cookies.remove("isAuthenticated");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const getPublicKey = async () => {
    if (!getSelectedWalletId()) return null;
    const { address } = await kit.getAddress();
    setPublicKey(address);
    return address;
  };

  return { connectWallet, disconnectWallet, publicKey, getPublicKey };
};