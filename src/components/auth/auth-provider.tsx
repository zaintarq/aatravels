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

export type AuthUser = {
  uid: string;
  email: string;
  username: string;
  isAdmin: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function parseIsAdmin(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "yes" || v === "true" || v === "1";
  }
  return false;
}

async function fetchProfile(uid: string, fallbackName?: string | null) {
  const snap = await getDoc(doc(getClientDb(), "users", uid));
  if (snap.exists()) {
    const data = snap.data() as { username?: string; isAdmin?: unknown };
    return {
      username: data.username || fallbackName || "Traveller",
      isAdmin: parseIsAdmin(data.isAdmin),
    };
  }
  return {
    username: fallbackName || "Traveller",
    isAdmin: false,
  };
}

async function syncAdminSession(idToken: string, isAdmin: boolean) {
  if (isAdmin) {
    await fetch("/api/auth/admin-session", {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}` },
    });
  } else {
    await fetch("/api/auth/admin-session", { method: "DELETE" }).catch(() => undefined);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

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
        await fetch("/api/auth/admin-session", { method: "DELETE" }).catch(() => undefined);
        return;
      }

      try {
        const profile = await fetchProfile(firebaseUser.uid, firebaseUser.displayName);
        const idToken = await firebaseUser.getIdToken();
        await syncAdminSession(idToken, profile.isAdmin);

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
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const signUp = useCallback(async (username: string, email: string, password: string) => {
    const cleaned = username.trim().toLowerCase().replace(/\s+/g, "");
    if (cleaned.length < 3) throw new Error("Username must be at least 3 characters");

    const db = getClientDb();
    const auth = getClientAuth();
    const usernameRef = doc(db, "usernames", cleaned);
    const existing = await getDoc(usernameRef);
    if (existing.exists()) throw new Error("Username is already taken");

    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await updateProfile(cred.user, { displayName: cleaned });

    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      username: cleaned,
      email: email.trim().toLowerCase(),
      isAdmin: false,
      createdAt: new Date().toISOString(),
    });
    await setDoc(usernameRef, { uid: cred.user.uid });

    setUser({
      uid: cred.user.uid,
      email: cred.user.email || email,
      username: cleaned,
      isAdmin: false,
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const auth = getClientAuth();
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const profile = await fetchProfile(cred.user.uid, cred.user.displayName);
    const idToken = await cred.user.getIdToken();
    await syncAdminSession(idToken, profile.isAdmin);

    setUser({
      uid: cred.user.uid,
      email: cred.user.email || email,
      username: profile.username,
      isAdmin: profile.isAdmin,
    });
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/admin-session", { method: "DELETE" }).catch(() => undefined);
    await firebaseSignOut(getClientAuth());
    setUser(null);
  }, []);

  const getIdToken = useCallback(async () => {
    const current = getClientAuth().currentUser;
    if (!current) return null;
    return current.getIdToken();
  }, []);

  const value = useMemo(
    () => ({ user, loading, signUp, signIn, signOut, getIdToken }),
    [user, loading, signUp, signIn, signOut, getIdToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
