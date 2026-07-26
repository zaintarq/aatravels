import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});
const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aatravels.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AA Travel Group | Umrah Hotels & Travel Services",
    template: "%s | AA Travel Group",
  },
  description:
    "AA Travel Group provides hotel stays and transport services in Makkah & Madinah for pilgrims, families and groups.",
  openGraph: {
    type: "website",
    siteName: "AA Travel Group",
    title: "AA Travel Group | Umrah Hotels & Travel Services",
    description: "Hotels and transport in Makkah & Madinah for Umrah journeys.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "AA Travel Group",
    description: "Hotels and transport in Makkah & Madinah.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} font-body antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
