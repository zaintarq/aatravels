import Image from "next/image";
import { StarDivider } from "@/components/ui/star-divider";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  showDivider?: boolean;
  children?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  className,
  showDivider = true,
  children,
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden bg-ink-900 px-4 py-24 text-white sm:px-6 lg:px-8", className)}>
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

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-200">{eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
        {description && (
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">{description}</p>
        )}
        {children}
        {showDivider && <StarDivider className="mt-6 opacity-80" />}
      </div>
    </section>
  );
}
