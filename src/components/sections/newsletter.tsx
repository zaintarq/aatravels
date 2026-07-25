"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase/client";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const cleaned = email.trim().toLowerCase();

    try {
      // Store subscriber
      await addDoc(collection(db, "newsletterSubscribers"), {
        email: cleaned,
        createdAt: new Date().toISOString(),
        source: "website",
      });

      // Queue welcome email for Firebase "Trigger Email" extension (collection: mail)
      await addDoc(collection(db, "mail"), {
        to: [cleaned],
        message: {
          subject: "Welcome to AA Travel Group updates",
          text:
            "Assalamu Alaikum,\n\nThanks for subscribing to AA Travel Group. You will receive hotel offers and Umrah travel tips here.\n\nAA Travel Group",
          html: "<p>Assalamu Alaikum,</p><p>Thanks for subscribing to <strong>AA Travel Group</strong>. You will receive hotel offers and Umrah travel tips here.</p><p>AA Travel Group</p>",
        },
      });

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not subscribe. Please try again.");
    }
  }

  return (
    <section className="bg-ink-900 py-20">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
          Umrah tips &amp; hotel offers, straight to your inbox
        </h2>
        <p className="mt-2 text-sm text-white/60">
          No spam — occasional updates on hotel offers and travel advisories.
        </p>
        {status === "success" ? (
          <p className="mt-6 text-gold-400">Thank you — you&apos;re subscribed.</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white"
            />
            <Button type="submit" variant="gold" disabled={status === "loading"}>
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        )}
        {status === "error" && <p className="mt-3 text-sm text-maroon-300">{error}</p>}
      </div>
    </section>
  );
}
