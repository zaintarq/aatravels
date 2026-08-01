import type { Metadata } from "next";
import Image from "next/image";
import { Car, Plane, Users, ShieldCheck, Clock, MapPin } from "lucide-react";
import { FeatureCard } from "@/components/sections/feature-card";
import { StarDivider } from "@/components/ui/star-divider";
import { Button } from "@/components/ui/button";
import { cardImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Transport",
  description: "Airport transfers, intercity transport and private group transport in Makkah and Madinah.",
};

const [t0, t1, t2, t3, t4, t5] = cardImages(6, 0);

const transportServices = [
  {
    icon: Plane,
    title: "Airport Transfers",
    description: "Pickup and drop-off support for Jeddah, Madinah and nearby airport journeys.",
    image: t0,
  },
  {
    icon: MapPin,
    title: "Makkah to Madinah",
    description: "Private and group transfers between the two holy cities with clear journey coordination.",
    image: t1,
  },
  {
    icon: Users,
    title: "Group Transport",
    description: "Vehicle arrangements for families, agents and larger pilgrim groups travelling together.",
    image: t2,
  },
  {
    icon: Car,
    title: "Private Vehicles",
    description: "Comfortable private transport options for flexible schedules and direct routes.",
    image: t3,
  },
  {
    icon: Clock,
    title: "Timed Pickups",
    description: "Planned pickups for hotel check-in, airport departures and itinerary movements.",
    image: t4,
  },
  {
    icon: ShieldCheck,
    title: "Journey Support",
    description: "Helpful coordination before travel so guests know where to meet and what to expect.",
    image: t5,
  },
];

export default function TransportPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-ink-900 px-4 py-24 text-white sm:px-6 lg:px-8">
        <Image
          src="/images/hero-transport.png"
          alt="Air travel view from airplane window"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink-900/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/50 to-ink-900/30" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">AA Travel Group transport</p>
          <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Transport for Makkah &amp; Madinah</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            Reliable airport, city and intercity transport for Umrah travellers, families and groups.
          </p>
          <div className="mt-9">
            <Button variant="whatsapp" size="lg" asChild>
              <a href="https://wa.me/447900007023" target="_blank" rel="noopener noreferrer">
                Ask on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 dark:bg-ink-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-500">Transport services</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900 dark:text-white sm:text-4xl">
              Travel support arranged around your journey
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-400 dark:text-white/60">
              Transport is arranged according to route, vehicle type, passenger count and timing.
            </p>
            <StarDivider />
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {transportServices.map((service) => (
              <FeatureCard
                key={service.title}
                title={service.title}
                description={service.description}
                imageSrc={service.image.src}
                imageAlt={service.image.alt}
                icon={service.icon}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
