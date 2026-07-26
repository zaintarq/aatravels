import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  showWordmark?: boolean;
  href?: string;
  lightTextColor?: boolean;
};

export function BrandLogo({
  className,
  imageClassName,
  showWordmark = true,
  href = "/",
  lightTextColor = false,
}: BrandLogoProps) {
  const content = (
    <>
      <Image
        src="/images/aa-travel-group-logo.png"
        alt="AA Group Travels"
        width={160}
        height={160}
        priority
        className={cn("h-14 w-auto shrink-0 object-contain sm:h-16", imageClassName)}
      />
      {showWordmark && (
        <span className="hidden min-w-0 flex-col leading-none sm:flex">
          <span className={cn("font-brand text-lg font-semibold tracking-tight", lightTextColor ? "text-white" : "text-ink-900 dark:text-white")}>
            AA Group
          </span>
          <span className={cn("font-brand mt-0.5 text-[11px] font-medium uppercase tracking-[0.35em]", lightTextColor ? "text-gold-400" : "text-maroon-500 dark:text-maroon-300")}>
            Travels
          </span>
        </span>
      )}
    </>
  );

  return (
    <Link href={href} className={cn("flex items-center gap-3", className)}>
      {content}
    </Link>
  );
}
