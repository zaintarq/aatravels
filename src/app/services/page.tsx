import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesGrid } from "@/components/sections/services-grid";

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
      <ServicesGrid />
    </div>
  );
}
