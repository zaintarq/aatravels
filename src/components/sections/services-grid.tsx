import { BedDouble, Car, Users, Building2, Plane, Sparkles } from "lucide-react";
import { FeatureCard } from "@/components/sections/feature-card";
import { StarDivider } from "@/components/ui/star-divider";
import { cardImages } from "@/lib/site-images";

const [img0, , img2, img3] = cardImages(6, 2);

const services = [
  {
    icon: BedDouble,
    title: "Hotel Bookings",
    desc: "3, 4 and 5-star hotels plus luxury suites across Makkah & Madinah.",
    image: img0,
  },
  {
    icon: Car,
    title: "Airport & VIP Transport",
    desc: "Reliable transfers and private VIP transport for individuals and groups.",
    image: {
      src: "/images/airport-transport-car.png",
      alt: "Private VIP transport vehicle",
    },
  },
  {
    icon: Users,
    title: "Group & Corporate Bookings",
    desc: "Tailored allocations for large groups and corporate travel programmes.",
    image: img2,
  },
  {
    icon: Building2,
    title: "Umrah Packages",
    desc: "Ready-made and fully customised Umrah packages for every budget.",
    image: img3,
  },
  {
    icon: Plane,
    title: "Air Tickets",
    desc: "Competitive fares sourced through trusted airline and supplier networks.",
    image: {
      src: "/images/air-tickets-promo.png",
      alt: "AA Travel Group air tickets and flights",
    },
  },
  {
    icon: Sparkles,
    title: "Customised Packages",
    desc: "Bespoke itineraries built around your dates, budget and group size.",
    image: {
      src: "/images/customised-packages.png",
      alt: "Customised Umrah packages with AA Travel Group",
    },
  },
];

export function ServicesGrid() {
  return (
    <section className="bg-cream py-24 dark:bg-ink-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-500">What we offer</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900 dark:text-white sm:text-4xl">
            Everything a pilgrim needs
          </h2>
          <StarDivider />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <FeatureCard
              key={s.title}
              title={s.title}
              description={s.desc}
              imageSrc={s.image.src}
              imageAlt={s.image.alt}
              icon={s.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
