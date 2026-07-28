import type { Metadata } from "next";
import { Globe2, FileCheck, Clock3 } from "lucide-react";
import { VisaInquiryForm } from "@/components/sections/visa-inquiry-form";
import { VISIT_VISA_COUNTRIES } from "@/data/visit-visa-countries";

export const metadata: Metadata = {
  title: "Visit Visa",
  description:
    "Apply for visit visas to Malaysia, Thailand, Singapore, Indonesia, Uzbekistan, Tajikistan, Cambodia, Baku, Kenya, Nepal and more with AA Travel Group.",
};

const highlights = [
  {
    icon: Globe2,
    title: "Multiple destinations",
    text: "We handle visit visa enquiries for popular countries across Asia, Central Asia and Africa.",
  },
  {
    icon: FileCheck,
    title: "Clear guidance",
    text: "Tell us your passport country and destination — we advise on documents and next steps.",
  },
  {
    icon: Clock3,
    title: "Fast follow-up",
    text: "Our team responds during UK office hours with requirements and processing guidance.",
  },
];

export default function VisitVisaPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-ink-900 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-900/50 via-transparent to-ink-900" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-200">Visit visa services</p>
          <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Visit Visa Enquiry</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">
            Which country&apos;s visa do you need? Choose your destination below and send us your details — we&apos;ll
            guide you through requirements and processing.
          </p>
        </div>
      </section>

      <section className="bg-cream py-16 dark:bg-ink-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-ink-900/10 bg-white p-6 dark:border-white/10 dark:bg-ink-900"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-maroon-500/10 text-maroon-500">
                  <item.icon size={20} />
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold text-ink-900 dark:text-white">{item.title}</h2>
                <p className="mt-2 text-sm text-ink-500 dark:text-white/60">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
            <aside>
              <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">Countries we cover</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500 dark:text-white/60">
                Select the destination you need a visit visa for. If you&apos;re unsure, mention it in the form and our
                team will advise.
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {VISIT_VISA_COUNTRIES.map((country) => (
                  <li
                    key={country.id}
                    className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-medium text-ink-800 dark:border-white/10 dark:bg-ink-900 dark:text-white/90"
                  >
                    <span aria-hidden>{country.flag}</span>
                    {country.label}
                  </li>
                ))}
              </ul>
            </aside>

            <VisaInquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
}
