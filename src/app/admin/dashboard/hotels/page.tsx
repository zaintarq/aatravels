"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addDoc, collection, getDocs, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { useAuth } from "@/components/auth/auth-provider";
import { getClientDb } from "@/lib/firebase/client";
import { CATEGORY_LABELS, type HotelCategoryKey, type HotelCity } from "@/data/hotel-listings";

type Row = { id: string; name: string; city: string; category: string; createdAt?: string };

export default function AdminHotelsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [city, setCity] = useState<HotelCity>("MAKKAH");
  const [category, setCategory] = useState<HotelCategoryKey>("five_star");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const categoryOptions = Object.entries(CATEGORY_LABELS[city]) as [HotelCategoryKey, string][];

  async function load() {
    const snap = await getDocs(query(collection(getClientDb(), "hotelListings"), orderBy("createdAt", "desc")));
    setRows(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: String(data.name),
          city: String(data.city),
          category: String(data.category),
          createdAt: data.createdAt,
        };
      })
    );
  }

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.replace("/login?next=/admin/dashboard/hotels");
      return;
    }
    if (user?.isAdmin) load().catch(() => undefined);
  }, [user, loading, router]);

  useEffect(() => {
    const keys = Object.keys(CATEGORY_LABELS[city]) as HotelCategoryKey[];
    if (!keys.includes(category)) setCategory(keys[0]);
  }, [city, category]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user?.isAdmin) return;
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(getClientDb(), "hotelListings"), {
        name: name.trim(),
        city,
        category,
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
      });
      setName("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save hotel");
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
        <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-white">Add Hotels</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/dashboard">Back</Link>
        </Button>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-ink-900/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800"
      >
        <div>
          <Label htmlFor="hotelName">Hotel name</Label>
          <Input id="hotelName" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Hotel name" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="city">City</Label>
            <Select id="city" value={city} onChange={(e) => setCity(e.target.value as HotelCity)}>
              <option value="MAKKAH">Makkah</option>
              <option value="MADINAH">Madinah</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as HotelCategoryKey)}
            >
              {categoryOptions.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        {error && <p className="text-sm text-maroon-500">{error}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Hotel"}
        </Button>
      </form>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Added from admin</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {rows.length === 0 && <li className="text-ink-400">No admin-added hotels yet.</li>}
          {rows.map((r) => (
            <li key={r.id} className="rounded-lg border border-ink-900/10 px-4 py-3 dark:border-white/10">
              <span className="font-medium text-ink-900 dark:text-white">{r.name}</span>
              <span className="mt-1 block text-xs text-ink-400">
                {r.city} · {CATEGORY_LABELS[r.city as HotelCity]?.[r.category as HotelCategoryKey] || r.category}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
