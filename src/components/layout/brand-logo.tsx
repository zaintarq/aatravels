import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const BRAND_NAME = "AA Travel Group";

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
        alt={BRAND_NAME}
        width={160}
        height={160}
        priority
        className={cn("h-14 w-auto shrink-0 object-contain sm:h-16", imageClassName)}
      />
      {showWordmark && (
        <span
          className={cn(
            "font-brand text-base font-semibold leading-tight tracking-tight sm:text-lg",
            lightTextColor ? "text-white" : "text-ink-900 dark:text-white"
          )}
        >
          {BRAND_NAME}
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
