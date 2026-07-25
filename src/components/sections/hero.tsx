"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageCircle, Search, Car } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-ink-900">
      <Image
        src="/images/hero-madinah.png"
        alt="Al-Masjid an-Nabawi, Madinah"
        fill
        priority
        className="object-cover object-[35%_40%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-ink-900/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/55 to-ink-900/25" />

      <div className="relative mx-auto max-w-5xl px-4 py-32 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-maroon-200"
        >
          AA Travel Group &middot; Makkah &amp; Madinah
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          Hotels and Transport for Your <span className="text-maroon-200">Umrah</span> Journey
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base text-white/75 sm:text-lg"
        >
          Comfortable hotel options in Makkah and Madinah, with reliable transport for families and groups.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button variant="gold" size="lg" asChild>
            <Link href="/hotels"><Search size={18} /> Search Hotels</Link>
          </Button>
          <Button variant="whatsapp" size="lg" asChild>
            <a href="https://wa.me/447900007023" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} /> WhatsApp
            </a>
          </Button>
          <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
            <Link href="/transport"><Car size={18} /> Transport</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
