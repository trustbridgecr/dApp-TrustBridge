export type EscrowReleaseError =
  | "INSUFFICIENT_FUNDS"
  | "TRANSACTION_REJECTED"
  | "NETWORK_ERROR"
  | "UNAUTHORIZED"
  | "CONTRACT_ERROR"
  | "UNKNOWN_ERROR";

export const ERROR_MESSAGES: Record<EscrowReleaseError, string> = {
  INSUFFICIENT_FUNDS: "Insufficient funds to complete the transaction",
  TRANSACTION_REJECTED: "Transaction was rejected. Please try again",
  NETWORK_ERROR: "Network error occurred. Please check your connection",
  UNAUTHORIZED: "You are not authorized to release these funds",
  CONTRACT_ERROR: "Smart contract error occurred",
  UNKNOWN_ERROR: "Failed to release escrow funds",
};

export function getErrorType(error: Error): EscrowReleaseError {
  const message = error.message.toLowerCase();

  if (message.includes("insufficient funds")) {
    return "INSUFFICIENT_FUNDS";
  }
  if (message.includes("rejected")) {
    return "TRANSACTION_REJECTED";
  }
  if (message.includes("network")) {
    return "NETWORK_ERROR";
  }
  if (message.includes("unauthorized") || message.includes("not authorized")) {
    return "UNAUTHORIZED";
  }
  if (message.includes("contract")) {
    return "CONTRACT_ERROR";
  }
  return "UNKNOWN_ERROR";
}
