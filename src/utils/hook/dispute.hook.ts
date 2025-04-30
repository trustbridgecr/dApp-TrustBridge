import { Dispute, DisputeResolution, DisputeStatus } from '../../@types/dispute.entity';

/**
 * Formats a dispute status into a user-friendly string
 */
export const useDisputeStatusFormat = () => {
  const getStatusText = (status: DisputeStatus): string => {
    switch (status) {
      case DisputeStatus.PENDING:
        return 'Pending';
      case DisputeStatus.IN_REVIEW:
        return 'In Review';
      case DisputeStatus.RESOLVED:
        return 'Resolved';
      case DisputeStatus.CANCELLED:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: DisputeStatus): string => {
    switch (status) {
      case DisputeStatus.PENDING:
        return 'amber';
      case DisputeStatus.IN_REVIEW:
        return 'blue';
      case DisputeStatus.RESOLVED:
        return 'green';
      case DisputeStatus.CANCELLED:
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getResolutionText = (resolution: DisputeResolution): string => {
    switch (resolution) {
      case DisputeResolution.FAVOR_CLIENT:
        return 'In Favor of Client';
      case DisputeResolution.FAVOR_FREELANCER:
        return 'In Favor of Freelancer';
      case DisputeResolution.SPLIT:
        return 'Split Between Parties';
      case DisputeResolution.NO_RESOLUTION:
        return 'No Resolution';
      default:
        return 'Pending';
    }
  };

  return {
    getStatusText,
    getStatusColor,
    getResolutionText,
  };
};

/**
 * Returns timeline events from a dispute in chronological order
 */
export const useDisputeTimeline = (dispute?: Dispute) => {
  if (!dispute) {
    return [];
  }

  // Sort events by timestamp (oldest first)
  const sortedEvents = [...dispute.events].sort((a, b) => a.timestamp - b.timestamp);

  // Add creation event if not present
  if (!sortedEvents.some(event => event.eventType === 'created')) {
    sortedEvents.unshift({
      id: `creation-${dispute.id}`,
      disputeId: dispute.id,
      timestamp: dispute.createdAt,
      eventType: 'created',
      performedBy: dispute.initiatedBy,
      details: { reason: dispute.reason },
    });
  }

  // Add resolution event if dispute is resolved but no resolution event exists
  if (
    dispute.status === DisputeStatus.RESOLVED &&
    dispute.resolvedAt &&
    !sortedEvents.some(event => event.eventType === 'resolved')
  ) {
    sortedEvents.push({
      id: `resolution-${dispute.id}`,
      disputeId: dispute.id,
      timestamp: dispute.resolvedAt,
      eventType: 'resolved',
      performedBy: 'system', // This might need to be updated based on your implementation
      details: { resolution: dispute.resolution },
    });
  }

  return sortedEvents;
};

/**
 * Checks if a user has permission to resolve a dispute
 */
export const useDisputePermissions = (dispute?: Dispute, userId?: string) => {
  if (!dispute || !userId) {
    return {
      canResolve: false,
      canCancel: false,
      canAddEvidence: false,
    };
  }

  const isAdmin = false;
  const disputeResolver = false;
  const isParticipant = userId === dispute.initiatedBy || 
    (dispute.escrow?.clientId === userId || dispute.escrow?.freelancerId === userId);

  return {
    canResolve: isAdmin || disputeResolver,
    canCancel: isAdmin || (isParticipant && dispute.status === DisputeStatus.PENDING),
    canAddEvidence: isParticipant && 
      (dispute.status === DisputeStatus.PENDING || dispute.status === DisputeStatus.IN_REVIEW),
  };
};