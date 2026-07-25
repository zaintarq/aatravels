import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { formatDistance } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const starLabel: Record<string, string> = {
  THREE: "3-Star",
  FOUR: "4-Star",
  FIVE: "5-Star",
  LUXURY_SUITE: "Luxury Suite",
};

export interface HotelCardData {
  slug: string;
  name: string;
  city: string;
  star: string;
  distanceMeters: number;
  imageUrl?: string;
}

export function HotelCard({ hotel }: { hotel: HotelCardData }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-ink-900/10 bg-white transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-ink-800">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={hotel.imageUrl || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200&auto=format&fit=crop"}
          alt={hotel.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-900">
          {starLabel[hotel.star] ?? hotel.star}
        </span>
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-maroon-500">
          {hotel.city === "MAKKAH" ? "Makkah" : "Madinah"}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold text-ink-900 dark:text-white">{hotel.name}</h3>
        <div className="mt-2 flex items-center gap-1 text-sm text-ink-400 dark:text-white/60">
          <MapPin size={14} /> {formatDistance(hotel.distanceMeters)}
        </div>
        <div className="mt-5 flex items-center gap-2">
          <Button size="sm" variant="primary" asChild className="flex-1">
            <Link href={`/hotels/${hotel.slug}`}>View Details</Link>
          </Button>
          <Button size="sm" variant="whatsapp" asChild>
            <a href={`https://wa.me/447000000000?text=Enquiry about ${encodeURIComponent(hotel.name)}`} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
