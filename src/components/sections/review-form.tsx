"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/input";
import { useAuth } from "@/components/auth/auth-provider";
import { db } from "@/lib/firebase/client";

type Props = {
  hotelId: string;
};

export function ReviewForm({ hotelId }: Props) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-ink-900/15 p-5 text-sm dark:border-white/15">
        <p className="text-ink-700 dark:text-white/80">
          <Link href="/login" className="font-medium text-maroon-500 hover:underline">
            Sign in
          </Link>{" "}
          to leave a review with your username.
        </p>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (comment.trim().length < 10) {
        throw new Error("Please write a bit more about your stay");
      }

      await addDoc(collection(db, "reviews"), {
        hotelId,
        firebaseUid: user!.uid,
        authorName: user!.username,
        rating,
        comment: comment.trim(),
        approved: true,
        createdAt: new Date().toISOString(),
      });

      setComment("");
      setRating(5);
      setSuccess(`Thanks ${user!.username} — your review is live.`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 space-y-4 rounded-xl border border-ink-900/10 p-5 dark:border-white/10 dark:bg-ink-800"
    >
      <div>
        <p className="text-sm font-medium text-ink-900 dark:text-white">
          Review as <span className="text-maroon-500">@{user.username}</span>
        </p>
        <p className="mt-1 text-xs text-ink-400 dark:text-white/50">Your username will appear with this review.</p>
      </div>

      <div>
        <Label>Rating</Label>
        <div className="mt-1 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            return (
              <button
                key={value}
                type="button"
                aria-label={`${value} stars`}
                onClick={() => setRating(value)}
                className={value <= rating ? "text-gold-400" : "text-ink-900/20 dark:text-white/20"}
              >
                <Star size={22} fill="currentColor" />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label htmlFor="review-comment">Your review</Label>
        <Textarea
          id="review-comment"
          required
          minLength={10}
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience at this hotel..."
        />
      </div>

      {error && <p className="text-sm text-maroon-500">{error}</p>}
      {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}

      <Button type="submit" disabled={submitting} size="sm">
        {submitting ? "Submitting..." : "Post Review"}
      </Button>
    </form>
  );
}
