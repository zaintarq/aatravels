"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** Staff use the same /login page — redirect here for old bookmarks. */
export default function AdminLoginRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin/dashboard";

  useEffect(() => {
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [router, next]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-ink-400 dark:text-white/60">
      Redirecting to sign in…
    </div>
  );
}
