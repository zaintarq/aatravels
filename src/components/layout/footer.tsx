import Link from "next/link";
import Image from "next/image";
import { StarDivider } from "@/components/ui/star-divider";

export function Footer() {
  return (
    <footer className="border-t border-ink-900/10 bg-ink-900 text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/images/aa-travel-group-logo.png"
              alt="AA Group Travels"
              width={180}
              height={180}
              className="h-24 w-auto rounded-lg bg-white object-contain p-1"
            />
            <p className="mt-3 text-sm text-white/60">
              Hotel stays and transport services in Makkah &amp; Madinah for families and groups.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold-400">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><a href="https://wa.me/447900007023" target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold-400">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hotels" className="hover:text-white">Hotels</Link></li>
              <li><Link href="/transport" className="hover:text-white">Transport</Link></li>
              <li><Link href="/umrah-packages" className="hover:text-white">Umrah Packages</Link></li>
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
