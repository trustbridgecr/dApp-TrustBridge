import { kit } from "@/config/wallet-kit";
import { useWalletContext } from "@/providers/wallet.provider";
import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { db, doc, getDoc, setDoc } from "@/lib/firebase";
import { UserProfile } from "@/@types/user.entity";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useWallet = () => {
  // Get wallet info from wallet context
  const { setWalletInfo, clearWalletInfo } = useWalletContext();
  const router = useRouter();

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

        // Check if user profile exists and create if it doesn't
        try {
          const userDoc = await getDoc(doc(db, "users", address));

          let displayName = name; // fallback to wallet name
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            if (userData.firstName || userData.lastName) {
              displayName = `${userData.firstName} ${userData.lastName}`.trim();
            }
          }
    
          setWalletInfo(address, displayName);

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
          } else {
            // Show welcome back message for existing users
            const userData = userDoc.data() as UserProfile;
            if (userData.firstName || userData.lastName) {
              toast.success(`Welcome back, ${displayName}!`);
            } else {
              toast.success("Welcome back! Please complete your profile.");
            }
          }
        } catch (error) {
          console.error("Error creating profile:", error);
          setWalletInfo(address, name); // fallback to wallet name
          toast.error("Failed to load profile");
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
      router.push("/");
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
