import { verifyFirebaseIdToken } from "@/lib/firebase/verify-token";
import { firebasePublicConfig } from "@/lib/firebase/public-config";

export type FirestoreUserProfile = {
  uid: string;
  email?: string;
  username?: string;
  isAdmin?: boolean | string;
};

function parseIsAdmin(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "yes" || v === "true" || v === "1";
  }
  return false;
}

export function isAdminFlag(value: unknown): boolean {
  return parseIsAdmin(value);
}

/** Read a Firestore user doc using the caller's Firebase ID token (respects security rules). */
export async function getUserProfileWithToken(
  uid: string,
  idToken: string
): Promise<FirestoreUserProfile | null> {
  const projectId = firebasePublicConfig.projectId;
  if (!projectId) return null;

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${idToken}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = (await res.json()) as {
    fields?: Record<string, { stringValue?: string; booleanValue?: boolean; integerValue?: string }>;
  };

  const fields = data.fields || {};
  const getString = (key: string) => fields[key]?.stringValue;
  const getBoolOrString = (key: string) => {
    if (typeof fields[key]?.booleanValue === "boolean") return fields[key]?.booleanValue;
    if (fields[key]?.stringValue !== undefined) return fields[key]?.stringValue;
    return undefined;
  };

  return {
    uid,
    email: getString("email"),
    username: getString("username"),
    isAdmin: getBoolOrString("isAdmin") as boolean | string | undefined,
  };
}

export async function resolveAdminFromBearer(authHeader: string | null) {
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return null;

  const verified = await verifyFirebaseIdToken(token);
  if (!verified) return null;

  const profile = await getUserProfileWithToken(verified.uid, token);
  if (!profile || !isAdminFlag(profile.isAdmin)) return null;

  return {
    uid: verified.uid,
    email: verified.email,
    username: profile.username || verified.email.split("@")[0],
    idToken: token,
  };
}
