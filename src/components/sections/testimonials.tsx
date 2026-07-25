"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { StarDivider } from "@/components/ui/star-divider";

const testimonials = [
  {
    name: "Yusuf Rahman",
    type: "Travel Agent, Birmingham",
    quote:
      "The team gave us clear hotel choices and fast quotations. Everything was arranged smoothly for our group.",
  },
  {
    name: "The Iqbal Family",
    type: "Pilgrims, Manchester",
    quote:
      "Our Haram-view room and the transfer coordination made a stressful trip feel completely taken care of.",
  },
  {
    name: "Aisha Noor",
    type: "Solo Pilgrim, London",
    quote:
      "Clear communication throughout and a WhatsApp line that actually answers. Booking again for Hajj.",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];

  return (
    <section className="bg-cream py-24 dark:bg-ink-800">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-500">Testimonials</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900 dark:text-white">What our travellers say</h2>
        <StarDivider />

        <div className="mt-10 rounded-2xl border border-ink-900/10 bg-white p-10 dark:border-white/10 dark:bg-ink-900">
          <Quote className="mx-auto mb-4 text-maroon-300" />
          <div className="mb-4 flex justify-center gap-1 text-maroon-300">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
          </div>
          <p className="font-display text-xl leading-relaxed text-ink-900 dark:text-white">&ldquo;{t.quote}&rdquo;</p>
          <p className="mt-6 text-sm font-semibold text-ink-900 dark:text-white">{t.name}</p>
          <p className="text-xs text-ink-400 dark:text-white/50">{t.type}</p>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            aria-label="Previous testimonial"
            onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
            className="rounded-full border border-ink-900/15 p-2 hover:bg-ink-900/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Next testimonial"
            onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
            className="rounded-full border border-ink-900/15 p-2 hover:bg-ink-900/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
