"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/components/auth/auth-provider";

export default function LoginPage() {
  const { signIn, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    if (next?.startsWith("/admin")) {
      if (user.isAdmin) router.replace(next);
      return;
    }
    if (user.isAdmin && next) {
      router.replace(next);
    }
  }, [authLoading, user, next, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      // Destination resolved after auth state updates; also handle immediately via profile
      const { auth, db } = await import("@/lib/firebase/client");
      const { doc, getDoc } = await import("firebase/firestore");
      const uid = auth.currentUser?.uid;
      let isAdmin = false;
      if (uid) {
        const snap = await getDoc(doc(db, "users", uid));
        const raw = snap.data()?.isAdmin;
        isAdmin =
          raw === true ||
          (typeof raw === "string" && ["yes", "true", "1"].includes(raw.toLowerCase()));
      }

      if (next?.startsWith("/admin") && !isAdmin) {
        setError("This account is not staff. Ask an owner to set isAdmin to yes in Firestore.");
        return;
      }

      if (next) {
        router.push(isAdmin || !next.startsWith("/admin") ? next : "/");
      } else if (isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not sign in";
      setError(
        message.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "").trim() ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-maroon-50 via-white to-ink-50 dark:from-ink-900 dark:via-ink-900 dark:to-maroon-950" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/images/aa-travel-group-logo.png"
            alt="AA Travel Group"
            width={120}
            height={120}
            className="h-16 w-auto object-contain"
          />
          <h1 className="mt-6 font-display text-3xl font-semibold text-ink-900 dark:text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-400 dark:text-white/60">
            Sign in with your email. Staff accounts use the same login once{" "}
            <code className="text-xs">isAdmin</code> is set in Firestore.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-ink-900/10 bg-white/90 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-ink-800/90"
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-maroon-500">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400 dark:text-white/60">
          New here?{" "}
          <Link href="/register" className="font-medium text-maroon-500 hover:text-maroon-600 dark:text-maroon-300">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
