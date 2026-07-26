"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const cards = [
  { href: "/admin/dashboard/hotels", title: "Hotels", desc: "Add or remove hotel names on Makkah & Madinah lists" },
  { href: "/admin/dashboard/packages", title: "Packages & Deals", desc: "Add or remove Umrah packages and special offers" },
  { href: "/admin/dashboard/enquiries", title: "Enquiries", desc: "View and manage general enquiries" },
  { href: "/admin/dashboard/visa-enquiries", title: "Visa Enquiries", desc: "View and manage visa enquiries" },
  { href: "/admin/dashboard/newsletter", title: "Newsletter", desc: "View and manage newsletter subscribers" },
];

export default function AdminDashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.replace("/login?next=/admin/dashboard");
    }
  }, [user, loading, router]);

  if (loading || !user?.isAdmin) {
    return <p className="p-10 text-center text-sm text-ink-400">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-400">Signed in as @{user.username}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-ink-900/10 bg-white p-6 transition hover:border-maroon-300 dark:border-white/10 dark:bg-ink-800"
          >
            <p className="font-display text-xl font-semibold text-ink-900 dark:text-white">{c.title}</p>
            <p className="mt-2 text-sm text-ink-400 dark:text-white/60">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
