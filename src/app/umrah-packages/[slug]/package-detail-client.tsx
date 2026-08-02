"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { whatsappLink } from "@/lib/utils";
import { StarDivider } from "@/components/ui/star-divider";
import { Button } from "@/components/ui/button";
import { getClientDb } from "@/lib/firebase/client";
import { getPackageBySlug } from "@/data/packages";
import { PriceFrom } from "@/components/ui/price";

type Pkg = {
  title: string;
  summary?: string;
  description: string;
  nights: number;
  inclusions?: string;
  exclusions?: string | null;
  priceFrom?: number | null;
  imageUrl?: string | null;
};

export function PackageDetailClient() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [pkg, setPkg] = useState<Pkg | null | undefined>(undefined);

  useEffect(() => {
    const seeded = getPackageBySlug(slug);
    if (seeded) {
      setPkg(seeded);
      return;
    }

    getDocs(query(collection(getClientDb(), "packages"), where("slug", "==", slug), limit(1)))
      .then((snap) => {
        if (snap.empty) {
          setPkg(null);
          return;
        }
        const data = snap.docs[0].data();
        setPkg({
          title: String(data.title),
          summary: data.summary ? String(data.summary) : undefined,
          description: String(data.description || data.summary || ""),
          nights: Number(data.nights || 0),
          inclusions: data.inclusions ? String(data.inclusions) : undefined,
          exclusions: data.exclusions ? String(data.exclusions) : null,
          priceFrom: data.priceFrom != null ? Number(data.priceFrom) : null,
          imageUrl: data.imageUrl ? String(data.imageUrl) : null,
        });
      })
      .catch(() => setPkg(null));
  }, [slug]);

  if (pkg === undefined) {
    return <p className="p-16 text-center text-sm text-ink-400">Loading…</p>;
  }
  if (!pkg) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      {pkg.imageUrl && (
        <div className="relative mb-10 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-ink-900/10 dark:border-white/10">
          <Image src={pkg.imageUrl} alt={pkg.title} fill className="object-cover" priority sizes="(max-width: 896px) 100vw, 896px" />
        </div>
      )}
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-500">{pkg.nights} Night Package</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900 dark:text-white">{pkg.title}</h1>
      {pkg.priceFrom != null && (
        <p className="mt-2 text-sm font-medium text-maroon-500">
          <PriceFrom amountGbp={pkg.priceFrom} />
        </p>
      )}
      <StarDivider className="justify-start" />
      <p className="mt-6 leading-relaxed text-ink-700 dark:text-white/80">{pkg.description}</p>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {pkg.inclusions && (
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-white">Inclusions</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-ink-700 dark:text-white/70">{pkg.inclusions}</p>
          </div>
        )}
        {pkg.exclusions && (
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-white">Exclusions</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-ink-700 dark:text-white/70">{pkg.exclusions}</p>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="lg" asChild>
          <a
            href={whatsappLink(
              process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "447900007023",
              `Enquiry about ${pkg.title}`
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enquire on WhatsApp
          </a>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="/contact">Request a Quote</a>
        </Button>
      </div>
    </div>
  );
}
