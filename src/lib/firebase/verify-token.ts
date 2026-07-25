import { createRemoteJWKSet, jwtVerify } from "jose";
import { firebasePublicConfig } from "@/lib/firebase/public-config";

export type VerifiedFirebaseUser = {
  uid: string;
  email: string;
};

const jwks = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

/**
 * Verify a Firebase ID token with Google's JWKS (works on Cloudflare Edge).
 * Avoids Identity Toolkit + API-key referrer restrictions that break admin login.
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<VerifiedFirebaseUser | null> {
  if (!idToken) return null;

  const projectId = firebasePublicConfig.projectId;
  if (!projectId) return null;

  try {
    const { payload } = await jwtVerify(idToken, jwks, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    const uid = typeof payload.user_id === "string" ? payload.user_id : typeof payload.sub === "string" ? payload.sub : "";
    const email = typeof payload.email === "string" ? payload.email : "";
    if (!uid) return null;

    return { uid, email: email || `${uid}@users.firebase` };
  } catch {
    return null;
  }
}
