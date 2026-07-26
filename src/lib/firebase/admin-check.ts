import { verifyFirebaseIdToken } from "@/lib/firebase/verify-token";
import { firebasePublicConfig } from "@/lib/firebase/public-config";
import { isAdminFlag } from "@/lib/firebase/is-admin";

export type FirestoreUserProfile = {
  uid: string;
  email?: string;
  username?: string;
  isAdmin?: boolean | string | number;
};

export { parseIsAdmin, isAdminFlag } from "@/lib/firebase/is-admin";

function parseFirestoreFields(fields: Record<string, Record<string, unknown>> | undefined) {
  const getString = (key: string) => {
    const v = fields?.[key]?.stringValue;
    return typeof v === "string" ? v : undefined;
  };
  const getAdminRaw = (key: string): unknown => {
    const field = fields?.[key];
    if (!field) return undefined;
    if (typeof field.booleanValue === "boolean") return field.booleanValue;
    if (typeof field.stringValue === "string") return field.stringValue;
    if (typeof field.integerValue === "string") return Number(field.integerValue);
    if (typeof field.doubleValue === "number") return field.doubleValue;
    return undefined;
  };
  return { getString, getAdminRaw };
}

/** Read a Firestore user doc using the caller's Firebase ID token. */
export async function getUserProfileWithToken(
  uid: string,
  idToken: string
): Promise<FirestoreUserProfile | null> {
  const projectId = firebasePublicConfig.projectId;
  const apiKey = firebasePublicConfig.apiKey;
  if (!projectId) return null;

  const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`;
  const url = apiKey ? `${base}?key=${encodeURIComponent(apiKey)}` : base;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = (await res.json()) as {
    fields?: Record<string, Record<string, unknown>>;
  };

  const { getString, getAdminRaw } = parseFirestoreFields(data.fields);

  return {
    uid,
    email: getString("email"),
    username: getString("username"),
    isAdmin: getAdminRaw("isAdmin") as boolean | string | number | undefined,
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
    email: verified.email || profile.email || "",
    username: profile.username || verified.email.split("@")[0] || "admin",
    idToken: token,
  };
}
