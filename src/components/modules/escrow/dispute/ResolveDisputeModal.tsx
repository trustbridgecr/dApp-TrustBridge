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
import { 
  RadioGroup, 
  RadioGroupItem 
} from '../../../../components/ui/radio-group';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useDispute } from './hooks/useDispute';
import { useToast } from '../../../../hooks/toast.hook';
import { useWallet } from '../../../../components/utils/wallet/WalletContext';
import { 
  DisputeResolution, 
  Dispute 
} from '../../../../@types/dispute.entity';

interface ResolveDisputeModalProps {
  dispute: Dispute;
  isOpen: boolean;
  onClose: () => void;
}

export const ResolveDisputeModal: React.FC<ResolveDisputeModalProps> = ({
  dispute,
  isOpen,
  onClose,
}) => {
  const [resolution, setResolution] = useState<DisputeResolution>(DisputeResolution.NO_RESOLUTION);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resolveDispute } = useDispute();
  const { toast } = useToast();
  const { wallet, connectWallet } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resolution === DisputeResolution.NO_RESOLUTION) {
      toast({
        title: 'Error',
        description: 'Please select a resolution option.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!wallet) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet to resolve this dispute.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await resolveDispute(
        wallet,
        dispute.id,
        resolution,
        details.trim() || undefined
      );
      
      if (result) {
        onClose();
        setResolution(DisputeResolution.NO_RESOLUTION);
        setDetails('');
      }
    } catch (error) {
      console.error('Error resolving dispute:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
            Resolve Dispute
          </DialogTitle>
          <DialogDescription>
            Select a resolution for this dispute. This decision will be final and will determine how the escrow funds are distributed.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Resolution Option <span className="text-destructive">*</span>
            </Label>
            
            <RadioGroup 
              value={resolution} 
              onValueChange={(value) => setResolution(value as DisputeResolution)}
              className="space-y-3"
            >
              <div className="flex items-start space-x-2 rounded-md border p-3">
                <RadioGroupItem value={DisputeResolution.FAVOR_CLIENT} id="favor-client" />
                <div className="space-y-1">
                  <Label htmlFor="favor-client" className="font-medium">
                    In Favor of Client
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    All funds will be returned to the client.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 rounded-md border p-3">
                <RadioGroupItem value={DisputeResolution.FAVOR_FREELANCER} id="favor-freelancer" />
                <div className="space-y-1">
                  <Label htmlFor="favor-freelancer" className="font-medium">
                    In Favor of Freelancer
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    All funds will be released to the freelancer.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 rounded-md border p-3">
                <RadioGroupItem value={DisputeResolution.SPLIT} id="split" />
                <div className="space-y-1">
                  <Label htmlFor="split" className="font-medium">
                    Split Between Parties
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Funds will be divided equally between both parties.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resolution-details" className="text-sm font-medium">
              Resolution Details
            </Label>
            <Textarea
              id="resolution-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide details about why you chose this resolution..."
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              This explanation will be visible to all parties involved in the dispute.
            </p>
          </div>
          
          <DialogFooter className="pt-2">
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
              <Button 
                type="submit" 
                disabled={isSubmitting || resolution === DisputeResolution.NO_RESOLUTION}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Resolve Dispute'
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};