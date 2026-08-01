import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Services",
  description: "Hotel bookings, airport transfers, VIP transport, Umrah packages, group and corporate bookings, air tickets and customised packages.",
};

export default function ServicesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Our services"
        title="Everything for your Umrah journey"
        description="Hotels, transport, packages, visas and full journey support for pilgrims, families and groups."
      />

      <section className="bg-cream py-10 dark:bg-ink-800 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-sm dark:border-white/10 dark:bg-ink-900">
            <Image
              src="/images/services-umrah-banner.png"
              alt="Pack your bags and embark on your Umrah journey with AA Travel Group"
              width={1024}
              height={387}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/umrah-packages">View Umrah Packages</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Request a Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      <ServicesGrid />
    </div>
  );
}
