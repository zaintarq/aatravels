import type { Metadata } from "next";
import Image from "next/image";
import { StarDivider } from "@/components/ui/star-divider";
import { HotelListsSection } from "@/components/sections/hotel-lists-section";

export const metadata: Metadata = {
  title: "Hotels in Makkah & Madinah",
  description: "Browse AA Travel Group hotel options in Makkah and Madinah.",
};

export default function HotelsPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-ink-900 px-4 py-24 sm:px-6 lg:px-8">
        <Image
          src="/images/hero-makkah.png"
          alt="Masjid al-Haram, Makkah"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink-900/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/50 to-ink-900/30" />

        <div className="relative mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-200">AA Travel Group hotels</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
            Hotels in Makkah &amp; Madinah
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            Browse hotel options for your Umrah journey. Click a category to expand or collapse the list.
          </p>
          <StarDivider className="mt-6 opacity-80" />
        </div>
      </section>

      <section className="bg-cream py-16 dark:bg-ink-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-500">Hotel Selection Lists</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink-900 dark:text-white">
              Makkah &amp; Madinah Hotel Lists
            </h2>
          </div>
          <HotelListsSection />
        </div>
      </section>
    </div>
  );
}
