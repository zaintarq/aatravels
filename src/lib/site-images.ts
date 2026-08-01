export const sitePromoImages = [
  {
    src: "/images/hero-makkah.png",
    alt: "Masjid al-Haram, Makkah",
  },
  {
    src: "/images/hero-madinah.png",
    alt: "Al-Masjid an-Nabawi, Madinah",
  },
  {
    src: "/images/hero-transport.png",
    alt: "Air travel for Umrah journeys",
  },
  {
    src: "/images/services-umrah-banner.png",
    alt: "Umrah journey with AA Travel Group",
  },
  {
    src: "/images/contact-banner.png",
    alt: "Book tickets, visas and hotels with AA Travel Group",
  },
  {
    src: "/images/hotels/makkah-hotels-selection.jpeg",
    alt: "Hotels near the Haram in Makkah",
  },
  {
    src: "/images/hotels/madinah-hotels-selection.jpeg",
    alt: "Hotels near the Prophet's Mosque in Madinah",
  },
  {
    src: "/images/airport-transport-car.png",
    alt: "Private VIP transport vehicle",
  },
  {
    src: "/images/air-tickets-promo.png",
    alt: "AA Travel Group air tickets and flights",
  },
  {
    src: "/images/customised-packages.png",
    alt: "Customised Umrah packages with AA Travel Group",
  },
  {
    src: "/images/makkah-madinah-transport.png",
    alt: "Luxury transport between Makkah and Madinah",
  },
  {
    src: "/images/private-transport.png",
    alt: "Private transport with AA Travel Group",
  },
] as const;

/** Pick images for cards — cycles through the pool so each card gets a different photo. */
export function cardImages(count: number, offset = 0) {
  return Array.from({ length: count }, (_, i) => sitePromoImages[(i + offset) % sitePromoImages.length]);
}
