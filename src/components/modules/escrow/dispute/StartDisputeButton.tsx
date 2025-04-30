import React, { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useDispute } from './hooks/useDispute';
import { StartDisputeModal } from './StartDisputeModal';

interface StartDisputeButtonProps {
  escrowId: string;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const StartDisputeButton: React.FC<StartDisputeButtonProps> = ({
  escrowId,
  disabled = false,
  variant = 'destructive',
  size = 'default',
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { canStartDispute } = useDispute({ escrowId });
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  if (!canStartDispute) {
    return null;
  }
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpenModal}
        disabled={disabled}
        className={className}
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Start Dispute
      </Button>
      
      <StartDisputeModal
        escrowId={escrowId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};