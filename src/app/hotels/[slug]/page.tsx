import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Star, Check } from "lucide-react";
import { formatDistance, whatsappLink } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HotelCard } from "@/components/sections/hotel-card";
import { StarDivider } from "@/components/ui/star-divider";
import { ReviewForm } from "@/components/sections/review-form";
import { getHotelBySlug, getRelatedHotels } from "@/data/hotels";
import { getApprovedReviews } from "@/lib/firebase/data";

export const runtime = "edge";

type HotelPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: HotelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hotel = getHotelBySlug(slug);
  if (!hotel) return { title: "Hotel Not Found" };
  return {
    title: hotel.metaTitle || hotel.name,
    description: hotel.metaDescription || hotel.description.slice(0, 155),
  };
}

export default async function HotelDetailPage({ params }: HotelPageProps) {
  const { slug } = await params;
  const hotel = getHotelBySlug(slug);
  if (!hotel) notFound();

  const related = getRelatedHotels(hotel.city, hotel.id, 3);
  const reviews = await getApprovedReviews(hotel.id).catch(() => []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    description: hotel.description,
    address: hotel.address,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {hotel.images.map((img, i) => (
          <div
            key={img.id}
            className={`relative overflow-hidden rounded-xl ${i === 0 ? "col-span-2 row-span-2 h-full min-h-[16rem]" : "h-32 sm:h-40"}`}
          >
            <Image src={img.url} alt={img.altText || hotel.name} fill className="object-cover" />
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-maroon-500">
            {hotel.city === "MAKKAH" ? "Makkah" : "Madinah"}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink-900 dark:text-white">{hotel.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-400 dark:text-white/60">
            <span className="flex items-center gap-1">
              <MapPin size={16} /> {formatDistance(hotel.distanceMeters)}
            </span>
            <span className="flex items-center gap-1">
              <Star size={16} className="text-gold-400" fill="currentColor" /> {hotel.star.replace("_", " ")}
            </span>
          </div>

          <p className="mt-6 leading-relaxed text-ink-700 dark:text-white/80">{hotel.description}</p>

          {hotel.amenities.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Amenities</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {hotel.amenities.map((a) => (
                  <span key={a.id} className="flex items-center gap-2 text-sm text-ink-700 dark:text-white/80">
                    <Check size={16} className="text-maroon-500" /> {a.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hotel.rooms.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Room Types</h2>
              <div className="mt-4 space-y-3">
                {hotel.rooms.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-xl border border-ink-900/10 p-4 dark:border-white/10"
                  >
                    <div>
                      <p className="font-medium text-ink-900 dark:text-white">{r.name}</p>
                      <p className="text-xs text-ink-400 dark:text-white/50">
                        Sleeps {r.capacity} &middot; {r.bedType} {r.sizeSqm ? `\u00b7 ${r.sizeSqm} m\u00b2` : ""}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={whatsappLink(
                          process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "447900007023",
                          `Enquiry about ${r.name} at ${hotel.name}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Enquire
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hotel.address && (
            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Location</h2>
              <p className="mt-2 text-sm text-ink-400 dark:text-white/60">{hotel.address}</p>
              <div className="mt-4 aspect-video overflow-hidden rounded-xl border border-ink-900/10 dark:border-white/10">
                <iframe
                  title="Hotel location"
                  className="h-full w-full"
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${hotel.latitude ?? 21.4225},${hotel.longitude ?? 39.8262}&output=embed`}
                />
              </div>
            </div>
          )}

          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Reviews</h2>
            <ReviewForm hotelId={hotel.id} />
            {reviews.length > 0 ? (
              <div className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-ink-900/10 p-4 dark:border-white/10">
                    <div className="flex items-center gap-1 text-gold-400">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-ink-700 dark:text-white/80">{r.comment}</p>
                    <p className="mt-1 text-xs font-medium text-maroon-500">@{r.authorName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-ink-400 dark:text-white/50">
                No reviews yet. Be the first to share your stay.
              </p>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-ink-900/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800">
          <p className="font-display text-lg font-semibold text-ink-900 dark:text-white">Hotel Enquiry</p>
          <p className="mt-1 text-sm text-ink-400 dark:text-white/60">
            Send your travel dates, room type and guest count to our team.
          </p>
          <Button className="mt-5 w-full" asChild>
            <a
              href={whatsappLink(
                process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "447900007023",
                `Enquiry about ${hotel.name}`
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Enquire on WhatsApp
            </a>
          </Button>
          <Button variant="outline" className="mt-3 w-full" asChild>
            <a href="/contact">Request a Quote</a>
          </Button>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">Related Hotels</h2>
          <StarDivider className="justify-start" />
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((h) => (
              <HotelCard
                key={h.id}
                hotel={{
                  slug: h.slug,
                  name: h.name,
                  city: h.city,
                  star: h.star,
                  distanceMeters: h.distanceMeters,
                  imageUrl: h.images[0]?.url,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
