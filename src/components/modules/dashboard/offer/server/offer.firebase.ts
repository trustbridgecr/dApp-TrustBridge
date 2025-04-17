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

import type { ApprovedLoan } from "../../marketplace/store/marketplace";

interface AddLoanOfferProps {
  payload: ApprovedLoan;
  lenderWallet: string;
}

const addLoanOffer = async ({
  payload,
  lenderWallet,
}: AddLoanOfferProps): Promise<{
  success: boolean;
  message: string;
  data?: { id: string } & ApprovedLoan;
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
      data: {
        id: docRef.id,
        ...(createdDoc.data() as Omit<ApprovedLoan, "id">),
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create loan offer",
    };
  }
};

const getAllLoanOffers = async ({
  status = "pending",
}: {
  status?: string;
}): Promise<{
  success: boolean;
  data?: ({ id: string } & ApprovedLoan)[];
  message?: string;
}> => {
  try {
    const ref = collection(db, "loan_offers");
    const q = query(ref, where("status", "==", status));
    const snapshot = await getDocs(q);

    const offers = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...(doc.data() as Omit<ApprovedLoan, "id">),
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

export { addLoanOffer, getAllLoanOffers, approveLoanOffer };
