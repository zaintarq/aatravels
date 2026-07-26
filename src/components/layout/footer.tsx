import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { StarDivider } from "@/components/ui/star-divider";
import { BrandLogo } from "@/components/layout/brand-logo";
import { SOCIAL_LINKS } from "@/lib/social";

export function Footer() {
  return (
    <footer className="border-t border-ink-900/10 bg-ink-900 text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <BrandLogo showWordmark imageClassName="hidden" />
            <p className="mt-3 text-sm text-white/60">
              Hotel stays and transport services in Makkah &amp; Madinah for families and groups.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white"
              >
                <Facebook size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white"
              >
                <Instagram size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-[#25D366] hover:text-[#25D366]"
              >
                <span className="text-xs font-bold">WA</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold-400">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a></li>
              <li><a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a></li>
              <li><a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold-400">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hotels" className="hover:text-white">Hotels</Link></li>
              <li><Link href="/transport" className="hover:text-white">Transport</Link></li>
              <li><Link href="/umrah-packages" className="hover:text-white">Umrah Packages</Link></li>
              <li><Link href="/visit-visa" className="hover:text-white">Visit Visa</Link></li>
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold-400">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
              <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <StarDivider className="my-10 opacity-60" />
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} AA Group Travels. All rights reserved.</p>
          <p>Registered Travel Company &mdash; England &amp; Wales</p>
        </div>
      </div>
    </footer>
  );
}
