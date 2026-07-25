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
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

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
    const profile = await fetchProfile(firebaseUser.uid, firebaseUser.displayName);
    const idToken = await firebaseUser.getIdToken(true);
    const sessionOk = await syncAdminSession(idToken, profile.isAdmin);

    if (profile.isAdmin && !sessionOk) {
      // Retry once — first request can race with token propagation
      const retryToken = await firebaseUser.getIdToken(true);
      const retryOk = await syncAdminSession(retryToken, true);
      if (!retryOk) {
        throw new Error(
          "Staff profile found, but admin session failed. Confirm Firestore users/{uid}.isAdmin is true, then sign in again."
        );
      }
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
        // Keep signed-in for browsing; admin cookie may be missing
        try {
          const profile = await fetchProfile(firebaseUser.uid, firebaseUser.displayName);
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

  const signIn = useCallback(
    async (email: string, password: string) => {
      const auth = getClientAuth();
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      await applyUser(cred.user);
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
