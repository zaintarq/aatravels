import type { Metadata } from "next";
import { StarDivider } from "@/components/ui/star-divider";
import { HotelListsSection } from "@/components/sections/hotel-lists-section";

export const metadata: Metadata = {
  title: "Hotels in Makkah & Madinah",
  description: "Browse AA Group Travels hotel options in Makkah and Madinah.",
};

export default function HotelsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-500">AA Group Travels hotels</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-900 dark:text-white">
          Hotels in Makkah &amp; Madinah
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-400 dark:text-white/60">
          Browse hotel options for your Umrah journey. Click a category to expand or collapse the list.
        </p>
        <StarDivider />
      </div>

      <section className="mt-12">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-500">Hotel Selection Lists</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink-900 dark:text-white">
            Makkah &amp; Madinah Hotel Lists
          </h2>
        </div>
        <HotelListsSection />
      </section>
    </div>
  );
}
