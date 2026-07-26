"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useTheme } from "@/components/layout/theme-provider";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/hotels", label: "Hotels" },
  { href: "/transport", label: "Transport" },
  { href: "/umrah-packages", label: "Umrah Packages" },
  { href: "/visit-visa", label: "Visit Visa" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-ink-900/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-ink-900/95">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo showWordmark={true} imageClassName="hidden" />

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium text-ink-700 transition-colors hover:text-maroon-500 dark:text-white/80 dark:hover:text-maroon-300",
                pathname === l.href && "text-maroon-500 dark:text-maroon-300"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className="rounded-full p-2 text-ink-700 hover:bg-ink-900/5 dark:text-white dark:hover:bg-white/10"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!loading && user ? (
            <>
              <span className="flex items-center gap-1.5 text-sm text-ink-700 dark:text-white/80">
                <User size={16} className="text-maroon-500" />
                @{user.username}
              </span>
              {user.isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/dashboard">Dashboard</Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut size={14} /> Sign out
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          )}

          <Button variant="whatsapp" size="sm" asChild>
            <a href="https://wa.me/447900007023" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
        </div>

        <button
          aria-label="Open menu"
          className="p-2 lg:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink-900/10 bg-white px-4 py-4 lg:hidden dark:border-white/10 dark:bg-ink-900">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-ink-700 dark:text-white/90"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-2">
              {!loading && user ? (
                <>
                  <p className="text-sm text-ink-400 dark:text-white/60">Signed in as @{user.username}</p>
                  {user.isAdmin && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Sign in
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
