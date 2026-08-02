import type { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import { parseIsAdmin } from "@/lib/firebase/is-admin";

/** Temporary — remove when public signup is disabled. */
export function isAdminBootstrapEnabled(): boolean {
  return true;
}

export function deriveUsername(firebaseUser: User, preferred?: string): string {
  const cleaned = preferred?.trim().toLowerCase().replace(/\s+/g, "") || "";
  if (cleaned.length >= 3) return cleaned;

  const fromDisplay = firebaseUser.displayName?.trim().toLowerCase().replace(/\s+/g, "") || "";
  if (fromDisplay.length >= 3) return fromDisplay;

  const fromEmail =
    firebaseUser.email?.split("@")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
  if (fromEmail.length >= 3) return fromEmail;

  return `user${firebaseUser.uid.slice(0, 8)}`;
}

export function formatFirestoreError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("permission-denied") || message.includes("Missing or insufficient permissions")) {
    return "Firestore blocked this. In Firebase Console: create Firestore, paste firestore.rules from the repo, and Publish.";
  }
  if (message.includes("not-found") || message.includes("Cloud Firestore API has not been used")) {
    return "Firestore is not enabled. Firebase Console → Firestore Database → Create database.";
  }
  return message.replace("Firebase: ", "").trim();
}

export type UserProfile = {
  username: string;
  isAdmin: boolean;
  exists: boolean;
};

/** Read profile from Firestore — never guesses admin status. */
export async function readUserProfile(firebaseUser: User): Promise<UserProfile> {
  const snap = await getDoc(doc(getClientDb(), "users", firebaseUser.uid));
  if (!snap.exists()) {
    return {
      username: deriveUsername(firebaseUser),
      isAdmin: false,
      exists: false,
    };
  }
  const data = snap.data() as { username?: string; isAdmin?: unknown };
  return {
    username: data.username || deriveUsername(firebaseUser),
    isAdmin: parseIsAdmin(data.isAdmin),
    exists: true,
  };
}

/** Create users/{uid} in Firestore. Throws if write fails or doc missing after write. */
export async function writeUserProfile(
  firebaseUser: User,
  options: { asAdmin?: boolean; username?: string } = {}
): Promise<UserProfile> {
  const uid = firebaseUser.uid;
  const username = deriveUsername(firebaseUser, options.username);
  const asAdmin = options.asAdmin ?? isAdminBootstrapEnabled();

  await setDoc(doc(getClientDb(), "users", uid), {
    uid,
    username,
    email: (firebaseUser.email || "").toLowerCase(),
    isAdmin: asAdmin,
    createdAt: new Date().toISOString(),
  });

  const usernameRef = doc(getClientDb(), "usernames", username);
  const usernameSnap = await getDoc(usernameRef);
  if (!usernameSnap.exists()) {
    await setDoc(usernameRef, { uid }).catch(() => undefined);
  }

  const verified = await readUserProfile(firebaseUser);
  if (!verified.exists) {
    throw new Error("Profile write did not save. Publish firestore.rules in Firebase Console.");
  }
  return verified;
}

/** Read profile, or create it during temporary admin setup. */
export async function ensureUserProfile(
  firebaseUser: User,
  options: { asAdmin?: boolean; username?: string; createIfMissing?: boolean } = {}
): Promise<UserProfile> {
  const existing = await readUserProfile(firebaseUser);
  const wantsAdmin = options.asAdmin === true || isAdminBootstrapEnabled();

  if (existing.exists) {
    if (existing.isAdmin || !wantsAdmin) return existing;

    // Temporary bootstrap: upgrade existing profile to admin
    try {
      await setDoc(
        doc(getClientDb(), "users", firebaseUser.uid),
        { isAdmin: true },
        { merge: true }
      );
      return readUserProfile(firebaseUser);
    } catch (err) {
      throw new Error(formatFirestoreError(err));
    }
  }

  const shouldCreate =
    options.createIfMissing ?? (options.asAdmin === true || isAdminBootstrapEnabled());
  if (!shouldCreate) return existing;

  try {
    return await writeUserProfile(firebaseUser, { ...options, asAdmin: wantsAdmin });
  } catch (err) {
    throw new Error(formatFirestoreError(err));
  }
}
