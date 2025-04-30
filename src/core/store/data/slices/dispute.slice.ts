import { StateCreator } from 'zustand';
import { DisputeGlobalStore, DisputeState } from '../@types/dispute.entity';

const initialState: DisputeState = {
  disputes: {},
  activeDisputeId: null,
  isLoading: false,
  error: null,
};

export const useGlobalDisputeSlice: StateCreator<DisputeGlobalStore> = (set, get) => ({
  disputeState: initialState,
  
  setDisputes: (disputes) => set((state) => ({
    disputeState: {
      ...state.disputeState,
      disputes,
    },
  })),
  
  addDispute: (dispute) => set((state) => ({
    disputeState: {
      ...state.disputeState,
      disputes: {
        ...state.disputeState.disputes,
        [dispute.id]: dispute,
      },
    },
  })),
  
  updateDispute: (dispute) => set((state) => ({
    disputeState: {
      ...state.disputeState,
      disputes: {
        ...state.disputeState.disputes,
        [dispute.id]: {
          ...state.disputeState.disputes[dispute.id],
          ...dispute,
        },
      },
    },
  })),
  
  setActiveDispute: (disputeId) => set((state) => ({
    disputeState: {
      ...state.disputeState,
      activeDisputeId: disputeId,
    },
  })),
  
  setDisputeLoading: (isLoading) => set((state) => ({
    disputeState: {
      ...state.disputeState,
      isLoading,
    },
  })),
  
  setDisputeError: (error) => set((state) => ({
    disputeState: {
      ...state.disputeState,
      error,
    },
  })),
  
  getDisputesByEscrowId: (escrowId) => {
    const { disputes } = get().disputeState;
    return Object.values(disputes).filter(
      (dispute) => dispute.escrowId === escrowId
    );
  },
  
  getDisputeById: (disputeId) => {
    const { disputes } = get().disputeState;
    return disputes[disputeId];
  },
  
  resetDisputeState: () => set(() => ({
    disputeState: initialState,
  })),
});