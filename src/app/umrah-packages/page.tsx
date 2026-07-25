"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { StarDivider } from "@/components/ui/star-divider";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase/client";
import { getAllPackages, type UmrahPackage } from "@/data/packages";

type PackageCard = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  nights: number;
  priceFrom?: number | null;
  type?: string;
};

export default function PackagesPage() {
  const [items, setItems] = useState<PackageCard[]>(() =>
    getAllPackages().map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      nights: p.nights,
      priceFrom: p.priceFrom,
      type: "package",
    }))
  );

  useEffect(() => {
    getDocs(query(collection(db, "packages"), orderBy("createdAt", "desc")))
      .then((snap) => {
        const fromFb: PackageCard[] = snap.docs
          .map((d) => {
            const data = d.data();
            if (data.active === false) return null;
            return {
              id: d.id,
              title: String(data.title),
              slug: String(data.slug || d.id),
              summary: String(data.summary || ""),
              nights: Number(data.nights || 0),
              priceFrom: data.priceFrom != null ? Number(data.priceFrom) : null,
              type: String(data.type || "package"),
            };
          })
          .filter(Boolean) as PackageCard[];

        if (fromFb.length) {
          const seeded = getAllPackages().map((p: UmrahPackage) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            summary: p.summary,
            nights: p.nights,
            priceFrom: p.priceFrom,
            type: "package",
          }));
          const seen = new Set(fromFb.map((p) => p.slug));
          setItems([...fromFb, ...seeded.filter((p) => !seen.has(p.slug))]);
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-500">Umrah packages</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-900 dark:text-white">
          Ready-made &amp; Customised Packages
        </h1>
        <StarDivider />
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-ink-900/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800"
          >
            {p.type === "deal" && (
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gold-500">Deal</p>
            )}
            <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-white">{p.title}</h2>
            <p className="mt-2 text-sm text-ink-400 dark:text-white/60">{p.summary}</p>
            <p className="mt-4 text-sm font-medium text-maroon-500">
              {p.nights} nights {p.priceFrom ? `\u00b7 from £${p.priceFrom}` : ""}
            </p>
            <Button size="sm" className="mt-4 w-full" asChild>
              <Link href={`/umrah-packages/${p.slug}`}>View Package</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
