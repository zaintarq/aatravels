"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { useAuth } from "@/components/auth/auth-provider";
import { getClientDb } from "@/lib/firebase/client";
import {
  CATEGORY_LABELS,
  DEFAULT_HOTEL_LISTINGS,
  type HotelCategoryKey,
  type HotelCity,
} from "@/data/hotel-listings";
import { hotelListingDocId, hotelListingKey } from "@/lib/hotel-listing-key";

type Row = {
  key: string;
  name: string;
  city: HotelCity;
  category: HotelCategoryKey;
  source: "seed" | "firestore";
  firestoreId?: string;
  hidden: boolean;
};

export default function AdminHotelsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [city, setCity] = useState<HotelCity>("MAKKAH");
  const [category, setCategory] = useState<HotelCategoryKey>("five_star");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const categoryOptions = Object.entries(CATEGORY_LABELS[city]) as [HotelCategoryKey, string][];

  async function load() {
    const db = getClientDb();
    const [listingsSnap, hiddenSnap] = await Promise.all([
      getDocs(query(collection(db, "hotelListings"), orderBy("createdAt", "desc"))),
      getDocs(collection(db, "hotelHidden")),
    ]);

    const hiddenKeys = new Set(
      hiddenSnap.docs.map((d) => String(d.data().key || d.id))
    );

    const firestoreRows: Row[] = listingsSnap.docs.map((d) => {
      const data = d.data();
      const cityValue = String(data.city) as HotelCity;
      const nameValue = String(data.name);
      const key = hotelListingKey(cityValue, nameValue);
      return {
        key,
        name: nameValue,
        city: cityValue,
        category: String(data.category) as HotelCategoryKey,
        source: "firestore",
        firestoreId: d.id,
        hidden: hiddenKeys.has(key),
      };
    });

    const seedRows: Row[] = DEFAULT_HOTEL_LISTINGS.map((h) => {
      const key = hotelListingKey(h.city, h.name);
      return {
        key,
        name: h.name,
        city: h.city,
        category: h.category,
        source: "seed",
        hidden: hiddenKeys.has(key),
      };
    });

    const merged = new Map<string, Row>();
    for (const row of [...firestoreRows, ...seedRows]) {
      if (!merged.has(row.key)) merged.set(row.key, row);
      else if (row.source === "firestore") merged.set(row.key, row);
    }

    setRows(
      Array.from(merged.values()).sort((a, b) => {
        if (a.city !== b.city) return a.city.localeCompare(b.city);
        return a.name.localeCompare(b.name);
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

  const visibleCount = useMemo(() => rows.filter((r) => !r.hidden).length, [rows]);

  async function hideHotel(row: Row) {
    if (!user?.isAdmin) return;
    setBusyKey(row.key);
    setError("");
    try {
      const db = getClientDb();
      if (row.source === "firestore" && row.firestoreId) {
        await deleteDoc(doc(db, "hotelListings", row.firestoreId));
      } else {
        await setDoc(doc(db, "hotelHidden", hotelListingDocId(row.key)), {
          key: row.key,
          name: row.name,
          city: row.city,
          hiddenAt: new Date().toISOString(),
          hiddenBy: user.uid,
        });
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove hotel");
    } finally {
      setBusyKey(null);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user?.isAdmin) return;
    setSaving(true);
    setError("");
    try {
      const trimmed = name.trim();
      const key = hotelListingKey(city, trimmed);
      const db = getClientDb();

      await addDoc(collection(db, "hotelListings"), {
        name: trimmed,
        city,
        category,
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
      });

      // If this hotel was previously hidden (seed), unhide it
      await deleteDoc(doc(db, "hotelHidden", hotelListingDocId(key))).catch(() => undefined);

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
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-white">Manage Hotels</h1>
          <p className="mt-1 text-sm text-ink-400">{visibleCount} hotels visible on the website</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/dashboard">Back</Link>
        </Button>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-ink-900/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800"
      >
        <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Add hotel</h2>
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
        <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">All hotel options</h2>
        <p className="mt-1 text-sm text-ink-400">Remove a hotel to hide it from the public Hotels page.</p>
        <ul className="mt-4 space-y-2 text-sm">
          {rows.filter((r) => !r.hidden).length === 0 && (
            <li className="text-ink-400">No visible hotels. Add one above.</li>
          )}
          {rows
            .filter((r) => !r.hidden)
            .map((r) => (
              <li
                key={r.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-ink-900/10 px-4 py-3 dark:border-white/10"
              >
                <div>
                  <span className="font-medium text-ink-900 dark:text-white">{r.name}</span>
                  <span className="mt-1 block text-xs text-ink-400">
                    {r.city} · {CATEGORY_LABELS[r.city]?.[r.category] || r.category}
                    {r.source === "seed" ? " · default" : " · added by admin"}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busyKey === r.key}
                  onClick={() => hideHotel(r)}
                  className="shrink-0 text-maroon-500 hover:text-maroon-600"
                >
                  <Trash2 size={14} />
                  {busyKey === r.key ? "Removing..." : "Remove"}
                </Button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
