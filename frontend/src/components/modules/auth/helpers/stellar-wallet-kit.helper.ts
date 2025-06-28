import { kit } from "@/config/wallet-kit";
import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";

interface signTransactionProps {
  unsignedTransaction: string;
  address: string;
}

/**
 * Sign a transaction
 *
 * @Flow:
 * 1. Sign the unsigned transaction
 * 2. Return the signed transaction
 */
export const signTransaction = async ({
  unsignedTransaction,
  address,
}: signTransactionProps): Promise<string> => {
  const { signedTxXdr } = await kit.signTransaction(unsignedTransaction, {
    address,
    networkPassphrase: WalletNetwork.TESTNET,
  });

  return signedTxXdr;
};
