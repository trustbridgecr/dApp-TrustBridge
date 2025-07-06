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
    // Validate inputs
    if (!transaction) {
      throw new Error("No transaction provided for signing");
    }

    // Note: Wallet connection will be checked by the kit.signTransaction method

    const unsignedXdr = typeof transaction === 'string' ? transaction : transaction.toXDR();
    
    // Validate XDR format
    if (!unsignedXdr || typeof unsignedXdr !== 'string') {
      throw new Error("Invalid transaction format. Unable to generate XDR.");
    }

    console.log("Attempting to sign transaction with wallet...");
    
    const { signedTxXdr } = await kit.signTransaction(unsignedXdr, {
      networkPassphrase: NETWORK_CONFIG.networkPassphrase,
    });

    // Validate signed transaction
    if (!signedTxXdr) {
      throw new Error("Wallet returned empty signed transaction");
    }

    console.log("Transaction signed successfully");

    const signedTx = TransactionBuilder.fromXDR(signedTxXdr, NETWORK_CONFIG.networkPassphrase);
    if ('memo' in signedTx) {
      return signedTx as Transaction<Memo, Operation[]>;
    }
    throw new Error('Unexpected transaction type returned from signing');
    
  } catch (error: unknown) {
    console.error("Transaction signing error:", error);
    
    const walletError = error as WalletError;
    
    // Handle specific wallet error codes
    if (walletError.code === -1) {
      throw new Error("Wallet rejected the transaction. Please try again.");
    }
    
    if (walletError.code === -2) {
      throw new Error("Wallet timeout. Please try signing the transaction again.");
    }
    
    if (walletError.code === -3) {
      throw new Error("Wallet connection lost. Please reconnect your wallet and try again.");
    }

    // Handle specific error messages
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes("user rejected") || errorMessage.includes("user denied")) {
        throw new Error("Transaction cancelled by user");
      }
      
      if (errorMessage.includes("timeout")) {
        throw new Error("Transaction signing timed out. Please try again.");
      }
      
      if (errorMessage.includes("network")) {
        throw new Error("Network error during signing. Please check your connection and try again.");
      }
      
      if (errorMessage.includes("invalid") || errorMessage.includes("malformed")) {
        throw new Error("Invalid transaction format. Please try again or contact support.");
      }
      
      if (errorMessage.includes("insufficient")) {
        throw new Error("Insufficient funds for transaction fees. Please ensure your account has enough XLM.");
      }
      
      if (errorMessage.includes("sequence")) {
        throw new Error("Transaction sequence error. Please refresh and try again.");
      }
      
      if (errorMessage.includes("not connected") || errorMessage.includes("no wallet")) {
        throw new Error("Wallet not connected. Please connect your wallet first.");
      }
      
      // Return the original error message if it's descriptive enough
      if (error.message.length > 10) {
        throw new Error(`Transaction signing failed: ${error.message}`);
      }
    }
    
    // Fallback for unknown errors
    throw new Error("Unknown error occurred while signing transaction. Please try again.");
  }
}
