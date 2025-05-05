import React, { useState } from 'react';
import { Dispute } from '../../../../@types/dispute.entity';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../../../../components/ui/alert';
import { 
  Shield, 
  Calendar, 
  User, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { useDisputeStatusFormat, useDisputePermissions } from '../../../../utils/hook/dispute.hook';
import { DisputeTimeline } from './DisputeTimeline';
import { ResolveDisputeModal } from './ResolveDisputeModal';
import { format } from 'date-fns';
import { getStatusBadgeClass } from '../../../../utils/ui/status-badges';

interface DisputeDetailsProps {
  dispute: Dispute;
  userId?: string;
  onBack?: () => void;
  className?: string;
}

export const DisputeDetails: React.FC<DisputeDetailsProps> = ({
  dispute,
  userId,
  onBack,
  className = '',
}) => {
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  
  const { getStatusText, getStatusColor, getResolutionText } = useDisputeStatusFormat();
  const { canResolve } = useDisputePermissions(dispute, userId);
  
  const statusText = getStatusText(dispute.status);
  const statusColor = getStatusColor(dispute.status);
  
  const handleOpenResolveModal = () => {
    setIsResolveModalOpen(true);
  };
  
  const handleCloseResolveModal = () => {
    setIsResolveModalOpen(false);
  };

  // Safe string truncation helper
  const truncateString = (str: string, startLen = 8, endLen = 6): string => {
    if (!str || str.length <= startLen + endLen) {
      return str || '';
    }
    return `${str.substring(0, startLen)}...${str.substring(str.length - endLen)}`;
  };
  
  return (
    <>
      <Card className={`${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Dispute Details</CardTitle>
            </div>
            <Badge
              variant="outline"
              className={getStatusBadgeClass(statusColor)}
            >
              {statusText}
            </Badge>
          </div>
          <CardDescription>
            Viewing details for dispute ID: {truncateString(dispute.id, 10, 0)}...
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                Created
              </h4>
              <p className="text-sm">
                {format(new Date(dispute.createdAt), 'MMMM d, yyyy h:mm a')}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <User className="h-4 w-4 mr-1 text-muted-foreground" />
                Initiated By
              </h4>
              <p className="text-sm font-mono">
                {truncateString(dispute.initiatedBy)}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-muted-foreground" />
                Reason
              </h4>
              <p className="text-sm bg-muted p-2 rounded-md">
                {dispute.reason}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                Escrow ID
              </h4>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-mono">
                  {truncateString(dispute.escrowId)}
                </p>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`/dashboard/escrows/${dispute.escrowId}`} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Resolution Info (if resolved) */}
          {dispute.resolvedAt && dispute.resolution && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h4 className="font-medium">Resolution Details</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Resolved On</h4>
                  <p className="text-sm">
                    {format(new Date(dispute.resolvedAt), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Resolution</h4>
                  <Badge variant="outline">
                    {getResolutionText(dispute.resolution)}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          {/* Warning Alert for Pending Disputes */}
          {!dispute.resolvedAt && (
            <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Dispute in Progress</AlertTitle>
              <AlertDescription>
                This dispute is currently in progress. The associated escrow is frozen until the dispute is resolved.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Timeline */}
          <DisputeTimeline dispute={dispute} className="mt-6" />
        </CardContent>
        
        <CardFooter className="flex justify-between space-x-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back to Disputes
            </Button>
          )}
          
          {canResolve && !dispute.resolvedAt && (
            <Button onClick={handleOpenResolveModal}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Resolve Dispute
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Resolve Dispute Modal */}
      {canResolve && (
        <ResolveDisputeModal
          dispute={dispute}
          isOpen={isResolveModalOpen}
          onClose={handleCloseResolveModal}
        />
      )}
    </>
  );
};