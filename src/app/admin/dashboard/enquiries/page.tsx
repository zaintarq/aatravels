"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { getClientDb } from "@/lib/firebase/client";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
};

export default function AdminEnquiriesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Enquiry[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const snap = await getDocs(query(collection(getClientDb(), "enquiries"), orderBy("createdAt", "desc")));
    setItems(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: String(data.name || ""),
          email: String(data.email || ""),
          phone: data.phone ? String(data.phone) : undefined,
          message: String(data.message || ""),
          createdAt: String(data.createdAt || ""),
        };
      })
    );
  }

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.replace("/login?next=/admin/dashboard/enquiries");
      return;
    }
    if (user?.isAdmin) load().catch(() => undefined);
  }, [user, loading, router]);

  async function deleteEnquiry(id: string) {
    if (!user?.isAdmin) return;
    setBusyId(id);
    try {
      await deleteDoc(doc(getClientDb(), "enquiries", id));
      await load();
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
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
        <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-white">Enquiries</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/dashboard">Back</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && <p className="text-sm text-ink-400">No enquiries yet.</p>}
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-ink-900/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium text-ink-900 dark:text-white">{item.name}</p>
                <p className="mt-1 text-sm text-ink-400">{item.email}</p>
                {item.phone && <p className="text-sm text-ink-400">{item.phone}</p>}
                <p className="mt-2 text-sm text-ink-700 dark:text-white/80">{item.message}</p>
                <p className="mt-3 text-xs text-ink-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busyId === item.id}
                onClick={() => deleteEnquiry(item.id)}
                className="shrink-0 text-maroon-500 hover:text-maroon-600"
              >
                <Trash2 size={14} />
                {busyId === item.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
