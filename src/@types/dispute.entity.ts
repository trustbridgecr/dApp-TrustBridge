import { Escrow } from './escrow.entity';
import { User } from './user.entity';

export enum DisputeStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  RESOLVED = 'resolved',
  CANCELLED = 'cancelled'
}

export enum DisputeResolution {
  FAVOR_CLIENT = 'favor_client',
  FAVOR_FREELANCER = 'favor_freelancer',
  SPLIT = 'split',
  NO_RESOLUTION = 'no_resolution'
}

export interface DisputeEvent {
  id: string;
  disputeId: string;
  timestamp: number;
  eventType: 'created' | 'updated' | 'resolved' | 'message' | 'evidence_added';
  performedBy: string; // User ID
  details: Record<string, unknown>;
}

export interface Dispute {
  id: string;
  escrowId: string;
  escrow?: Escrow;
  initiatedBy: string; // User ID
  initiator?: User;
  respondent?: User;
  reason: string;
  status: DisputeStatus;
  resolution?: DisputeResolution;
  evidenceUrls?: string[];
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
  events: DisputeEvent[];
  signature?: string;
}

export interface DisputeCreationPayload {
  escrowId: string;
  disputeReason: string;
  signature: string;
}

export interface DisputeResolutionPayload {
  disputeId: string;
  resolution: DisputeResolution;
  details?: string;
  signature: string;
}