import type { Metadata } from "next";
import { MessageCircle, Mail, Clock3, MapPin } from "lucide-react";
import { QuoteForm } from "@/components/sections/quote-form";
import { Button } from "@/components/ui/button";

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
      <section className="relative overflow-hidden bg-ink-900 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-900/40 via-transparent to-ink-900" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-200">Get in touch</p>
          <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Request your Umrah quotation</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">
            Tell us your dates, guests and preferences — we&apos;ll prepare hotel and transport options for your journey.
          </p>
        </div>
      </section>

      <section className="bg-cream py-16 dark:bg-ink-800">
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
                <a href="https://wa.me/447900007023" target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>
              </Button>
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
