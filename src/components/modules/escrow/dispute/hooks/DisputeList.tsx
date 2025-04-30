import React from 'react';
import { Dispute } from '../../../../@types/dispute.entity';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Separator } from '../../../../components/ui/separator';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';
import { useDisputeStatusFormat } from '../../../../utils/hook/dispute.hook';
import { format } from 'date-fns';
import { StartDisputeButton } from './StartDisputeButton';

interface DisputesListProps {
  disputes: Dispute[];
  escrowId: string;
  onSelectDispute?: (dispute: Dispute) => void;
  className?: string;
}

export const DisputesList: React.FC<DisputesListProps> = ({
  disputes,
  escrowId,
  onSelectDispute,
  className = '',
}) => {
  const { getStatusText, getStatusColor } = useDisputeStatusFormat();
  
  const handleSelectDispute = (dispute: Dispute) => {
    if (onSelectDispute) {
      onSelectDispute(dispute);
    }
  };
  
  // Sort disputes by creation date, newest first
  const sortedDisputes = [...disputes].sort((a, b) => b.createdAt - a.createdAt);
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Dispute Resolution</CardTitle>
          </div>
          
          <StartDisputeButton escrowId={escrowId} />
        </div>
        <CardDescription>
          View and manage disputes for this escrow
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {sortedDisputes.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex justify-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground opacity-20" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No Disputes</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no disputes for this escrow.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDisputes.map((dispute, index) => {
              const statusText = getStatusText(dispute.status);
              const statusColor = getStatusColor(dispute.status);
              
              return (
                <React.Fragment key={dispute.id}>
                  {index > 0 && <Separator />}
                  <div className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-sm">
                            Dispute #{sortedDisputes.length - index}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`bg-${statusColor}-50 text-${statusColor}-700 border-${statusColor}-200`}
                          >
                            {statusText}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(dispute.createdAt), 'MMM d, yyyy')}
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center text-xs"
                        onClick={() => handleSelectDispute(dispute)}
                      >
                        Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="mt-2">
                      <h4 className="text-xs font-medium">Reason:</h4>
                      <p className="text-sm mt-1 line-clamp-2">
                        {dispute.reason}
                      </p>
                    </div>
                    
                    {dispute.resolvedAt && (
                      <div className="mt-2 flex items-center text-xs text-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Resolved on {format(new Date(dispute.resolvedAt), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};