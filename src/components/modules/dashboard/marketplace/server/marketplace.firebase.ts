"use server";

import { db } from "@/core/config/firebase/firebase";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
  DocumentReference,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

interface LoanOffer {
  borrower: string;
  amount: number;
  title: string;
  maxAmount: number;
  platformFee: number;
  platformAddress: string;
  approver: string;
  disputeResolver: string;
  releaseSigner: string;
  submittedBy?: {
    name?: string;
    email?: string;
    address?: string;
  };
  milestones?: {
    description: string;
  }[];
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
  updatedAt?: {
    seconds: number;
    nanoseconds: number;
  };
  status?: string;
  lenderWallet?: string;
  description?: string;
}

interface AddLoanOfferProps {
  payload: LoanOffer;
  lenderWallet: string;
}

const addLoanOffer = async ({
  payload,
  lenderWallet,
}: AddLoanOfferProps): Promise<{
  success: boolean;
  message: string;
  data?: { id: string } & LoanOffer;
}> => {
  try {
    const ref = collection(db, "loan_offers");

    const docRef: DocumentReference<DocumentData> = await addDoc(ref, {
      ...payload,
      lenderWallet,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const createdDoc = await getDoc(docRef);

    return {
      success: true,
      message: "Loan offer created successfully",
      data: { id: docRef.id, ...(createdDoc.data() as LoanOffer) },
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create loan offer",
    };
  }
};

const getLoanOffersByStatus = async ({
  status = "pending",
}: {
  status?: string;
}): Promise<{
  success: boolean;
  data?: ({ id: string } & LoanOffer)[];
  message?: string;
}> => {
  try {
    const ref = collection(db, "loan_offers");
    const q = query(ref, where("status", "==", status));

    const snapshot = await getDocs(q);

    const offers = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...(doc.data() as LoanOffer),
    }));

    return {
      success: true,
      data: offers,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error retrieving loan offers",
    };
  }
};

const getApprovedLoanOffers = async (): Promise<{
  success: boolean;
  data?: ({ id: string } & LoanOffer)[];
  message?: string;
}> => getLoanOffersByStatus({ status: "approved" });

const approveLoanOffer = async ({
  offerId,
}: {
  offerId: string;
}): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const offerRef = doc(db, "loan_offers", offerId);

    await updateDoc(offerRef, {
      status: "approved",
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: `Loan offer ${offerId} approved successfully`,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to approve loan offer",
    };
  }
};

export {
  addLoanOffer,
  getLoanOffersByStatus,
  getApprovedLoanOffers,
  approveLoanOffer,
};
