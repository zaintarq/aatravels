"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/sections/page-hero";
import { getClientDb } from "@/lib/firebase/client";
import { PriceFrom } from "@/components/ui/price";

type PackageCard = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  nights: number;
  priceFrom?: number | null;
  type?: string;
  imageUrl?: string | null;
};

export default function PackagesPage() {
  const [items, setItems] = useState<PackageCard[]>([]);

  useEffect(() => {
    getDocs(query(collection(getClientDb(), "packages"), orderBy("createdAt", "desc")))
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
              imageUrl: data.imageUrl ? String(data.imageUrl) : null,
            };
          })
          .filter(Boolean) as PackageCard[];

        setItems(fromFb);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Umrah packages"
        title="Ready-made & Customised Packages"
        description="Browse our Umrah packages and deals — prices shown in your local currency."
      />

      <section className="bg-cream py-16 dark:bg-ink-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.length === 0 && (
              <p className="col-span-full text-center text-sm text-ink-400 dark:text-white/60">
                No packages available yet. Check back soon or contact us for custom Umrah packages.
              </p>
            )}
            {items.map((p) => (
              <div
                key={p.id}
                className="group overflow-hidden rounded-2xl border border-ink-900/10 bg-white dark:border-white/10 dark:bg-ink-800"
              >
                <div className="relative h-52 w-full overflow-hidden bg-ink-900/5">
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-ink-400">
                      AA Travel Group
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {p.type === "deal" && (
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gold-500">Deal</p>
                  )}
                  <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-white">{p.title}</h2>
                  <p className="mt-2 text-sm text-ink-400 dark:text-white/60">{p.summary}</p>
                  <p className="mt-4 text-sm font-medium text-maroon-500">
                    {p.nights} nights{" "}
                    {p.priceFrom != null && (
                      <>
                        · <PriceFrom amountGbp={p.priceFrom} />
                      </>
                    )}
                  </p>
                  <Button size="sm" className="mt-4 w-full" asChild>
                    <Link href={`/umrah-packages/${p.slug}`}>View Package</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
