import { Dispute } from '../../../../@types/dispute.entity';

export interface DisputeState {
  disputes: Record<string, Dispute>;
  activeDisputeId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface DisputeGlobalStore {
  // State
  disputeState: DisputeState;
  
  // Actions
  setDisputes: (disputes: Record<string, Dispute>) => void;
  addDispute: (dispute: Dispute) => void;
  updateDispute: (dispute: Dispute) => void;
  setActiveDispute: (disputeId: string | null) => void;
  setDisputeLoading: (isLoading: boolean) => void;
  setDisputeError: (error: string | null) => void;
  
  // Selectors
  getDisputesByEscrowId: (escrowId: string) => Dispute[];
  getDisputeById: (disputeId: string) => Dispute | undefined;
  
  // Reset
  resetDisputeState: () => void;
}