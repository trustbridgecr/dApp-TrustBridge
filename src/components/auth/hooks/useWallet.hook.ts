import { useState } from "react";
import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { useGlobalAuthenticationStore } from "../store/data";
import { kit } from "../constant/walletKit";

export const useWallet = () => {
  const { connectWalletStore, disconnectWalletStore } =
    useGlobalAuthenticationStore();
  
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleSelectRole = async (role: string) => {
    localStorage.setItem("userRole", role); 
    setSelectedRole(role);
    setShowRoleModal(false); 
  
    await connectWallet();
  };
  

const connectWallet = async () => {
  await kit.openModal({
    modalTitle: "Connect to your favorite wallet",
    onWalletSelected: async (option: ISupportedWallet) => {
      kit.setWallet(option.id);

      const { address } = await kit.getAddress();
      const { name } = option;

      localStorage.setItem("walletAddress", address); 

      connectWalletStore(address, name);
    },
  });
};


  const handleOpenRoleModal = () => {
    setShowRoleModal(true);
    setTimeout(() => {
    }, 100);
  };
  

  const disconnectWallet = async () => {
    await kit.disconnect();
    disconnectWalletStore();
  };


  const handleConnect = async () => {
    console.log("ABRE HANDLE CONNECT");
    try {
      handleOpenRoleModal();
    } catch (error) {
      console.error("Error opening role selection modal:", error);
    }
  };
  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return {
    showRoleModal,
    selectedRole,
    handleConnect,
    handleDisconnect,
    handleSelectRole, 
    setShowRoleModal, 
  };
};
