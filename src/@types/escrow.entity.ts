import { Escrow } from "@trustless-work/escrow/types";

export interface EscrowRecord {
  escrowId: string;
  createdBy: string;
  signer: string;
  engagementId: string;
  title: string;
  description: string;
  amount: string;
  platformFee: string;
  receiverMemo: number;
  roles: Escrow["roles"];
  trustline: Escrow["trustline"];
  milestones: Escrow["milestones"];
  createdAt: number | unknown;
}
