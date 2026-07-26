export const VISIT_VISA_COUNTRIES = [
  { id: "malaysia", label: "Malaysia", flag: "🇲🇾" },
  { id: "thailand", label: "Thailand", flag: "🇹🇭" },
  { id: "singapore", label: "Singapore", flag: "🇸🇬" },
  { id: "indonesia", label: "Indonesia", flag: "🇮🇩" },
  { id: "uzbekistan", label: "Uzbekistan", flag: "🇺🇿" },
  { id: "tajikistan", label: "Tajikistan", flag: "🇹🇯" },
  { id: "cambodia", label: "Cambodia", flag: "🇰🇭" },
  { id: "baku", label: "Baku (Azerbaijan)", flag: "🇦🇿" },
  { id: "kenya", label: "Kenya", flag: "🇰🇪" },
  { id: "nepal", label: "Nepal", flag: "🇳🇵" },
] as const;

export type VisitVisaCountryId = (typeof VISIT_VISA_COUNTRIES)[number]["id"];
