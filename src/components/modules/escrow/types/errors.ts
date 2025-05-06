export type EscrowReleaseErrorType =
  | "INSUFFICIENT_FUNDS"
  | "TRANSACTION_REJECTED"
  | "NETWORK_ERROR"
  | "UNAUTHORIZED"
  | "CONTRACT_ERROR"
  | "MILESTONE_INCOMPLETE"
  | "WALLET_NOT_CONNECTED"
  | "INVALID_CONTRACT"
  | "UNKNOWN_ERROR";

export interface EscrowReleaseError {
  type: EscrowReleaseErrorType;
  message: string;
  details?: unknown;
}

export const ESCROW_RELEASE_ERRORS: Record<EscrowReleaseErrorType, string> = {
  INSUFFICIENT_FUNDS: "Insufficient funds to complete the transaction",
  TRANSACTION_REJECTED: "Transaction was rejected. Please try again",
  NETWORK_ERROR: "Network error occurred. Please check your connection",
  UNAUTHORIZED: "You are not authorized to release these funds",
  CONTRACT_ERROR: "Smart contract error occurred",
  MILESTONE_INCOMPLETE:
    "All milestones must be completed before releasing funds",
  WALLET_NOT_CONNECTED: "Please connect your wallet to release funds",
  INVALID_CONTRACT: "Invalid contract ID or contract not found",
  UNKNOWN_ERROR: "An unexpected error occurred while releasing funds",
};

export function createEscrowReleaseError(
  type: EscrowReleaseErrorType,
  details?: unknown,
): EscrowReleaseError {
  return {
    type,
    message: ESCROW_RELEASE_ERRORS[type],
    details,
  };
}

export function isEscrowReleaseError(
  error: unknown,
): error is EscrowReleaseError {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "message" in error &&
    typeof (error as EscrowReleaseError).type === "string" &&
    typeof (error as EscrowReleaseError).message === "string" &&
    Object.keys(ESCROW_RELEASE_ERRORS).includes(
      (error as EscrowReleaseError).type,
    )
  );
}
