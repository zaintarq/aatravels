"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientAuth } from "@/lib/firebase/client";
import { ensureUserProfile, type UserProfile } from "@/lib/firebase/ensure-profile";
import { useAuth } from "@/components/auth/auth-provider";

type AdminAccessState = {
  ready: boolean;
  profile: UserProfile | null;
  error: string;
  retry: () => void;
};

/** Ensures Firestore admin profile exists before admin pages load data. */
export function useAdminAccess(nextPath: string): AdminAccessState {
  const { user, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    let cancelled = false;

    async function run() {
      setReady(false);
      setError("");
      try {
        const firebaseUser = getClientAuth().currentUser;
        if (!firebaseUser) {
          router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
          return;
        }

        const result = await ensureUserProfile(firebaseUser, {
          createIfMissing: true,
          asAdmin: true,
          username: user?.username,
        });

        if (cancelled) return;

        if (!result.isAdmin) {
          setError("Your Firestore profile exists but isAdmin is not true. Contact support or republish rules.");
          setProfile(result);
          setReady(false);
          return;
        }

        await refreshProfile();
        setProfile(result);
        setReady(true);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Could not verify admin profile");
        setReady(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [loading, user, router, nextPath, refreshProfile, attempt]);

  return {
    ready,
    profile,
    error,
    retry: () => setAttempt((n) => n + 1),
  };
}
