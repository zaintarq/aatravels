"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/components/auth/auth-provider";

export default function LoginPage() {
  const { signIn, user, loading: authLoading, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    if (user.isAdmin) {
      router.replace(next?.startsWith("/admin") ? next : next || "/admin/dashboard");
      return;
    }
    if (next && !next.startsWith("/admin")) {
      router.replace(next);
    }
  }, [authLoading, user, next, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      // Ensure latest Firestore isAdmin + cookie after console edits
      await refreshProfile();
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
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-400 dark:text-white/60">
            Sign in with your email. Staff: set <code className="text-xs">isAdmin</code> to{" "}
            <strong>true</strong> (boolean) on your user doc in Firestore, then sign in again.
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
          <p className="text-center text-sm text-ink-400 dark:text-white/60">
            Need an admin account?{" "}
            <Link href="/register" className="font-medium text-maroon-500 hover:underline">
              Sign up
            </Link>
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400 dark:text-white/60">
          After setting isAdmin, sign out and sign in again to open Hotels &amp; Packages.
        </p>
      </div>
    </div>
  );
}
