import type { Metadata } from "next";
import Link from "next/link";
import { StarDivider } from "@/components/ui/star-divider";
import { Button } from "@/components/ui/button";
import { getAllPackages } from "@/data/packages";

export const metadata: Metadata = {
  title: "Umrah Packages",
  description: "Ready-made and fully customised Umrah packages for individuals, families and groups.",
};

export default function PackagesPage() {
  const packages = getAllPackages();

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
        {packages.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-ink-900/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800"
          >
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
