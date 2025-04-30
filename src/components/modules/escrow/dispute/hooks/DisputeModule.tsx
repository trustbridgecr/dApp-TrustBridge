import React, { useState, useEffect } from 'react';
import { Dispute } from '../../../../@types/dispute.entity';
import { useDispute } from './hooks/useDispute';
import { DisputesList } from './DisputesList';
import { DisputeDetails } from './DisputeDetails';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../../../../components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../../../components/ui/button';

interface DisputeModuleProps {
  escrowId: string;
  userId?: string;
  className?: string;
}

export const DisputeModule: React.FC<DisputeModuleProps> = ({
  escrowId,
  userId,
  className = '',
}) => {
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  
  const {
    disputes,
    isLoading,
    error,
    refreshDisputes,
  } = useDispute({ escrowId });
  
  // Reset selected dispute when escrow changes
  useEffect(() => {
    setSelectedDisputeId(null);
  }, [escrowId]);
  
  const handleSelectDispute = (dispute: Dispute) => {
    setSelectedDisputeId(dispute.id);
  };
  
  const handleBack = () => {
    setSelectedDisputeId(null);
  };
  
  // Loading state
  if (isLoading && disputes.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={() => refreshDisputes && refreshDisputes()}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Display selected dispute details or list
  if (selectedDisputeId) {
    const selectedDispute = disputes.find(d => d.id === selectedDisputeId);
    
    if (!selectedDispute) {
      return (
        <div className={`space-y-4 ${className}`}>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              The selected dispute was not found.
              <Button 
                variant="link" 
                className="ml-2 p-0 h-auto"
                onClick={handleBack}
              >
                Back to disputes list
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    
    return (
      <div className={className}>
        <DisputeDetails 
          dispute={selectedDispute} 
          userId={userId}
          onBack={handleBack}
        />
      </div>
    );
  }
  
  // Display disputes list
  return (
    <div className={className}>
      <DisputesList 
        disputes={disputes} 
        escrowId={escrowId}
        onSelectDispute={handleSelectDispute}
      />
    </div>
  );
};