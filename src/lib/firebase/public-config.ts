/**
 * Firebase web app config (safe to ship in the client bundle).
 * Override with NEXT_PUBLIC_FIREBASE_* env vars when needed.
 */
export const firebasePublicConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyD0CyoJxPXWfdcZAttQxqIYOiYW1GXdsIU",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "aa-travel-group.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "aa-travel-group",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "aa-travel-group.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "675109603461",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:675109603461:web:4727711ec63665848801ec",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XE6GYX8QQR",
} as const;
