/**
 * Firebase web app config (safe to ship in the client bundle).
 * Override with NEXT_PUBLIC_FIREBASE_* env vars when needed.
 */
export const firebasePublicConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyAnqUAyLP7B0YNS9pmHQCCDc8dI79yQskM",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "aatravels-ef4bc.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "aatravels-ef4bc",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "aatravels-ef4bc.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1034303219280",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:1034303219280:web:29fced1abb4ca5ff551355",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-WSWXLPLQP0",
} as const;
