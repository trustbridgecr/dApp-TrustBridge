import { kit } from "@/config/wallet-kit";
import { useWalletContext } from "@/providers/wallet.provider";
import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { db, doc, getDoc, setDoc } from "@/lib/firebase";
import { UserProfile } from "@/@types/user.entity";
import { toast } from "sonner";

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

        // Check if user profile exists and create if it doesn't
        try {
          const userDoc = await getDoc(doc(db, "users", address));

          if (!userDoc.exists()) {
            const now = Date.now();
            const initialProfile: UserProfile = {
              walletAddress: address,
              firstName: "",
              lastName: "",
              country: "",
              phoneNumber: "",
              createdAt: now,
              updatedAt: now,
            };

            await setDoc(doc(db, "users", address), initialProfile);
            toast.success("Welcome! Please complete your profile.");
          }
        } catch (error) {
          console.error("Error creating initial profile:", error);
          toast.error("Failed to create initial profile");
        }
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
