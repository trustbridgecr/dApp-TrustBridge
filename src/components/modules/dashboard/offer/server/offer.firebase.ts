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
} from "firebase/firestore";

interface AddLoanOfferProps {
  payload: any;
  lenderWallet: string;
}

const addLoanOffer = async ({
  payload,
  lenderWallet,
}: AddLoanOfferProps): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const ref = collection(db, "loan_offers");

    const docRef: DocumentReference = await addDoc(ref, {
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
      data: { id: docRef.id, ...createdDoc.data() },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create loan offer",
    };
  }
};

const getAllLoanOffers = async ({
  status = "pending",
}: {
  status?: string;
}): Promise<{
  success: boolean;
  data?: any[];
  message?: string;
}> => {
  try {
    const ref = collection(db, "loan_offers");
    const q = query(ref, where("status", "==", status));

    const snapshot = await getDocs(q);

    const offers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      data: offers,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error retrieving loan offers",
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
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to approve loan offer",
    };
  }
};

export { addLoanOffer, getAllLoanOffers, approveLoanOffer };
