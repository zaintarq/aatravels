"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/components/auth/auth-provider";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signUp(username, email, password);
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not create account";
      setError(message.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "").trim() || "Registration failed");
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
          <h1 className="mt-6 font-display text-3xl font-semibold text-ink-900 dark:text-white">Create your account</h1>
          <p className="mt-2 text-sm text-ink-400 dark:text-white/60">
            Choose a username — it will show on your hotel reviews.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-ink-900/10 bg-white/90 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-ink-800/90"
        >
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              required
              minLength={3}
              maxLength={32}
              pattern="[A-Za-z0-9_]+"
              title="Letters, numbers and underscores only"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
            />
          </div>
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
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          {error && <p className="text-sm text-maroon-500">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400 dark:text-white/60">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-maroon-500 hover:text-maroon-600 dark:text-maroon-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
