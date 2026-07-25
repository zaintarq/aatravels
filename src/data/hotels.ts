export type HotelStar = "THREE" | "FOUR" | "FIVE" | "LUXURY_SUITE";
export type HotelCity = "MAKKAH" | "MADINAH";

export type Hotel = {
  id: string;
  name: string;
  slug: string;
  city: HotelCity;
  star: HotelStar;
  description: string;
  distanceMeters: number;
  address: string;
  latitude?: number;
  longitude?: number;
  featured: boolean;
  active: boolean;
  metaTitle?: string;
  metaDescription?: string;
  images: Array<{ id: string; url: string; altText?: string }>;
  amenities: Array<{ id: string; name: string }>;
  rooms: Array<{
    id: string;
    name: string;
    capacity: number;
    bedType?: string;
    sizeSqm?: number;
  }>;
};

export const hotels: Hotel[] = [
  {
    id: "swissotel-al-maqam-makkah",
    name: "Swissotel Al Maqam Makkah",
    slug: "swissotel-al-maqam-makkah",
    city: "MAKKAH",
    star: "FIVE",
    description:
      "Part of the Abraj Al Bait complex with direct access to the Haram, offering spacious rooms and premium service for pilgrims and families.",
    distanceMeters: 150,
    address: "Abraj Al Bait, Ajyad Street, Makkah, Saudi Arabia",
    latitude: 21.4187,
    longitude: 39.8262,
    featured: true,
    active: true,
    metaTitle: "Swissotel Al Maqam Makkah | AA Travel Group",
    metaDescription: "Book Swissotel Al Maqam Makkah with direct hotel contract rates through AA Travel Group.",
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1600&auto=format&fit=crop",
        altText: "Swissotel Al Maqam Makkah",
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop",
        altText: "Hotel interior",
      },
    ],
    amenities: [
      { id: "a1", name: "Free WiFi" },
      { id: "a2", name: "Haram View" },
      { id: "a3", name: "24hr Reception" },
      { id: "a4", name: "Elevator" },
      { id: "a5", name: "Prayer Room" },
    ],
    rooms: [
      { id: "r1", name: "Deluxe Twin Room", capacity: 2, bedType: "Twin", sizeSqm: 32 },
      { id: "r2", name: "Haram View Suite", capacity: 4, bedType: "King + Sofa", sizeSqm: 55 },
    ],
  },
  {
    id: "fairmont-clock-tower",
    name: "Fairmont Makkah Clock Royal Tower",
    slug: "fairmont-makkah-clock-royal-tower",
    city: "MAKKAH",
    star: "LUXURY_SUITE",
    description:
      "Iconic clock tower stay with elevated views and refined hospitality steps from Masjid al-Haram.",
    distanceMeters: 100,
    address: "Abraj Al Bait, Makkah, Saudi Arabia",
    latitude: 21.4189,
    longitude: 39.8256,
    featured: true,
    active: true,
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
      },
    ],
    amenities: [
      { id: "a1", name: "Free WiFi" },
      { id: "a2", name: "Haram View" },
      { id: "a3", name: "Concierge" },
    ],
    rooms: [{ id: "r1", name: "Royal Room", capacity: 3, bedType: "King", sizeSqm: 40 }],
  },
  {
    id: "anwar-al-madinah-movenpick",
    name: "Anwar Al Madinah Mövenpick",
    slug: "anwar-al-madinah-movenpick",
    city: "MADINAH",
    star: "FIVE",
    description:
      "A refined Madinah stay close to the Prophet's Mosque, ideal for families and group allocations.",
    distanceMeters: 200,
    address: "Central Area, Madinah, Saudi Arabia",
    latitude: 24.4672,
    longitude: 39.6111,
    featured: true,
    active: true,
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1600&auto=format&fit=crop",
      },
    ],
    amenities: [
      { id: "a1", name: "Free WiFi" },
      { id: "a2", name: "Breakfast Included" },
      { id: "a3", name: "Airport Shuttle" },
    ],
    rooms: [{ id: "r1", name: "Superior Twin", capacity: 2, bedType: "Twin", sizeSqm: 28 }],
  },
  {
    id: "hilton-madinah",
    name: "Madinah Hilton",
    slug: "madinah-hilton",
    city: "MADINAH",
    star: "FIVE",
    description:
      "Trusted Hilton hospitality with comfortable rooms and easy access for Umrah travellers.",
    distanceMeters: 350,
    address: "Madinah, Saudi Arabia",
    featured: false,
    active: true,
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1600&auto=format&fit=crop",
      },
    ],
    amenities: [
      { id: "a1", name: "Free WiFi" },
      { id: "a2", name: "24hr Reception" },
    ],
    rooms: [{ id: "r1", name: "Guest Room", capacity: 2, bedType: "Twin", sizeSqm: 26 }],
  },
];

export function getAllHotels() {
  return hotels.filter((h) => h.active);
}

export function getFeaturedHotels() {
  return getAllHotels().filter((h) => h.featured);
}

export function getHotelBySlug(slug: string) {
  return getAllHotels().find((h) => h.slug === slug) ?? null;
}

export function getRelatedHotels(city: HotelCity, excludeId: string, take = 3) {
  return getAllHotels()
    .filter((h) => h.city === city && h.id !== excludeId)
    .slice(0, take);
}
