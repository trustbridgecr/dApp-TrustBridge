import { useState } from 'react';
import { 
  Dispute, 
  DisputeCreationPayload, 
  DisputeResolutionPayload
} from '../../../../../@types/dispute.entity';
import { useToast } from '../../../../../hooks/toast.hook';

interface UseDisputeAPIProps {
  onSuccess?: (data: Dispute | Dispute[], actionType: 'start' | 'resolve' | 'fetch') => void;
  onError?: (error: Error, actionType: 'start' | 'resolve' | 'fetch') => void;
}

export const useDisputeAPI = ({ onSuccess, onError }: UseDisputeAPIProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.trustlesswork.com';

  const handleError = (error: Error, actionType: 'start' | 'resolve' | 'fetch') => {
    setError(error);
    setIsLoading(false);
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
    if (onError) onError(error, actionType);
  };

  const startDispute = async (payload: DisputeCreationPayload): Promise<Dispute | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiUrl}/dispute/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start dispute');
      }
      
      const data = await response.json();
      
      toast({
        title: 'Success',
        description: 'Dispute has been started successfully',
      });
      
      if (onSuccess) onSuccess(data, 'start');
      
      setIsLoading(false);
      return data;
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to start dispute'), 'start');
      return null;
    }
  };

  const resolveDispute = async (payload: DisputeResolutionPayload): Promise<Dispute | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiUrl}/dispute/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resolve dispute');
      }
      
      const data = await response.json();
      
      toast({
        title: 'Success',
        description: 'Dispute has been resolved successfully',
      });
      
      if (onSuccess) onSuccess(data, 'resolve');
      
      setIsLoading(false);
      return data;
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to resolve dispute'), 'resolve');
      return null;
    }
  };

  const fetchDisputesByEscrowId = async (escrowId: string): Promise<Dispute[] | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiUrl}/disputes/escrow/${escrowId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch disputes');
      }
      
      const data = await response.json();
      
      if (onSuccess) onSuccess(data, 'fetch');
      
      setIsLoading(false);
      return data;
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to fetch disputes'), 'fetch');
      return null;
    }
  };

  const fetchDisputeById = async (disputeId: string): Promise<Dispute | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiUrl}/disputes/${disputeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch dispute');
      }
      
      const data = await response.json();
      
      if (onSuccess) onSuccess(data, 'fetch');
      
      setIsLoading(false);
      return data;
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to fetch dispute'), 'fetch');
      return null;
    }
  };

  return {
    startDispute,
    resolveDispute,
    fetchDisputesByEscrowId,
    fetchDisputeById,
    isLoading,
    error,
  };
};