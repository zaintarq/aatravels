"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getClientAuth, getClientDb, isFirebaseConfigured } from "@/lib/firebase/client";
import { parseIsAdmin } from "@/lib/firebase/is-admin";

export type AuthUser = {
  uid: string;
  email: string;
  username: string;
  isAdmin: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signUp: (username: string, email: string, password: string, asAdmin?: boolean) => Promise<AuthUser>;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function allowAdminBootstrap(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_ADMIN_SIGNUP === "true";
}

function deriveUsername(firebaseUser: User): string {
  const fromDisplay = firebaseUser.displayName?.trim().toLowerCase().replace(/\s+/g, "") || "";
  if (fromDisplay.length >= 3) return fromDisplay;
  const fromEmail =
    firebaseUser.email?.split("@")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
  if (fromEmail.length >= 3) return fromEmail;
  return `user${firebaseUser.uid.slice(0, 8)}`;
}

async function ensureUserDocument(
  firebaseUser: User,
  options: { asAdmin?: boolean; createIfMissing?: boolean } = {}
): Promise<{ username: string; isAdmin: boolean }> {
  const db = getClientDb();
  const uid = firebaseUser.uid;
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data() as { username?: string; isAdmin?: unknown };
    return {
      username: data.username || deriveUsername(firebaseUser),
      isAdmin: parseIsAdmin(data.isAdmin),
    };
  }

  const shouldCreate =
    options.createIfMissing ?? (options.asAdmin === true || allowAdminBootstrap());
  if (!shouldCreate) {
    return {
      username: firebaseUser.displayName || deriveUsername(firebaseUser),
      isAdmin: false,
    };
  }

  const asAdmin = options.asAdmin ?? allowAdminBootstrap();
  const username = deriveUsername(firebaseUser);

  await setDoc(userRef, {
    uid,
    username,
    email: (firebaseUser.email || "").toLowerCase(),
    isAdmin: asAdmin,
    createdAt: new Date().toISOString(),
  });

  const usernameRef = doc(db, "usernames", username);
  const usernameSnap = await getDoc(usernameRef);
  if (!usernameSnap.exists()) {
    await setDoc(usernameRef, { uid }).catch(() => undefined);
  }

  return { username, isAdmin: asAdmin };
}

function formatFirestoreError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("permission-denied") || message.includes("Missing or insufficient permissions")) {
    return "Firestore blocked the write. Create the Firestore database and publish firestore.rules from the repo, then sign in again.";
  }
  if (message.includes("not-found") || message.includes("Cloud Firestore API has not been used")) {
    return "Firestore is not set up yet. In Firebase Console go to Firestore Database and click Create database, then sign in again.";
  }
  return message.replace("Firebase: ", "").trim();
}

async function fetchProfile(firebaseUser: User) {
  const snap = await getDoc(doc(getClientDb(), "users", firebaseUser.uid));
  if (snap.exists()) {
    const data = snap.data() as { username?: string; isAdmin?: unknown };
    return {
      username: data.username || deriveUsername(firebaseUser),
      isAdmin: parseIsAdmin(data.isAdmin),
    };
  }

  if (!allowAdminBootstrap()) {
    return {
      username: firebaseUser.displayName || deriveUsername(firebaseUser),
      isAdmin: false,
    };
  }

  try {
    return await ensureUserDocument(firebaseUser, {
      createIfMissing: true,
      asAdmin: true,
    });
  } catch (err) {
    throw new Error(formatFirestoreError(err));
  }
}

async function syncAdminSession(idToken: string, isAdmin: boolean): Promise<boolean> {
  if (!isAdmin) {
    await fetch("/api/auth/admin-session", {
      method: "DELETE",
      credentials: "include",
    }).catch(() => undefined);
    return false;
  }

  const res = await fetch("/api/auth/admin-session", {
    method: "POST",
    credentials: "include",
    headers: { Authorization: `Bearer ${idToken}` },
  });

  return res.ok;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const applyUser = useCallback(async (firebaseUser: User) => {
    const profile = await fetchProfile(firebaseUser);
    const idToken = await firebaseUser.getIdToken(true);

    // Best-effort cookie for /api/admin — do NOT block staff login if this fails.
    // Dashboard access is gated by Firestore isAdmin on the client + security rules.
    if (profile.isAdmin) {
      await syncAdminSession(idToken, true).catch(() => false);
    } else {
      await syncAdminSession(idToken, false).catch(() => false);
    }

    const nextUser: AuthUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      username: profile.username,
      isAdmin: profile.isAdmin,
    };
    setUser(nextUser);
    return nextUser;
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    const auth = getClientAuth();
    const unsub = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        await fetch("/api/auth/admin-session", {
          method: "DELETE",
          credentials: "include",
        }).catch(() => undefined);
        return;
      }

      try {
        await applyUser(firebaseUser);
      } catch {
        try {
          const profile = await fetchProfile(firebaseUser);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            username: profile.username,
            isAdmin: profile.isAdmin,
          });
        } catch {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            username: firebaseUser.displayName || "Traveller",
            isAdmin: false,
          });
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [applyUser]);

  const signUp = useCallback(async (username: string, email: string, password: string, asAdmin = false) => {
    const cleaned = username.trim().toLowerCase().replace(/\s+/g, "");
    if (cleaned.length < 3) throw new Error("Username must be at least 3 characters");

    const db = getClientDb();
    const auth = getClientAuth();
    const usernameRef = doc(db, "usernames", cleaned);
    const existing = await getDoc(usernameRef);
    if (existing.exists()) throw new Error("Username is already taken");

    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await updateProfile(cred.user, { displayName: cleaned });

    let profile: { username: string; isAdmin: boolean };
    try {
      profile = await ensureUserDocument(cred.user, { asAdmin: true, createIfMissing: true });
    } catch (err) {
      throw new Error(formatFirestoreError(err));
    }

    if (profile.isAdmin) {
      const idToken = await cred.user.getIdToken(true);
      await syncAdminSession(idToken, true).catch(() => false);
    }

    const nextUser: AuthUser = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      username: profile.username,
      isAdmin: profile.isAdmin,
    };
    setUser(nextUser);
    return nextUser;
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const auth = getClientAuth();
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      return applyUser(cred.user);
    },
    [applyUser]
  );

  const signOut = useCallback(async () => {
    await fetch("/api/auth/admin-session", {
      method: "DELETE",
      credentials: "include",
    }).catch(() => undefined);
    await firebaseSignOut(getClientAuth());
    setUser(null);
  }, []);

  const getIdToken = useCallback(async () => {
    const current = getClientAuth().currentUser;
    if (!current) return null;
    return current.getIdToken();
  }, []);

  const refreshProfile = useCallback(async () => {
    const current = getClientAuth().currentUser;
    if (!current) return;
    await applyUser(current);
  }, [applyUser]);

  const value = useMemo(
    () => ({ user, loading, signUp, signIn, signOut, getIdToken, refreshProfile }),
    [user, loading, signUp, signIn, signOut, getIdToken, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
