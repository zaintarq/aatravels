"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { getClientDb } from "@/lib/firebase/client";

type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
};

export default function AdminNewsletterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Subscriber[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const snap = await getDocs(query(collection(getClientDb(), "newsletterSubscribers"), orderBy("createdAt", "desc")));
    setItems(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          email: String(data.email || ""),
          createdAt: String(data.createdAt || ""),
        };
      })
    );
  }

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.replace("/login?next=/admin/dashboard/newsletter");
      return;
    }
    if (user?.isAdmin) load().catch(() => undefined);
  }, [user, loading, router]);

  async function deleteSubscriber(id: string) {
    if (!user?.isAdmin) return;
    setBusyId(id);
    try {
      await deleteDoc(doc(getClientDb(), "newsletterSubscribers", id));
      await load();
    } catch (err) {
      console.error("Failed to delete subscriber:", err);
    } finally {
      setBusyId(null);
    }
  }

  if (loading || !user?.isAdmin) {
    return <p className="p-10 text-center text-sm text-ink-400">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-white">Newsletter Subscribers</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/dashboard">Back</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && <p className="text-sm text-ink-400">No subscribers yet.</p>}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-ink-900/10 px-4 py-3 dark:border-white/10"
          >
            <div>
              <p className="font-medium text-ink-900 dark:text-white">{item.email}</p>
              <p className="mt-1 text-xs text-ink-400">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busyId === item.id}
              onClick={() => deleteSubscriber(item.id)}
              className="shrink-0 text-maroon-500 hover:text-maroon-600"
            >
              <Trash2 size={14} />
              {busyId === item.id ? "Deleting..." : "Delete"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
