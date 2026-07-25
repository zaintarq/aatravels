export type VerifiedFirebaseUser = {
  uid: string;
  email: string;
};

/** Verify a Firebase ID token via Identity Toolkit (no Admin SDK required). */
export async function verifyFirebaseIdToken(idToken: string): Promise<VerifiedFirebaseUser | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey || !idToken) return null;

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
  if (!user?.localId || !user.email) return null;

  return { uid: user.localId, email: user.email };
}
