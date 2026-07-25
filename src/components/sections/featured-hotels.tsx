import { HotelCard } from "@/components/sections/hotel-card";
import { StarDivider } from "@/components/ui/star-divider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getFeaturedHotels } from "@/data/hotels";

export async function FeaturedHotels() {
  const hotels = getFeaturedHotels().slice(0, 6);

  return (
    <section className="bg-white py-24 dark:bg-ink-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-500">Featured stays</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900 dark:text-white sm:text-4xl">
            Featured Hotels
          </h2>
          <StarDivider />
        </div>

        {hotels.length > 0 ? (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((h) => (
              <HotelCard
                key={h.id}
                hotel={{
                  slug: h.slug,
                  name: h.name,
                  city: h.city,
                  star: h.star,
                  distanceMeters: h.distanceMeters,
                  imageUrl: h.images?.[0]?.url,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="mt-14 text-center text-sm text-ink-400 dark:text-white/50">
            Featured hotels will appear here once added.
          </p>
        )}

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/hotels">View All Hotels</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
