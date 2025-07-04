import { kit } from "@/config/wallet-kit";
import { NETWORK_CONFIG } from "@/config/contracts";
import { Transaction, TransactionBuilder, Memo, Operation } from "@stellar/stellar-sdk";



/**
 * Custom error type for wallet-related errors
 */
interface WalletError extends Error {
  code?: number;
  message: string;
  name: string;
}

/**
 * Sign a transaction using the connected wallet
 * 
 * @param transaction - The transaction to sign (can be Transaction object or XDR string)
 * @returns The signed transaction
 * @throws {Error} If the transaction signing fails or returns an unexpected type
 */
export async function signTransaction(transaction: Transaction<Memo, Operation[]> | string): Promise<Transaction<Memo, Operation[]>> {
  try {
    const unsignedXdr = typeof transaction === 'string' ? transaction : transaction.toXDR();
    
    const { signedTxXdr } = await kit.signTransaction(unsignedXdr, {
      networkPassphrase: NETWORK_CONFIG.networkPassphrase,
    });

    const signedTx = TransactionBuilder.fromXDR(signedTxXdr, NETWORK_CONFIG.networkPassphrase);
    if ('memo' in signedTx) {
      return signedTx as Transaction<Memo, Operation[]>;
    }
    throw new Error('Unexpected transaction type returned from signing');
  } catch (error: unknown) {
    if ((error as WalletError).code === -1) {
      throw new Error("Wallet rejected the transaction. Please try again.");
    }
    if (error instanceof Error) {
      throw new Error(`Transaction signing failed: ${error.message}`);
    }
    throw new Error("Unknown error occurred while signing transaction");
  }
}
