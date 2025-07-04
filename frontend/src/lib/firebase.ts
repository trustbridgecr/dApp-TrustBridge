// lib/firebase.ts
// Temporarily disable Firebase to prevent connection errors during development
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// // const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// Temporarily disable Firebase to prevent connection errors during development
// TODO: Re-enable when ready to use Firebase features
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

interface MockFirestoreDb {
  [key: string]: unknown;
}

interface MockDocRef {
  path: string;
  id: string;
  collection: string;
}

interface MockDocSnapshot {
  exists: () => boolean;
  data: () => Record<string, unknown>;
}

// Mock Firebase db object to prevent errors - proper Firestore API mock
export const db: MockFirestoreDb = {};

// Mock doc function that returns proper Firestore document reference
export const doc = (_db: unknown, collection: string, id: string): MockDocRef => ({
  path: `${collection}/${id}`,
  id,
  collection,
});

// Mock getDoc function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getDoc = async (_docRef: MockDocRef): Promise<MockDocSnapshot> => ({
  exists: () => false,
  data: () => ({}),
});

// Mock setDoc function  
export const setDoc = async (docRef: MockDocRef, data: unknown): Promise<void> => {
  console.log("Mock setDoc called:", { docRef, data });
  return Promise.resolve();
};
