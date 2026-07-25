export type HotelCity = "MAKKAH" | "MADINAH";

export type HotelCategoryKey =
  | "five_star"
  | "shuttle"
  | "budget"
  | "womens_side"
  | "five_star_bab";

export const CATEGORY_LABELS: Record<HotelCity, Partial<Record<HotelCategoryKey, string>>> = {
  MAKKAH: {
    five_star: "5-Star Nearby Properties",
    shuttle: "Shuttle Service Properties",
    budget: "Budget-Friendly (Walking Distance)",
  },
  MADINAH: {
    womens_side: "Near Women's Side",
    five_star_bab: "5-Star (Bab As Salam / Qibla / Baqi Side)",
    budget: "Budget-Friendly",
  },
};

export const CATEGORY_ORDER: Record<HotelCity, HotelCategoryKey[]> = {
  MAKKAH: ["five_star", "shuttle", "budget"],
  MADINAH: ["womens_side", "five_star_bab", "budget"],
};

/** Default hotel lists (seed). Admins can add more in Firestore. */
export const DEFAULT_HOTEL_LISTINGS: Array<{
  name: string;
  city: HotelCity;
  category: HotelCategoryKey;
}> = [
  // Makkah 5-star
  ...[
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
  ].map((name) => ({ name, city: "MAKKAH" as const, category: "five_star" as const })),
  // Makkah shuttle
  ...[
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
  ].map((name) => ({ name, city: "MAKKAH" as const, category: "shuttle" as const })),
  // Makkah budget
  ...[
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
  ].map((name) => ({ name, city: "MAKKAH" as const, category: "budget" as const })),
  // Madinah women's side
  ...[
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
  ].map((name) => ({ name, city: "MADINAH" as const, category: "womens_side" as const })),
  // Madinah 5-star bab
  ...[
    "Crowne Plaza IHG",
    "Pullman ZamZam Madinah",
    "Jayden Medina",
    "Tulip Inn Al Dar Rawafed",
    "Al Manakha Rotana",
    "Mysk Touch",
  ].map((name) => ({ name, city: "MADINAH" as const, category: "five_star_bab" as const })),
  // Madinah budget
  ...[
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
    "Nusuk Hijra",
    "Plaza Inn Ohud",
    "Rehab Al Mysk",
    "Artsafa Golden",
  ].map((name) => ({ name, city: "MADINAH" as const, category: "budget" as const })),
];
