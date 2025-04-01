import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { kit } from "../constant/walletKit";
import { useGlobalAuthenticationStore } from "../store/data";

export const useWallet = () => {
  const { connectWalletStore, disconnectWalletStore } =
    useGlobalAuthenticationStore();

  const connectWallet = async (walletName: string) => {
    if (walletName !== "Stellar") {
      throw new Error("Only Stellar wallet is supported for connection.");
    }

    await kit.openModal({
      modalTitle: "Connect to your Stellar Wallet",
      onWalletSelected: async (option: ISupportedWallet) => {
        kit.setWallet(option.id);

        const { address } = await kit.getAddress();
        const { name } = option;

        connectWalletStore(address, name);

        return address;
      },
    });
  };

  const disconnectWallet = async () => {
    await kit.disconnect();
    disconnectWalletStore();
  };

  const handleConnect = async () => {
    try {
      await connectWallet("Stellar");
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      if (disconnectWallet) {
        await disconnectWallet();
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return {
    connectWallet,
    disconnectWallet,
    handleConnect,
    handleDisconnect,
  };
};
