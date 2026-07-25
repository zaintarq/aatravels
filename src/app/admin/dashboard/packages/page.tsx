"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addDoc, collection, getDocs, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { useAuth } from "@/components/auth/auth-provider";
import { getClientDb } from "@/lib/firebase/client";

type Row = {
  id: string;
  title: string;
  type: string;
  nights: number;
  priceFrom?: number;
  summary: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminPackagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"package" | "deal">("package");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [nights, setNights] = useState(7);
  const [priceFrom, setPriceFrom] = useState("");
  const [inclusions, setInclusions] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [city, setCity] = useState("MAKKAH,MADINAH");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const snap = await getDocs(query(collection(getClientDb(), "packages"), orderBy("createdAt", "desc")));
    setRows(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: String(data.title),
          type: String(data.type || "package"),
          nights: Number(data.nights || 0),
          priceFrom: data.priceFrom ? Number(data.priceFrom) : undefined,
          summary: String(data.summary || ""),
        };
      })
    );
  }

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.replace("/login?next=/admin/dashboard/packages");
      return;
    }
    if (user?.isAdmin) load().catch(() => undefined);
  }, [user, loading, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user?.isAdmin) return;
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(getClientDb(), "packages"), {
        title: title.trim(),
        slug: slugify(title.trim()) || `pkg-${Date.now()}`,
        type,
        summary: summary.trim(),
        description: description.trim() || summary.trim(),
        nights: Number(nights),
        city,
        priceFrom: priceFrom ? Number(priceFrom) : null,
        inclusions: inclusions.trim(),
        exclusions: exclusions.trim() || null,
        active: true,
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
      });
      setTitle("");
      setSummary("");
      setDescription("");
      setPriceFrom("");
      setInclusions("");
      setExclusions("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save package");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user?.isAdmin) {
    return <p className="p-10 text-center text-sm text-ink-400">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-white">Packages &amp; Deals</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/dashboard">Back</Link>
        </Button>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-ink-900/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select id="type" value={type} onChange={(e) => setType(e.target.value as "package" | "deal")}>
              <option value="package">Umrah Package</option>
              <option value="deal">Deal / Offer</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="nights">Nights</Label>
            <Input
              id="nights"
              type="number"
              min={1}
              required
              value={nights}
              onChange={(e) => setNights(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="price">Price from (£)</Label>
            <Input id="price" type="number" min={0} value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="city">Cities</Label>
            <Select id="city" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="MAKKAH">Makkah</option>
              <option value="MADINAH">Madinah</option>
              <option value="MAKKAH,MADINAH">Makkah & Madinah</option>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="summary">Short summary</Label>
            <Input id="summary" required value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="inclusions">Inclusions</Label>
            <Textarea id="inclusions" rows={2} value={inclusions} onChange={(e) => setInclusions(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="exclusions">Exclusions</Label>
            <Textarea id="exclusions" rows={2} value={exclusions} onChange={(e) => setExclusions(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-sm text-maroon-500">{error}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Package / Deal"}
        </Button>
      </form>

      <div className="mt-10 space-y-3">
        <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Saved items</h2>
        {rows.length === 0 && <p className="text-sm text-ink-400">No packages or deals yet.</p>}
        {rows.map((r) => (
          <div key={r.id} className="rounded-lg border border-ink-900/10 px-4 py-3 dark:border-white/10">
            <p className="font-medium text-ink-900 dark:text-white">{r.title}</p>
            <p className="text-xs text-ink-400">
              {r.type} · {r.nights} nights {r.priceFrom ? `· from £${r.priceFrom}` : ""}
            </p>
            <p className="mt-1 text-sm text-ink-400">{r.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
