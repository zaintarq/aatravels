import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle, Mail, Clock3, MapPin, Facebook, Instagram } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { QuoteForm } from "@/components/sections/quote-form";
import { Button } from "@/components/ui/button";
import { SOCIAL_LINKS } from "@/lib/social";

export const metadata: Metadata = {
  title: "Contact & Quote",
  description: "Request a hotel or transport quotation for Makkah and Madinah with AA Travel Group.",
};

const points = [
  { icon: Clock3, title: "Fast replies", text: "Most quotes answered within UK office hours." },
  { icon: MapPin, title: "Makkah & Madinah", text: "Hotel stays and transfers arranged around your dates." },
  { icon: Mail, title: "Direct team", text: "Your request goes straight to our travel desk." },
];

export default function ContactPage() {
  return (
    <div>
      <PageHero
        eyebrow="Get in touch"
        title="Request your Umrah quotation"
        description="Tell us your dates, guests and preferences — we'll prepare hotel and transport options for your journey."
      />

      <section className="bg-cream py-10 dark:bg-ink-800 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-sm dark:border-white/10 dark:bg-ink-900">
            <Image
              src="/images/contact-banner.png"
              alt="Book your tickets, visas and hotels with AA Travel Group at lowest fares"
              width={1024}
              height={556}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-cream pb-16 pt-4 dark:bg-ink-800">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-8">
          <aside className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">How it works</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-400 dark:text-white/60">
                Share your trip details once. We check availability, prepare options, and reply with clear next steps.
              </p>
            </div>

            <ul className="space-y-5">
              {points.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-maroon-500/10 text-maroon-500">
                    <p.icon size={20} />
                  </span>
                  <div>
                    <p className="font-medium text-ink-900 dark:text-white">{p.title}</p>
                    <p className="mt-1 text-sm text-ink-400 dark:text-white/60">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl border border-ink-900/10 bg-white p-6 dark:border-white/10 dark:bg-ink-900">
              <p className="font-display text-lg font-semibold text-ink-900 dark:text-white">Prefer WhatsApp?</p>
              <p className="mt-2 text-sm text-ink-400 dark:text-white/60">
                Message the team directly with your travel dates and guest count.
              </p>
              <Button variant="whatsapp" className="mt-5" asChild>
                <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>
              </Button>
            </div>

            <div className="rounded-2xl border border-ink-900/10 bg-white p-6 dark:border-white/10 dark:bg-ink-900">
              <p className="font-display text-lg font-semibold text-ink-900 dark:text-white">Follow us</p>
              <p className="mt-2 text-sm text-ink-400 dark:text-white/60">
                Updates, offers and travel tips on Facebook and Instagram.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button variant="outline" asChild>
                  <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook size={16} /> Facebook
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram size={16} /> Instagram
                  </a>
                </Button>
              </div>
            </div>
          </aside>

          <div className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-ink-900">
            <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">Quote form</h2>
            <p className="mt-2 text-sm text-ink-400 dark:text-white/60">
              All fields help us quote accurately — optional ones can be left blank.
            </p>
            <div className="mt-8">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
