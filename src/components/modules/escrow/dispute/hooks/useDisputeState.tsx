import { useEffect } from 'react';
import { useStore } from '../../../../../core/store';
import { Dispute } from '../../../../../@types/dispute.entity';
import { useDisputeAPI } from './useDisputeAPI';

export const useDisputeState = (escrowId?: string, disputeId?: string) => {
  const {
    disputeState,
    setDisputes,
    addDispute,
    updateDispute,
    setActiveDispute,
    setDisputeLoading,
    setDisputeError,
    getDisputesByEscrowId,
    getDisputeById,
  } = useStore((state) => state);

  const { 
    fetchDisputesByEscrowId, 
    fetchDisputeById, 
    isLoading: apiLoading, 
    error: apiError 
  } = useDisputeAPI({
    onSuccess: (data, actionType) => {
      if (actionType === 'fetch') {
        if (Array.isArray(data)) {
          // Convert array to record
          const disputesRecord = data.reduce((acc, dispute) => {
            acc[dispute.id] = dispute;
            return acc;
          }, {} as Record<string, Dispute>);
          
          setDisputes(disputesRecord);
        } else {
          // Single dispute
          updateDispute(data);
        }
      }
    },
    onError: (error) => {
      setDisputeError(error.message);
    },
  });

  // Sync API loading state with store
  useEffect(() => {
    setDisputeLoading(apiLoading);
  }, [apiLoading, setDisputeLoading]);

  // Sync API error with store
  useEffect(() => {
    if (apiError) {
      setDisputeError(apiError.message);
    }
  }, [apiError, setDisputeError]);

  // Load disputes for escrow if escrowId is provided
  useEffect(() => {
    if (escrowId) {
      fetchDisputesByEscrowId(escrowId);
    }
  }, [escrowId]);

  // Load single dispute if disputeId is provided
  useEffect(() => {
    if (disputeId) {
      fetchDisputeById(disputeId);
      setActiveDispute(disputeId);
    }
  }, [disputeId]);

  return {
    disputes: disputeState.disputes,
    activeDisputeId: disputeState.activeDisputeId,
    isLoading: disputeState.isLoading,
    error: disputeState.error,
    
    // Get filtered disputes if escrowId is provided
    filteredDisputes: escrowId 
      ? getDisputesByEscrowId(escrowId)
      : Object.values(disputeState.disputes),
      
    // Get active dispute if disputeId is provided
    activeDispute: disputeId 
      ? getDisputeById(disputeId)
      : disputeState.activeDisputeId 
        ? getDisputeById(disputeState.activeDisputeId)
        : undefined,
        
    // Actions
    addDispute,
    updateDispute,
    setActiveDispute,
    
    // Reload methods
    reloadDisputesByEscrowId: escrowId 
      ? () => fetchDisputesByEscrowId(escrowId) 
      : null,
    reloadDisputeById: disputeId 
      ? () => fetchDisputeById(disputeId) 
      : null,
  };
};