import type { Metadata } from "next";
import { HotelCard } from "@/components/sections/hotel-card";
import { StarDivider } from "@/components/ui/star-divider";
import { getAllHotels } from "@/data/hotels";

export const metadata: Metadata = {
  title: "Hotels in Makkah & Madinah",
  description: "Browse AA Group Travels hotel options in Makkah and Madinah.",
};

const cityDetails = {
  MAKKAH: {
    title: "Makkah Hotels",
    eyebrow: "Stay close to Masjid al-Haram",
    description:
      "Comfortable Makkah hotel options for families and groups, with categories from practical stays to luxury suites.",
  },
  MADINAH: {
    title: "Madinah Hotels",
    eyebrow: "Stay close to Al-Masjid an-Nabawi",
    description:
      "Selected Madinah hotels for peaceful visits, group stays and tailored Umrah itineraries.",
  },
};

const hotelSelectionLists = {
  MADINAH: [
    {
      title: "Category 1 — Properties Near Women's Side",
      hotels: [
        "The Biltmore Madina",
        "Madinah Hilton",
        "Al Ageeg Madinah",
        "Dar Al Eiman Al Haram",
        "Taiba Front",
        "Taiba Suites",
        "Sofitel Shahd Al Madinah",
        "Anwar Al Madinah Movenpick",
        "Emaar Royal",
        "Worth Peninsula",
        "InterContinental Dar Al Hijra",
        "Dallah Taiba",
        "Artal International",
        "Kayaan International",
        "Zowar International",
        "Odst Al Madinah",
        "Dar Al Naseem",
        "Safwat Al Madinah",
        "Al Ansar Golden Tulip",
        "Grand Plaza Medina",
        "Grand Plaza Badr Al Magam",
        "Ritz Al Madinah",
        "Saja Al Madinah",
        "Shaza Regency",
        "Waqf Outhman Bin Affan",
        "Al Saha",
        "Mukhtara International",
      ],
    },
    {
      title: "Category 2 — 5-Star Properties (Bab As Salam / Qibla / Baqi Side)",
      hotels: [
        "Crowne Plaza IHG",
        "Pullman ZamZam Madinah",
        "Jayden Medina",
        "Tulip Inn Al Dar Rawafed",
        "Al Manakha Rotana",
        "Mysk Touch",
      ],
    },
    {
      title: "Category 3 — Budget-Friendly Properties",
      hotels: [
        "Sky View",
        "Nusuk Al Eman",
        "Bir Al Eiman",
        "Taif Al Nebras",
        "Rama Al Madinah",
        "Grand Zowar",
        "Mukhtara Gharbi",
        "Ancyra Medina",
        "Swiss International",
        "Gulnar Taiba",
        "Rowdat Al Mukhtara",
        "Nusuk Madina",
        "Ancyra Medina",
        "Nusuk Hijra",
        "Plaza Inn Ohud",
        "Rehab Al Mysk",
        "Artsafa Golden",
      ],
    },
  ],
  MAKKAH: [
    {
      title: "Category 1 — 5-Star Nearby Properties",
      hotels: [
        "Swissotel Makkah",
        "Swiss Al Magam",
        "Fairmont Royal Clock Tower",
        "Mövenpick Hajjar Tower",
        "Pullman Zamzam",
        "Al Marwa Rayhaan Rotana",
        "Raffles Makkah",
        "Makkah Towers & Hotel",
        "Address Jable Omer Makkah",
        "Marriot Makkah",
        "Hilton Convention",
        "Double Tree By Hilton",
        "Hyatt Regency",
        "Anjum Hotel Makkah",
        "Sheraton Makkah",
        "Al Safwa Towers & Hotel",
        "Dar Al Tawhid Intercontinental",
        "Hilton Suites",
        "Conrad Makkah",
        "Elaf Kinda",
        "Rotana Jable Omer",
      ],
    },
    {
      title: "Category 2 — Shuttle Service Properties",
      hotels: [
        "Voco Makkah (24/7)",
        "Le Meridien Towers (24/7)",
        "M Hotel Makkah By Millennium",
        "Al Kiswah Towers (24/7)",
        "Saja Makkah (24/7)",
        "Holiday InnNawazi Towers",
        "Hidaya Towers",
        "Novotel Thakher",
        "Park-in Raddison",
        "Four Points By Sheraton",
      ],
    },
    {
      title: "Category 3 — Budget-Friendly Properties (Walking Distance)",
      hotels: [
        "Worth Elite",
        "Saif Al Majd",
        "Bader Al Masa",
        "Al Masa Grand",
        "Elad Ajyad",
        "Emaar Andlusia",
        "Emaar Khalil",
        "Emaar Grand",
        "Emaar Sultan",
        "Tara Khalil",
        "Fajar Al Badea",
        "Nawarat Al Shams",
        "Majd Al Muhajireen",
        "Zilal Nazula",
      ],
    },
  ],
};

export default async function HotelsPage() {
  const hotels = getAllHotels();

  const makkahHotels = hotels.filter((hotel) => hotel.city === "MAKKAH");
  const madinahHotels = hotels.filter((hotel) => hotel.city === "MADINAH");
  const citySections = [
    { key: "MAKKAH", hotels: makkahHotels, ...cityDetails.MAKKAH },
    { key: "MADINAH", hotels: madinahHotels, ...cityDetails.MADINAH },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-500">AA Group Travels hotels</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-900 dark:text-white">Hotels in Makkah &amp; Madinah</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-400 dark:text-white/60">
          Browse hotel options for your Umrah journey.
        </p>
        <StarDivider />
      </div>

      <section className="mt-12">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-500">Hotel Selection Lists</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink-900 dark:text-white">Makkah &amp; Madinah Hotel Lists</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {(["MAKKAH", "MADINAH"] as const).map((cityKey) => (
            <div key={cityKey} className="rounded-2xl border border-ink-900/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800">
              <h3 className="font-display text-xl font-semibold text-ink-900 dark:text-white">{cityDetails[cityKey].title}</h3>
              <div className="mt-4 space-y-5">
                {hotelSelectionLists[cityKey].map((category) => (
                  <section key={category.title}>
                    <h4 className="text-sm font-semibold text-maroon-500 dark:text-gold-500">{category.title}</h4>
                    <ul className="mt-2 space-y-1 text-sm text-ink-700 dark:text-white/75">
                      {category.hotels.map((hotel, index) => (
                        <li key={`${category.title}-${hotel}-${index}`}>{hotel}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16 space-y-20">
        {citySections.map((section) => (
          <section key={section.key} id={section.key.toLowerCase()}>
            <div className="mb-8 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-500">{section.eyebrow}</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-400 dark:text-white/60">{section.description}</p>
            </div>
            {section.hotels.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {section.hotels.map((h) => (
                  <HotelCard
                    key={h.id}
                    hotel={{
                      slug: h.slug,
                      name: h.name,
                      city: h.city,
                      star: h.star,
                      distanceMeters: h.distanceMeters,
                      imageUrl: h.images?.[0]?.url,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-ink-900/15 bg-cream p-8 text-sm text-ink-400 dark:border-white/15 dark:bg-ink-800 dark:text-white/50">
                No {section.title.toLowerCase()} are available yet.
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
