import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { whatsappLink } from "@/lib/utils";
import { StarDivider } from "@/components/ui/star-divider";
import { Button } from "@/components/ui/button";
import { getPackageBySlug } from "@/data/packages";

export const runtime = "edge";

type PackagePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) return { title: "Package Not Found" };
  return { title: pkg.metaTitle || pkg.title, description: pkg.metaDescription || pkg.summary };
}

export default async function PackageDetailPage({ params }: PackagePageProps) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-500">{pkg.nights} Night Package</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900 dark:text-white">{pkg.title}</h1>
      <StarDivider className="justify-start" />
      <p className="mt-6 leading-relaxed text-ink-700 dark:text-white/80">{pkg.description}</p>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-white">Inclusions</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-ink-700 dark:text-white/70">{pkg.inclusions}</p>
        </div>
        {pkg.exclusions && (
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-white">Exclusions</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-ink-700 dark:text-white/70">{pkg.exclusions}</p>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="lg" asChild>
          <a
            href={whatsappLink(
              process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "447000000000",
              `Enquiry about ${pkg.title}`
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enquire on WhatsApp
          </a>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="/contact">Request a Quote</a>
        </Button>
      </div>
    </div>
  );
}
