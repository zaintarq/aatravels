import type { Metadata } from "next";
import { Car, Plane, Users, ShieldCheck, Clock, MapPin } from "lucide-react";
import { StarDivider } from "@/components/ui/star-divider";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Transport",
  description: "Airport transfers, intercity transport and private group transport in Makkah and Madinah.",
};

const transportServices = [
  {
    icon: Plane,
    title: "Airport Transfers",
    description: "Pickup and drop-off support for Jeddah, Madinah and nearby airport journeys.",
  },
  {
    icon: MapPin,
    title: "Makkah to Madinah",
    description: "Private and group transfers between the two holy cities with clear journey coordination.",
  },
  {
    icon: Users,
    title: "Group Transport",
    description: "Vehicle arrangements for families, agents and larger pilgrim groups travelling together.",
  },
  {
    icon: Car,
    title: "Private Vehicles",
    description: "Comfortable private transport options for flexible schedules and direct routes.",
  },
  {
    icon: Clock,
    title: "Timed Pickups",
    description: "Planned pickups for hotel check-in, airport departures and itinerary movements.",
  },
  {
    icon: ShieldCheck,
    title: "Journey Support",
    description: "Helpful coordination before travel so guests know where to meet and what to expect.",
  },
];

export default function TransportPage() {
  return (
    <div>
      <section className="bg-ink-900 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
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
              <div
                key={service.title}
                className="rounded-2xl border border-ink-900/10 bg-white p-8 dark:border-white/10 dark:bg-ink-900"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-500/10 text-maroon-500">
                  <service.icon size={22} />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400 dark:text-white/60">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
