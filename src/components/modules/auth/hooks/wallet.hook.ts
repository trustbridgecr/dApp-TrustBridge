import { kit } from "@/config/wallet-kit";
import { useWalletContext } from "@/providers/wallet.provider";
import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";

export const useWallet = () => {
  // Get wallet info from wallet context
  const { setWalletInfo, clearWalletInfo } = useWalletContext();

  /**
   * Connect to a wallet using the Stellar Wallet Kit and set the wallet info in the wallet context
   */
  const connectWallet = async () => {
    await kit.openModal({
      modalTitle: "Connect to your favorite wallet",
      onWalletSelected: async (option: ISupportedWallet) => {
        kit.setWallet(option.id);

        const { address } = await kit.getAddress();
        const { name } = option;

        setWalletInfo(address, name);
      },
    });
  };

  /**
   * Disconnect from the wallet using the Stellar Wallet Kit and clear the wallet info in the wallet context
   */
  const disconnectWallet = async () => {
    await kit.disconnect();
    clearWalletInfo();
  };

  /**
   * Handle the connection to the wallet by some button click
   */
  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  /**
   * Handle the disconnection to the wallet by some button click
   */
  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
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
