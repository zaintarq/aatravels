import { createRemoteJWKSet, jwtVerify } from "jose";
import { firebasePublicConfig } from "@/lib/firebase/public-config";

export type VerifiedFirebaseUser = {
  uid: string;
  email: string;
};

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(
      new URL(
        "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
      )
    );
  }
  return jwks;
}

async function verifyWithJwks(idToken: string): Promise<VerifiedFirebaseUser | null> {
  const projectId = firebasePublicConfig.projectId;
  if (!projectId) return null;

  const { payload } = await jwtVerify(idToken, getJwks(), {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
    clockTolerance: 60,
  });

  const uid =
    typeof payload.user_id === "string"
      ? payload.user_id
      : typeof payload.sub === "string"
        ? payload.sub
        : "";
  const email = typeof payload.email === "string" ? payload.email : "";
  if (!uid) return null;
  return { uid, email: email || `${uid}@users.firebase` };
}

async function verifyWithIdentityToolkit(idToken: string): Promise<VerifiedFirebaseUser | null> {
  const apiKey = firebasePublicConfig.apiKey;
  if (!apiKey) return null;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );
  if (!res.ok) return null;

  const data = (await res.json()) as {
    users?: Array<{ localId: string; email?: string }>;
  };
  const user = data.users?.[0];
  if (!user?.localId) return null;
  return { uid: user.localId, email: user.email || `${user.localId}@users.firebase` };
}

/** Verify Firebase ID token (JWKS first, Identity Toolkit fallback). */
export async function verifyFirebaseIdToken(idToken: string): Promise<VerifiedFirebaseUser | null> {
  if (!idToken) return null;

  try {
    const viaJwks = await verifyWithJwks(idToken);
    if (viaJwks) return viaJwks;
  } catch {
    // fall through
  }

  try {
    return await verifyWithIdentityToolkit(idToken);
  } catch {
    return null;
  }
}
