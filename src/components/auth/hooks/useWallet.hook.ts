import { useState } from "react";
import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { useGlobalAuthenticationStore } from "../store/data";
import { kit } from "../constant/walletKit";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/@types/auth";

export const useWallet = () => {
  const { connectWalletStore, disconnectWalletStore } = useGlobalAuthenticationStore();
  const { login, logout } = useAuth();
  
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleSelectRole = async (role: UserRole) => {
    setSelectedRole(role);
    setShowRoleModal(false);
    await connectWallet(role);
  };

  const connectWallet = async (role: UserRole) => {
    await kit.openModal({
      modalTitle: "Connect to your favorite wallet",
      onWalletSelected: async (option: ISupportedWallet) => {
        kit.setWallet(option.id);

        const { address } = await kit.getAddress();
        const { name } = option;

        // Update both global wallet store and auth context
        connectWalletStore(address, name);
        login(address, name, role);
      },
    });
  };

  const handleOpenRoleModal = () => {
    setShowRoleModal(true);
  };

  const disconnectWallet = async () => {
    await kit.disconnect();
    disconnectWalletStore();
    logout();
  };

  const handleConnect = async () => {
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
