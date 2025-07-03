// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Temporarily disable Firebase to prevent connection errors during development
// TODO: Re-enable when ready to use Firebase features
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

// Mock Firebase db object to prevent errors - proper Firestore API mock
export const db = {} as any;

// Mock doc function that returns proper Firestore document reference
export const doc = (db: any, collection: string, id: string) => ({
  path: `${collection}/${id}`,
  id,
  collection,
});

// Mock getDoc function
export const getDoc = async (docRef: any) => ({
  exists: () => false,
  data: () => ({}),
});

// Mock setDoc function  
export const setDoc = async (docRef: any, data: any) => {
  console.log("Mock setDoc called:", { docRef, data });
  return Promise.resolve();
};
