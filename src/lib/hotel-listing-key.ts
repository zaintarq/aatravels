import type { HotelCity } from "@/data/hotel-listings";

export function hotelListingKey(city: HotelCity | string, name: string): string {
  return `${String(city).toUpperCase()}:${name.trim().toLowerCase()}`;
}

export function hotelListingDocId(key: string): string {
  return key.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
}
