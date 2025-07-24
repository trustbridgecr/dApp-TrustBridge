// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (() => { throw new Error('NEXT_PUBLIC_FIREBASE_API_KEY is required') })(),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || (() => { throw new Error('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is required') })(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || (() => { throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is required') })(),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (() => { throw new Error('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is required') })(),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || (() => { throw new Error('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is required') })(),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || (() => { throw new Error('NEXT_PUBLIC_FIREBASE_APP_ID is required') })(),
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { doc, getDoc, setDoc };

