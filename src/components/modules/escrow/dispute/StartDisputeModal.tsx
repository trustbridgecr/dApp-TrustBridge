import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Textarea } from '../../../../components/ui/textarea';
import { Label } from '../../../../components/ui/label';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useDispute } from './hooks/useDispute';
import { useToast } from '../../../../hooks/toast.hook';
import { useWallet } from '../../../../components/utils/wallet/WalletContext';

interface StartDisputeModalProps {
  escrowId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const StartDisputeModal: React.FC<StartDisputeModalProps> = ({
  escrowId,
  isOpen,
  onClose,
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startDispute } = useDispute({ escrowId });
  const { toast } = useToast();
  const { wallet, connectWallet } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for the dispute.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!wallet) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet to start a dispute.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await startDispute(wallet, reason.trim());
      
      if (result) {
        onClose();
        setReason('');
      }
    } catch (error) {
      console.error('Error starting dispute:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start the dispute. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
            Start a Dispute
          </DialogTitle>
          <DialogDescription>
            Provide a detailed reason for starting this dispute. This will be shared with all parties involved and cannot be changed later.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="dispute-reason" className="text-sm font-medium">
              Dispute Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="dispute-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain in detail why you are disputing this escrow..."
              className="min-h-[120px]"
              required
            />
            <p className="text-xs text-muted-foreground">
              Be specific and include all relevant details. This will help in the resolution process.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Important Information:</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
              <li>Starting a dispute will pause the escrow until resolution.</li>
              <li>A transaction signature will be required to confirm your request.</li>
              <li>All parties will be notified about this dispute.</li>
              <li>Resolution time depends on the complexity of the dispute.</li>
            </ul>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            {!wallet ? (
              <Button type="button" onClick={connectWallet}>
                Connect Wallet
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting || !reason.trim()}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Start Dispute'
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};