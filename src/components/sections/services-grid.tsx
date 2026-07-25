import { BedDouble, Car, Users, Building2, Plane, Sparkles } from "lucide-react";
import { StarDivider } from "@/components/ui/star-divider";

const services = [
  { icon: BedDouble, title: "Hotel Bookings", desc: "3, 4 and 5-star hotels plus luxury suites across Makkah & Madinah." },
  { icon: Car, title: "Airport & VIP Transport", desc: "Reliable transfers and private VIP transport for individuals and groups." },
  { icon: Users, title: "Group & Corporate Bookings", desc: "Tailored allocations for large groups and corporate travel programmes." },
  { icon: Building2, title: "Umrah Packages", desc: "Ready-made and fully customised Umrah packages for every budget." },
  { icon: Plane, title: "Air Tickets", desc: "Competitive fares sourced through trusted airline and supplier networks." },
  { icon: Sparkles, title: "Customised Packages", desc: "Bespoke itineraries built around your dates, budget and group size." },
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
            <div
              key={s.title}
              className="group rounded-2xl border border-ink-900/10 bg-white p-8 transition-shadow hover:shadow-lg hover:shadow-maroon-500/5 dark:border-white/10 dark:bg-ink-900"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-500/10 text-maroon-500 transition-colors group-hover:bg-maroon-500 group-hover:text-white">
                <s.icon size={22} />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400 dark:text-white/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
