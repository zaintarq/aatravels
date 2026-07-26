"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { ChevronDown } from "lucide-react";
import { getClientDb } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  DEFAULT_HOTEL_LISTINGS,
  type HotelCategoryKey,
  type HotelCity,
} from "@/data/hotel-listings";
import { hotelListingKey } from "@/lib/hotel-listing-key";

type Listing = {
  id?: string;
  name: string;
  city: HotelCity;
  category: HotelCategoryKey;
};

function groupByCategory(listings: Listing[], city: HotelCity) {
  return CATEGORY_ORDER[city]
    .map((key) => ({
      key,
      title: CATEGORY_LABELS[city][key] || key,
      hotels: listings.filter((l) => l.city === city && l.category === key).map((l) => l.name),
    }))
    .filter((g) => g.hotels.length > 0);
}

function CityAccordion({
  cityTitle,
  categories,
}: {
  cityTitle: string;
  categories: Array<{ title: string; hotels: string[] }>;
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800">
      <h3 className="font-display text-xl font-semibold text-ink-900 dark:text-white">{cityTitle}</h3>
      <div className="mt-4 divide-y divide-ink-900/10 dark:divide-white/10">
        {categories.map((category, index) => {
          const open = openIndex === index;
          return (
            <div key={category.title} className="py-2 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : index)}
                className="flex w-full items-center justify-between gap-3 py-2 text-left"
                aria-expanded={open}
              >
                <span className="text-sm font-semibold text-maroon-500 dark:text-gold-500">
                  {category.title}
                </span>
                <ChevronDown
                  size={18}
                  className={cn(
                    "shrink-0 text-ink-400 transition-transform dark:text-white/50",
                    open && "rotate-180"
                  )}
                />
              </button>
              {open && (
                <ul className="mb-3 space-y-1.5 text-sm text-ink-700 dark:text-white/75">
                  {category.hotels.map((hotel, i) => (
                    <li key={`${category.title}-${hotel}-${i}`}>{hotel}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HotelListsSection() {
  const [extra, setExtra] = useState<Listing[]>([]);
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const db = getClientDb();
    Promise.all([
      getDocs(query(collection(db, "hotelListings"), orderBy("createdAt", "desc"))),
      getDocs(collection(db, "hotelHidden")),
    ])
      .then(([listingsSnap, hiddenSnap]) => {
        const rows: Listing[] = listingsSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: String(data.name),
            city: data.city as HotelCity,
            category: data.category as HotelCategoryKey,
          };
        });
        setExtra(rows);
        setHiddenKeys(new Set(hiddenSnap.docs.map((d) => String(d.data().key || d.id))));
      })
      .catch(() => {
        setExtra([]);
        setHiddenKeys(new Set());
      });
  }, []);

  const all = useMemo(() => {
    const seeded: Listing[] = DEFAULT_HOTEL_LISTINGS.map((h, i) => ({
      ...h,
      id: `seed-${i}`,
    }));

    const seen = new Set<string>();
    const merged: Listing[] = [];

    for (const item of [...extra, ...seeded]) {
      const key = hotelListingKey(item.city, item.name);
      if (hiddenKeys.has(key)) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }

    return merged;
  }, [extra, hiddenKeys]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <CityAccordion cityTitle="Makkah Hotels" categories={groupByCategory(all, "MAKKAH")} />
      <CityAccordion cityTitle="Madinah Hotels" categories={groupByCategory(all, "MADINAH")} />
    </div>
  );
}
