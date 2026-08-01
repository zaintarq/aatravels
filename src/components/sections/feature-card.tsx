import Image from "next/image";
import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: LucideIcon;
};

export function FeatureCard({ title, description, imageSrc, imageAlt, icon: Icon }: FeatureCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-ink-900/10 bg-white transition-shadow hover:shadow-lg hover:shadow-maroon-500/5 dark:border-white/10 dark:bg-ink-900">
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-maroon-500 shadow-sm">
          <Icon size={20} />
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-400 dark:text-white/60">{description}</p>
      </div>
    </div>
  );
}
