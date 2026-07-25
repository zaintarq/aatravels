export type UmrahPackage = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  nights: number;
  city: string;
  priceFrom?: number;
  inclusions: string;
  exclusions?: string;
  imageUrl?: string;
  active: boolean;
  metaTitle?: string;
  metaDescription?: string;
};

export const packages: UmrahPackage[] = [
  {
    id: "pkg-economy-7",
    title: "7 Night Makkah & Madinah — Economy Package",
    slug: "7-night-makkah-madinah-economy",
    summary: "4 nights Makkah + 3 nights Madinah in 3-star hotels, with shared transfers.",
    description:
      "A budget-friendly Umrah package combining comfortable 3-star hotels close to both Haramain, with group airport and inter-city transfers included.",
    nights: 7,
    city: "MAKKAH,MADINAH",
    priceFrom: 499,
    inclusions: "Hotel accommodation, airport transfers, Makkah-Madinah transfer, Ziyarat tour",
    exclusions: "Flights, visa, meals unless stated",
    active: true,
    metaTitle: "7 Night Economy Umrah Package | AA Travel Group",
    metaDescription: "Affordable 7-night Makkah and Madinah Umrah package with transfers.",
  },
  {
    id: "pkg-comfort-10",
    title: "10 Night Comfort Umrah",
    slug: "10-night-comfort-umrah",
    summary: "Balanced 4–5 star stays with private transfers for families.",
    description:
      "A comfortable Umrah itinerary with carefully selected hotels, private airport transfers and flexible room allocations for families and small groups.",
    nights: 10,
    city: "MAKKAH,MADINAH",
    priceFrom: 899,
    inclusions: "4–5 star hotels, private transfers, local coordination support",
    exclusions: "Flights, visa, personal expenses",
    active: true,
  },
  {
    id: "pkg-premium-14",
    title: "14 Night Premium Haram Stay",
    slug: "14-night-premium-haram-stay",
    summary: "Extended premium stay with Haram-view options and VIP transport.",
    description:
      "An extended premium Umrah experience featuring higher-category hotels, VIP vehicle options and dedicated journey support throughout.",
    nights: 14,
    city: "MAKKAH,MADINAH",
    priceFrom: 1499,
    inclusions: "Premium hotels, VIP transfers, dedicated WhatsApp support",
    exclusions: "Flights, visa",
    active: true,
  },
];

export function getAllPackages() {
  return packages.filter((p) => p.active);
}

export function getPackageBySlug(slug: string) {
  return getAllPackages().find((p) => p.slug === slug) ?? null;
}
