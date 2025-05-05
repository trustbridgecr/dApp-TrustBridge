import { useState } from 'react';
import { 
  DisputeCreationPayload, 
  DisputeResolution, 
  DisputeResolutionPayload,
  DisputeStatus
} from '../../../../../@types/dispute.entity';
import { useDisputeAPI } from './useDisputeAPI';
import { useDisputeState } from './useDisputeState';
import { useToast } from '../../../../../hooks/toast.hook';

// Define wallet type to avoid using 'any'
interface WalletSigner {
  signMessage: (message: string) => Promise<string>;
}

interface UseDisputeProps {
  escrowId?: string;
  disputeId?: string;
}

export const useDispute = ({ escrowId, disputeId }: UseDisputeProps = {}) => {
  const [isStartingDispute, setIsStartingDispute] = useState(false);
  const [isResolvingDispute, setIsResolvingDispute] = useState(false);
  const { toast } = useToast();
  
  const { 
    startDispute: apiStartDispute, 
    resolveDispute: apiResolveDispute 
  } = useDisputeAPI();
  
  const {
    filteredDisputes,
    activeDispute,
    isLoading,
    error,
    addDispute,
    updateDispute,
    setActiveDispute,
    reloadDisputesByEscrowId,
    reloadDisputeById,
  } = useDisputeState(escrowId, disputeId);

  // Helper method to get a signed message for dispute operations
  const getSignedMessage = async (
    wallet: WalletSigner, 
    message: string
  ): Promise<string | null> => {
    try {
      // This depends on your wallet implementation
      // For example, with ethers.js:
      const signature = await wallet.signMessage(message);
      return signature;
    } catch {
      toast({
        title: 'Signature Error',
        description: 'Failed to sign the message. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const startDispute = async (
    wallet: WalletSigner,
    reason: string
  ) => {
    if (!escrowId) {
      toast({
        title: 'Error',
        description: 'Escrow ID is required to start a dispute',
        variant: 'destructive',
      });
      return null;
    }
    
    setIsStartingDispute(true);
    
    try {
      // Create message to sign with timestamp to prevent replay attacks
      const timestamp = Date.now();
      const message = `I want to start a dispute for escrow ${escrowId} with reason: ${reason} at timestamp ${timestamp}`;
      
      // Get signature
      const signature = await getSignedMessage(wallet, message);
      if (!signature) {
        setIsStartingDispute(false);
        return null;
      }
      
      // Create payload
      const payload: DisputeCreationPayload = {
        escrowId,
        disputeReason: reason,
        signature,
        timestamp,
      };
      
      // Start dispute through API
      const dispute = await apiStartDispute(payload);
      
      if (dispute) {
        // Add to store
        addDispute(dispute);
        
        // Set as active
        setActiveDispute(dispute.id);
        
        toast({
          title: 'Dispute Started',
          description: 'Your dispute has been successfully initiated.',
        });
      }
      
      setIsStartingDispute(false);
      return dispute;
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to start dispute',
        variant: 'destructive',
      });
      
      setIsStartingDispute(false);
      return null;
    }
  };

  const resolveDispute = async (
    wallet: WalletSigner,
    disputeId: string,
    resolution: DisputeResolution,
    details?: string
  ) => {
    setIsResolvingDispute(true);
    
    try {
      // Create message to sign with timestamp to prevent replay attacks
      const timestamp = Date.now();
      const message = `I want to resolve dispute ${disputeId} with resolution: ${resolution} at timestamp ${timestamp}`;
      
      // Get signature
      const signature = await getSignedMessage(wallet, message);
      if (!signature) {
        setIsResolvingDispute(false);
        return null;
      }
      
      // Create payload
      const payload: DisputeResolutionPayload = {
        disputeId,
        resolution,
        details,
        signature,
        timestamp,
      };
      
      // Resolve dispute through API
      const dispute = await apiResolveDispute(payload);
      
      if (dispute) {
        // Update in store
        updateDispute(dispute);
        
        toast({
          title: 'Dispute Resolved',
          description: 'The dispute has been successfully resolved.',
        });
      }
      
      setIsResolvingDispute(false);
      return dispute;
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to resolve dispute',
        variant: 'destructive',
      });
      
      setIsResolvingDispute(false);
      return null;
    }
  };

  const refreshDisputes = () => {
    if (reloadDisputesByEscrowId) {
      reloadDisputesByEscrowId();
    } else if (reloadDisputeById) {
      reloadDisputeById();
    }
  };

  return {
    // State
    disputes: filteredDisputes,
    activeDispute,
    isLoading,
    error,
    isStartingDispute,
    isResolvingDispute,
    
    // Actions
    startDispute,
    resolveDispute,
    refreshDisputes,
    setActiveDispute,
    
    // Check if user can start a dispute
    canStartDispute: escrowId !== undefined && filteredDisputes.length === 0,
    
    // Check if user can resolve a dispute
    canResolveDispute: activeDispute !== undefined && 
      activeDispute.status !== DisputeStatus.RESOLVED,
  };
};