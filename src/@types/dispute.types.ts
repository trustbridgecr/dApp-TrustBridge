import { Dispute } from '../../../../@types/dispute.entity';

export interface DisputeState {
  disputes: Record<string, Dispute>;
  activeDisputeId: string | null;
  isLoading: boolean;
  error: string | null;
}

export type DisputeAction = 
  | { type: 'SET_DISPUTES'; payload: Record<string, Dispute> }
  | { type: 'ADD_DISPUTE'; payload: Dispute }
  | { type: 'UPDATE_DISPUTE'; payload: Dispute }
  | { type: 'SET_ACTIVE_DISPUTE'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };