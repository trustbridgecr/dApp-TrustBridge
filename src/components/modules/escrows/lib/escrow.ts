import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { Escrow } from "@trustless-work/escrow/types";
import { EscrowRecord } from "@/@types/escrow.entity";

const convertTimestamp = (timestamp: Timestamp | Date | number): number => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toMillis();
  }
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }
  if (typeof timestamp === "number") {
    return timestamp;
  }
  return Date.now();
};

export const saveEscrow = async (escrow: Escrow, createdBy: string) => {
  const escrowRef = doc(db, "escrows", escrow.contractId);
  const data: EscrowRecord = {
    escrowId: escrow.contractId,
    createdBy,
    signer: escrow.signer,
    engagementId: escrow.engagementId,
    title: escrow.title,
    description: escrow.description,
    amount: escrow.amount,
    platformFee: escrow.platformFee,
    receiverMemo: escrow.receiverMemo,
    roles: escrow.roles,
    trustline: escrow.trustline,
    milestones: escrow.milestones,
    createdAt: serverTimestamp(),
  };
  await setDoc(escrowRef, data);
};

export const getEscrowsForWallet = async (
  walletAddress: string,
): Promise<EscrowRecord[]> => {
  if (!walletAddress) return [];

  const escrowsCol = collection(db, "escrows");
  const queries = [
    query(escrowsCol, where("createdBy", "==", walletAddress)),
    query(escrowsCol, where("signer", "==", walletAddress)),
    query(escrowsCol, where("roles.approver", "==", walletAddress)),
    query(escrowsCol, where("roles.serviceProvider", "==", walletAddress)),
    query(escrowsCol, where("roles.platformAddress", "==", walletAddress)),
    query(escrowsCol, where("roles.releaseSigner", "==", walletAddress)),
    query(escrowsCol, where("roles.disputeResolver", "==", walletAddress)),
    query(escrowsCol, where("roles.receiver", "==", walletAddress)),
  ];

  const snapshots = await Promise.all(queries.map(getDocs));
  const docs = snapshots.flatMap((snap) =>
    snap.docs.map((d) => {
      const data = d.data() as EscrowRecord;
      return { ...data, createdAt: convertTimestamp(data.createdAt) };
    }),
  );
  const unique = new Map<string, EscrowRecord>();
  docs.forEach((doc) => unique.set(doc.escrowId, doc));
  return Array.from(unique.values());
};
