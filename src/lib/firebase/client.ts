import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebasePublicConfig } from "@/lib/firebase/public-config";

export function isFirebaseConfigured(): boolean {
  return Boolean(firebasePublicConfig.apiKey?.trim());
}

function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured.");
  }
  if (getApps().length) return getApp();
  return initializeApp({ ...firebasePublicConfig });
}

let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

/** Lazy Auth — do not call during SSR/module import. */
export function getClientAuth(): Auth {
  if (!authInstance) authInstance = getAuth(getFirebaseApp());
  return authInstance;
}

/** Lazy Firestore — do not call during SSR/module import. */
export function getClientDb(): Firestore {
  if (!dbInstance) dbInstance = getFirestore(getFirebaseApp());
  return dbInstance;
}
